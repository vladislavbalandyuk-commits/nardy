// Tavern balance sim: 8 players per lobby, each with a faction strategy, real shop/pool/play/eot code from the game, pure combat copy.
const {chromium}=require('playwright'); const LOBBIES=+process.env.N||300;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'}); const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/?skip=1'); await p.waitForTimeout(2500);
const out=await p.evaluate((LOBBIES)=>{
 window.tvSnd=()=>{}; const noop=()=>{};
 const pick=O=>{ const tn=O.filter(u=>u.kw.includes('taunt')); return tvRand(tn.length?tn:O); };
 function fight(A,B){ A=A.map(tvCl); B=B.map(tvCl); const sides=[A,B];
  for(const [S,O] of [[A,B],[B,A]]){ const nm=S.filter(u=>u.f==='master').length;
   S.slice().forEach((u,i)=>{ if(u.f==='guard'){ [S[i-1],S[i+1]].forEach(x=>{ if(x){ x.a+=1; x.h+=1; } }); }
    if(u.f==='master'&&nm>1){ u.a+=nm-1; u.h+=nm-1; }
    if(u.k==='trick'&&O.length){ for(let k=0;k<u.g;k++){ const x=tvRand(O); x.a=Math.max(0,x.a-3); } }
    if(u.k==='khan') S.forEach(x=>{ if(x!==u&&x.f==='guard') x.h+=2*u.g; });
    if(u.k==='captain') S.forEach(x=>{ if(x.f==='guard'){ x.a+=2*u.g; x.h+=2*u.g; } });
    if(u.k==='grand'){ const o=S.filter(x=>x!==u&&!x.kw.includes('wind')).sort((p,q)=>q.a-p.a)[0]; if(o) o.kw.push('wind'); }
    if(u.k==='pasha'&&S[0]&&!S[0].kw.includes('wind')) S[0].kw.push('wind'); }); }
  let turn=A.length>B.length?0:B.length>A.length?1:Math.random()<.5?0:1; const ptr=[0,0]; let guard=0;
  const hitTo=(u,d,v)=>{ if(d<=0) return 0; if(u.sh){ u.sh=false; return 'b'; } u.h-=d; if(v&&u.h>0) u.h=0; return d; };
  const settle=S0=>{ for(const side of sides){ for(let j=side.length-1;j>=0;j--){ const u=side[j]; if(u.h>0) continue; side.splice(j,1); if(side===S0&&j<ptr[S0===A?0:1]) ptr[S0===A?0:1]--;
     if(u.rb) side.splice(j,0,{...tvCl(u),h:1,rb:false,sh:false,kw:u.kw.filter(k=>k!=='reborn')});
     if(u.k==='mayor') for(let k=0;k<2*u.g;k++) if(side.length<7) side.splice(j,0,{...tvMk(tvDef('ap')),a:2,h:2});
     if(u.k==='bro') for(let k=0;k<u.g;k++) if(side.length<7) side.splice(j,0,tvMk(tvDef('ap')));
     if(u.k==='yard'){ const r=side.filter(x=>x.h>0); if(r.length) r[r.length-1].a+=2*u.g; }
     if(u.k==='king') side.forEach(x=>{ if(x.f==='yard'){ x.a+=2*u.g; x.h+=2*u.g; } });
     if(u.f==='yard'){ const ys=side.filter(x=>x.f==='yard'&&x.h>0); if(ys.length){ const x=tvRand(ys); x.a+=1; x.h+=1; } }
     side.forEach(x=>{ if(x.h<=0) return; if(x.k==='vlad'){ x.a+=x.g; x.h+=x.g; } if(x.k==='bench'){ x.ac=(x.ac||0)+1; if(x.ac%3===0){ x.a+=3*x.g; x.h+=3*x.g; } } }); } } };
  while(A.length&&B.length&&guard++<300){ const S=turn?B:A, O=turn?A:B; if(ptr[turn]>=S.length) ptr[turn]=0; const att=S[ptr[turn]]; let times=att.kw.includes('wind')?2:1;
   if(att.a<=0){ ptr[turn]++; turn=1-turn; if(A.every(u=>u.a<=0)&&B.every(u=>u.a<=0)) break; continue; }
   for(let k=0;k<times&&O.length&&S.includes(att)&&att.h>0;k++){ const def=pick(O); const six=att.f==='sharp'&&Math.random()<1/3; const r1=hitTo(def,att.a*(six?2:1),att.kw.includes('venom')), r2=hitTo(att,def.a,def.kw.includes('venom'));
    if(def.k==='bear'&&def.h>0&&typeof r1==='number'&&r1>0) def.a+=def.g; if(att.k==='bear'&&att.h>0&&typeof r2==='number'&&r2>0) att.a+=att.g;
    if(att.k==='cheat'&&att.h>0&&k===times-1&&times<3&&Math.random()<1/3) times++; settle(S); }
   if(S.includes(att)) ptr[turn]++; turn=1-turn; }
  return A.length&&!B.length?[1,A]:B.length&&!A.length?[-1,B]:[0,[]]; }
 const FACS=['yard','hook','guard','sharp','master','trade'];
 const res={}; FACS.concat(['rand']).forEach(f=>res[f]={place:0,n:0,top4:0,win:0}); const unitStat={};
 const realPaint=tvPaint; tvPaint=noop; window.tvFxList=noop;
 for(let L=0;L<LOBBIES;L++){
  window.__tvNoSearch=1; TV={round:1,gold:3,tier:1,upCost:6,frozen:false,hp:30,band:[],hand:[],shop:[],phase:'hire',pick:null,speed:1,powerUsed:false,boughtThis:false,bots:[]};
  TV.pool={}; TV_U.forEach(d=>{ if(d[0]!=='ap') TV.pool[d[0]]=[0,16,15,13,11,9][d[3]]; });
  const strat=FACS.concat(['rand',tvRand(FACS)]).sort(()=>Math.random()-.5);
  const P=strat.map(s=>({s,hp:30,band:[],tier:1,up:6,shop:[],alive:true,freeRe:0}));
  const dead=[];
  for(let R=1;R<40&&P.filter(x=>x.alive).length>1;R++){
   for(const pl of P){ if(!pl.alive) continue; TV.band=pl.band; TV.hand=[]; TV.tier=pl.tier; TV.round=R; TV.gold=Math.min(10,2+R); TV.freeRe=pl.freeRe; TV.shop=pl.shop.length?pl.shop:[]; TV.hero=null;
    pl.up=Math.max(0,pl.up-(R>1?1:0)); TV.upCost=pl.up;
    if(pl.tier<5 && TV.gold>=TV.upCost && (R>=3||TV.upCost<=3) && !(R%2===1&&pl.tier>=3&&R<8)){ TV.gold-=TV.upCost; pl.tier++; TV.tier=pl.tier; pl.up=[0,0,7,8,9,99][pl.tier]; TV.upCost=pl.up; }
    tvRoll(); let rolls=0;
    const want=u=>!u.sp&&(pl.s==='rand'||u.f===pl.s);
    while(TV.gold>=3 && rolls<8){ let i=TV.shop.findIndex(want); if(i<0) i=TV.shop.findIndex(u=>!u.sp&&(TV.band.length<7||u.t>=Math.min(...TV.band.map(x=>x.t)))); 
      if(i<0||(!want(TV.shop[i])&&TV.gold>=4&&rolls<3)){ if(TV.gold>=4){ rolls++; tvReroll(); continue; } if(i<0) break; }
      const u=TV.shop[i]; if(TV.band.length>=7){ let wi=0; TV.band.forEach((x,j)=>{ const sc=x.a+x.h+(want(x)?6:0); const sw=TV.band[wi].a+TV.band[wi].h+(want(TV.band[wi])?6:0); if(sc<sw) wi=j; }); const sc=u.a+u.h+(want(u)?6:0)+u.t*2, sw=TV.band[wi].a+TV.band[wi].h+(want(TV.band[wi])?6:0)+TV.band[wi].t*2; if(sc<=sw) break; tvSell(wi); }
      tvBuy(i); const hi=TV.hand.findIndex(x=>x.id===u.id); if(hi>=0) tvPlay(hi); TV.hand=[]; }
    // spells: just play them
    TV.shop.filter(u=>u.sp&&TV.gold>=u.c&&u.k!=='coin'&&u.k!=='luck').slice(0,1).forEach(u=>{ const i=TV.shop.indexOf(u); tvBuy(i); const hi=TV.hand.findIndex(x=>x.id===u.id); if(hi>=0) tvPlay(hi); TV.hand=[]; });
    tvEot(TV.band); pl.band=TV.band; pl.shop=[]; TV.shop.forEach(u=>{ if(!u.sp) TV.pool[u.k]++; }); TV.shop=[]; pl.freeRe=TV.freeRe||0; }
   const al=P.filter(x=>x.alive).sort(()=>Math.random()-.5); const cap=R<=3?5:R<=7?10:15;
   for(let i=0;i<al.length;i+=2){ const x=al[i], y=al[i+1]||P.filter(q=>!q.alive)[0]; if(!y) continue; const [r,surv]=fight(x.band,y.band); const tsum=surv.reduce((s,u)=>s+u.t,0);
    if(r===1&&y.alive){ y.hp-=Math.min(cap,x.tier+tsum); } if(r===-1){ x.hp-=Math.min(cap,y.tier+tsum); }
    x.band.forEach(u=>{ const k=u.k; unitStat[k]=unitStat[k]||{w:0,n:0}; unitStat[k].n++; if(r===1) unitStat[k].w++; });
    if(y.alive) y.band.forEach(u=>{ const k=u.k; unitStat[k]=unitStat[k]||{w:0,n:0}; unitStat[k].n++; if(r===-1) unitStat[k].w++; }); }
   const nd=P.filter(x=>x.alive&&x.hp<=0); nd.forEach(x=>{ x.alive=false; x.band.forEach(u=>{ if(TV.pool[u.k]!=null) TV.pool[u.k]+=(u.g>1?3:1); }); }); dead.push(...nd.sort((a,b)=>b.hp-a.hp).reverse()); }
  const order=P.filter(x=>x.alive).concat(dead.slice().reverse());
  order.forEach((x,i)=>{ const r=res[x.s]; r.place+=i+1; r.n++; if(i<4) r.top4++; if(i===0) r.win++; }); }
 tvPaint=realPaint;
 const F={}; for(const k in res){ const r=res[k]; F[k]={avgPlace:+(r.place/r.n).toFixed(2), top4:+(r.top4/r.n*100).toFixed(1), win:+(r.win/r.n*100).toFixed(1), n:r.n}; }
 const U={}; Object.keys(unitStat).forEach(k=>{ const s=unitStat[k]; const d=TV_U.find(x=>x[0]===k); U[k]={t:d?d[3]:0,f:d?d[6]:'',wr:+(s.w/s.n*100).toFixed(1),n:s.n}; });
 return {F,U};
},LOBBIES);
console.log(JSON.stringify(out.F,null,0)); const U=Object.entries(out.U).sort((a,b)=>a[1].t-b[1].t||b[1].wr-a[1].wr); U.forEach(([k,v])=>console.log(k.padEnd(8),'★'+v.t,v.f.padEnd(6),v.wr+'%','n='+v.n));
await b.close();})();
