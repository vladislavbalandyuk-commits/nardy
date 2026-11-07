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
  s=s.replace('const AV_KEYS=Object.keys(AVATARS);','const AV_KEYS='+JSON.stringify(keys)+';');
  s=s.replace(/\nboot\(\);\n/,`
function refreshAvatars(){ document.querySelectorAll('.av[data-av]').forEach(el=>{ if(el.dataset.av && !el.closest('.frl')) avatarInto(el, el.dataset.av, el.dataset.nm); }); try{ renderMeAvatar(); }catch(e){} try{ renderHomeV7(); }catch(e){} try{ if(gs) route(); }catch(e){} }
window.__avReady=function(){ Object.assign(AVATARS, window.__AV||{}); if(typeof SKIN_CACHE!=='undefined') for(const k in SKIN_CACHE) delete SKIN_CACHE[k]; refreshAvatars(); };
window.__ptReady=function(){ Object.assign(AVATARS, window.__PT||{}); refreshAvatars(); };
if(window.__AV) window.__avReady();
// portraits are only needed for some players: fetch them when the page is idle
${Object.keys(pt).length ? "(window.requestIdleCallback||setTimeout)(()=>{ const sc=document.createElement('script'); sc.async=true; sc.src='pt.js?v="+hp+"'; document.head.appendChild(sc); }, {timeout:2500});" : ''}
boot();
`);
  s=s.replace('<script async id="sbjs"','<script async src="av.js?v='+h+'"></script><script async id="sbjs"');
  let items='';
  s=s.replace(/<style>([\s\S]*?)<\/style>/g,(m,c)=>{ const min=new CleanCSS({level:1}).minify(c).styles; const [core,it]=splitCss(min); items+=it; return '<style>'+core+'</style>'; });
  const hs=md5(items); fs.writeFileSync(path.join(outDir,'skins.css'),items);
  // the skins stylesheet: preloaded at once, applied without blocking the first paint
  s=s.replace('</head>','<link rel="preload" href="skins.css?v='+hs+'" as="style"><link rel="stylesheet" href="skins.css?v='+hs+'" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="skins.css?v='+hs+'"></noscript></head>');
  const parts=[]; let re=/<script>([\s\S]*?)<\/script>/g, m; while((m=re.exec(s))) parts.push(m);
  for(const p of parts.reverse()){ const r=await minify(p[1],{compress:{passes:1},mangle:true,format:{comments:false}}); s=s.slice(0,p.index)+'<script>'+r.code+'</script>'+s.slice(p.index+p[0].length); }
  s=await hm.minify(s,{collapseWhitespace:true,conservativeCollapse:true,removeComments:true});
  fs.writeFileSync(path.join(outDir,'index.html'),s); console.log('index',s.length,'av',av.length,'pt',ptjs.length,'skins',items.length); })();
