// build the beta: avatars and portraits go to separate cached files, item skin CSS to a separate stylesheet loaded after first paint,
// CSS/JS/HTML get minified.  usage: node tools/build.js index.html <outDir>
const fs=require('fs'), path=require('path'), crypto=require('crypto'), CleanCSS=require('clean-css'), {minify}=require('terser'), hm=require('html-minifier-terser');
const md5=x=>crypto.createHash('md5').update(x).digest('hex').slice(0,8);
// split minified CSS into [core, items]: top-level rules whose every selector is about an item skin go to items
function splitCss(css){ const ITEM=/\[data-ck=|\[data-dice=|\[data-b=|data-table=[a-z]|\.fr-[a-z0-9]/; let core='', items='', i=0;
  while(i<css.length){ const ob=css.indexOf('{',i); if(ob<0){ core+=css.slice(i); break; } const head=css.slice(i,ob);
    let d=1, j=ob+1; while(j<css.length && d){ if(css[j]==='{') d++; else if(css[j]==='}') d--; j++; } const rule=css.slice(i,j);
    if(head.trim().startsWith('@')) core+=rule; else { const sels=head.split(','); if(sels.every(x=>ITEM.test(x)) && !/body\[data-table\]:not|auto\]/.test(head)) items+=rule; else core+=rule; }
    i=j; }
  return [core,items]; }
(async()=>{ const [src,outDir]=process.argv.slice(2); let s=fs.readFileSync(src,'utf8');
  // every release must be in the in-game "What's new" list (NEWS); beta builds are exempt
  { const v=(s.match(/const APP_VERSION='([^']+)'/)||[])[1]; if(v && !v.includes('beta') && s.includes('const NEWS=[') && !s.includes("{v:'"+v+"'") && !s.includes('{v:"'+v+'"')){ console.error('NEWS has no entry for v'+v+' — add it to the "What\'s new" list'); process.exit(1); } }
  const a=s.indexOf('const AVATARS='), b=s.indexOf('\n',a); const all=JSON.parse(s.slice(a+'const AVATARS='.length,b).trim().replace(/;$/,''));
  const keys=Object.keys(all), base={}, pt={}; keys.forEach(k=>{ (/^pt\d+$/.test(k)?pt:base)[k]=all[k]; });
  const av='window.__AV='+JSON.stringify(base)+';window.__avReady&&window.__avReady();', ptjs='window.__PT='+JSON.stringify(pt)+';window.__ptReady&&window.__ptReady();';
  const h=md5(av), hp=md5(ptjs); fs.writeFileSync(path.join(outDir,'av.js'),av); if(Object.keys(pt).length) fs.writeFileSync(path.join(outDir,'pt.js'),ptjs);
  s=s.slice(0,a)+'const AVATARS={};'+s.slice(b);
  // the English texts go to en.js (loaded before the app only for English, or when switching), the old «What's new» entries to news.js
  { const i=s.indexOf('\n en:{'), j=s.indexOf('\n uk:{'); if(i>0 && j>i){ const blk=s.slice(i+1,j); const obj=blk.trim().replace(/^en:/,'').replace(/,\s*$/,''); const en='window.__EN='+obj+';';
      const he=md5(en); fs.writeFileSync(path.join(outDir,'en.js'),en); s=s.slice(0,i+1)+' en:(window.__EN||{}),'+s.slice(j);
      let hr=''; const rp=path.join(path.dirname(src),'ru.json'); if(fs.existsSync(rp)){ const ru='window.__RU='+JSON.stringify(JSON.parse(fs.readFileSync(rp,'utf8')))+';'; hr=md5(ru); fs.writeFileSync(path.join(outDir,'ru.js'),ru); }
      const boot='<script>window.__ENSRC="en.js?v='+he+'";'+(hr?'window.__RUSRC="ru.js?v='+hr+'";':'')+'(function(){var l=null;try{l=JSON.parse(localStorage.getItem("nardy_lang"))}catch(e){}if(!l){var n=(navigator.language||"en").toLowerCase();l=n.indexOf("uk")===0?"uk":/^(ru|be|kk|ky)/.test(n)?"ru":"en";}if(l==="en")document.write(\'<script src="en.js?v='+he+'"><\\/script>\');'+(hr?'if(l==="ru")document.write(\'<script src="ru.js?v='+hr+'"><\\/script>\');':'')+'})();</script>';
      s=s.replace('<script async id="sbjs"', boot+'<script async id="sbjs"'); } }
  { const i=s.indexOf('let NEWS=[\n'), j=i<0?-1:s.indexOf('\n];',i); if(i>=0 && j>i){ const body=s.slice(i+'let NEWS=['.length, j+2); const news='window.__NEWS=['+body+';'; const hn=md5(news); fs.writeFileSync(path.join(outDir,'news.js'),news);
      const first=s.slice(i+'let NEWS=[\n'.length).split('\n')[0].replace(/,\s*$/,''); s=s.slice(0,i)+'window.__NEWSSRC="news.js?v='+hn+'"; let NEWS=['+first+'];'+s.slice(j+3); } }
  s=s.replace('const AV_KEYS=Object.keys(AVATARS);','const AV_KEYS='+JSON.stringify(keys)+';');
  s=s.replace(/\nboot\(\);\n/,`
function refreshAvatars(){ document.querySelectorAll('.av[data-av]').forEach(el=>{ if(el.dataset.av && !el.closest('.frl')) avatarInto(el, el.dataset.av, el.dataset.nm); }); try{ renderMeAvatar(); }catch(e){} try{ renderHomeV7(); }catch(e){} try{ if(gs) route(); }catch(e){} }
window.__avReady=function(){ Object.assign(AVATARS, window.__AV||{}); if(typeof SKIN_CACHE!=='undefined') for(const k in SKIN_CACHE) delete SKIN_CACHE[k]; refreshAvatars(); };
window.__ptReady=function(){ Object.assign(AVATARS, window.__PT||{}); refreshAvatars(); };
if(window.__AV) window.__avReady();
// portraits are only needed for some players: fetch them when the page is idle
${Object.keys(pt).length ? "window.__ptLoad=function(){ if(window.__ptAsked) return; window.__ptAsked=1; const sc=document.createElement('script'); sc.async=true; sc.src='pt.js?v="+hp+"'; document.head.appendChild(sc); }; addEventListener('load',()=>setTimeout(()=>(window.requestIdleCallback||setTimeout)(window.__ptLoad,{timeout:3000}),3500));" : ''}
boot();
`);
  // 0.49: avatars after the page itself — on a slow network the page gets the whole bandwidth first
  s=s.replace(/<\/body>(?![\s\S]*<\/body>)/,'<script async src="av.js?v='+h+'"></script></body>');
  let items='';
  s=s.replace(/<style>([\s\S]*?)<\/style>/g,(m,c)=>{ const min=new CleanCSS({level:1}).minify(c).styles; const [core,it]=splitCss(min); items+=it; return '<style>'+core+'</style>'; });
  const hs=md5(items); fs.writeFileSync(path.join(outDir,'skins.css'),items);
  // the skins stylesheet: preloaded at once, applied without blocking the first paint
  s=s.replace(/<\/body>(?![\s\S]*<\/body>)/,'<link rel="stylesheet" href="skins.css?v='+hs+'" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="skins.css?v='+hs+'"></noscript></body>');
  const parts=[]; let re=/<script>([\s\S]*?)<\/script>/g, m; while((m=re.exec(s))) parts.push(m);
  for(const p of parts.reverse()){ const r=await minify(p[1],{compress:{passes:1},mangle:true,format:{comments:false}}); s=s.slice(0,p.index)+'<script>'+r.code+'</script>'+s.slice(p.index+p[0].length); }
  s=await hm.minify(s,{collapseWhitespace:true,conservativeCollapse:true,removeComments:true});
  fs.writeFileSync(path.join(outDir,'index.html'),s); console.log('index',s.length,'av',av.length,'pt',ptjs.length,'skins',items.length); })();
