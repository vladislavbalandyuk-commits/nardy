// 0.31.0: campaign avatars made from the CC0 Notionists «vlad» / «pasha» (av.js): vladM (the Master, hood up), mask (the hooded Master before the reveal), vlad2 / pasha2 (festive, after the campaign)
const fs=require('fs'); global.window={}; require(process.argv[2]||'../av.js'); const A=window.__AV;
const strip=s=>s.replace(/<metadata[\s\S]*?<\/metadata>/,'');
const groups=s=>{ const i=s.indexOf('<g transform'); const head=s.slice(0,i); const tail=s.slice(s.lastIndexOf('</g></svg>')); const body=s.slice(i,s.lastIndexOf('</g></svg>')); const G=[]; let d=0,st=0; for(let k=0;k<body.length;k++){ if(body.startsWith('<g',k)){ if(d===0) st=k; d++; } else if(body.startsWith('</g>',k)){ d--; if(d===0) G.push(body.slice(st,k+4)); } } return {head,G,tail}; };
const HOOD_BACK='<path d="M440 1320C400 980 450 470 760 360C900 310 1060 320 1180 380C1440 520 1470 980 1420 1320Z" fill="#17171d" stroke="#000" stroke-width="16"/>';
const HOOD_RIM =(c)=>'<path d="M520 1060C500 780 560 520 760 420C890 360 1050 365 1170 430C1340 530 1390 790 1360 1060L1260 1060C1270 860 1230 700 1140 630C1040 560 880 560 790 620C680 700 640 860 650 1060Z" fill="#23232b" stroke="'+(c||'#000')+'" stroke-width="14" stroke-linejoin="round"/>';
const out={};
{ // the Master: Vlad, hood up, gold cords, a dark marble background
  const {head,G,tail}=groups(strip(A.vlad)); const h=head.replace('fill="#c9d6e8"','fill="#2a2433"');
  const body=G[1].replace(/fill="#1d1d22"/,'fill="#17171d"').replace(/fill="#fff"/g,'fill="#e0b54a"');
  out.vladM=h+'<path d="M0 300C300 360 520 200 900 260S1500 120 1744 220" stroke="#3a3346" stroke-width="10" fill="none"/><path d="M0 1500C400 1420 800 1560 1744 1440" stroke="#3a3346" stroke-width="8" fill="none"/>'+HOOD_BACK+G[0]+body+G.slice(3).join('')+HOOD_RIM('#e0b54a')+tail; }
{ // the hooded Master before the reveal: no face, two eyes in the dark
  const {head,G,tail}=groups(strip(A.vlad)); const h=head.replace('fill="#c9d6e8"','fill="#1c1a22"');
  const body=G[1].replace(/fill="#1d1d22"/,'fill="#111115"').replace(/fill="#fff"/g,'fill="#2c2c34"');
  out.mask=h+HOOD_BACK+body+'<ellipse cx="955" cy="860" rx="320" ry="330" fill="#050507"/>'+HOOD_RIM()+'<ellipse cx="870" cy="860" rx="34" ry="16" fill="#e0b54a"/><ellipse cx="1040" cy="860" rx="34" ry="16" fill="#e0b54a"/>'+tail; }
{ // festive Vlad: an emerald hoodie
  const {head,G,tail}=groups(strip(A.vlad)); out.vlad2=head.replace('fill="#c9d6e8"','fill="#f1e2c6"')+G[0]+G[1].replace(/fill="#1d1d22"/,'fill="#1f7a55"')+G.slice(2).join('')+tail; }
{ // festive Pasha: a Hawaiian shirt
  const {head,G,tail}=groups(strip(A.pasha)); const bodyPath=(G[1].match(/<path d="([^"]*)" fill="#7a5440"/)||[])[1]; const tr=(G[1].match(/translate\(([^)]*)\)/)||[])[1];
  let dots=''; const C=['#ff5f8f','#ffd36b','#ffffff','#7be0c3']; let s=7; const R=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<90;i++){ const x=R()*1500, y=R()*700, r=18+R()*26; dots+='<circle cx="'+x.toFixed(0)+'" cy="'+y.toFixed(0)+'" r="'+r.toFixed(0)+'" fill="'+C[i%4]+'"/>'; }
  const body=G[1].replace('fill="#7a5440"','fill="#2aa7a1"').replace('<g transform="translate('+tr+')">','<g transform="translate('+tr+')"><clipPath id="hw"><path d="'+bodyPath+'"/></clipPath>');
  const pat='<g transform="translate('+tr+')" clip-path="url(#hw)">'+dots+'</g>';
  // keep the outline over the dots: the body group again without its fill
  const outline=G[1].replace('fill="#7a5440"','fill="none"');
  out.pasha2=head.replace('fill="#f2d3b1"','fill="#ffd7a8"')+G[0]+body+pat+outline+G.slice(2).join('')+tail; }
if(process.argv[3]==='--files'){ for(const k in out) fs.writeFileSync('/tmp/avx/'+k+'.svg',out[k]); } else process.stdout.write(JSON.stringify(out));
