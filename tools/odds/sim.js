// plays bot-vs-bot games of long nardy with the game's own rules and bot, records every position with the player on roll and who won
const C=require('./core.js'); const {OPP,mine,applyMove,botBestPath}=C;
function rng(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }
const NZ=[0.3,0.8,1.5,2.5,4];
function play(seed){ const R=rng(seed); const d6=()=>1+Math.floor(R()*6);
  let st={board:(()=>{const B=new Array(24).fill(0); B[0]=15; B[12]=-15; return B;})(), off:{w:0,b:0}, remaining:[], headMoved:0, headLimit:1};
  const first={w:true,b:true}; const nz={w:NZ[Math.floor(R()*NZ.length)], b:NZ[Math.floor(R()*NZ.length)]};
  let c=R()<.5?'w':'b'; const recs=[];
  for(let ply=0;ply<600;ply++){
    recs.push({c, board:st.board.slice(), off:{...st.off}, ply});
    const a=d6(), b=d6(); st={...st, remaining:a===b?[a,a,a,a]:[a,b], headMoved:0, headLimit:(first[c]&&a===b&&[3,4,6].includes(a))?2:1}; first[c]=false;
    const path=botBestPath(st,c,nz[c],R); if(path) for(const m of path) st=applyMove(st,c,m);
    if(st.off[c]===15) return {winner:c, recs, nz, plies:ply+1};
    c=OPP(c); }
  return null; }
module.exports={play};
if(require.main===module){ const t0=Date.now(); let n=0,pos=0; for(let i=1;i<=+process.argv[2];i++){ const g=play(i*7919); if(g){ n++; pos+=g.recs.length; } } console.log('games',n,'positions',pos,'ms/game',((Date.now()-t0)/n).toFixed(1)); }
