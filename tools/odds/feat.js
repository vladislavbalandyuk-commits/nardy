// features of a position from the side of the player on roll (c); the same function goes into the game
const {OPP,mine}=require('./core.js');
function feats(B,off,c){ const o=OPP(c); let pm=0,po=0,inM=0,inO=0; const occM=new Array(24).fill(0), occO=new Array(24).fill(0);
  for(let q=0;q<24;q++){ const a=mine(B,c,q); if(a>0){ pm+=a*(24-q); if(q>=18) inM+=a; occM[q]=1; } const b=mine(B,o,q); if(b>0){ po+=b*(24-q); if(q>=18) inO+=b; occO[q]=1; } }
  const run=occ=>{ let r=0,m=0; for(let q=0;q<24;q++){ if(occ[q]){ r++; if(r>m) m=r; } else r=0; } return m; };
  const S=Math.sqrt(pm+po+1), hm=Math.max(0,mine(B,c,0)), ho=Math.max(0,mine(B,o,0));
  const outM=15-off[c]-inM, outO=15-off[o]-inO, late=1-(pm+po)/720;
  return [(po-pm)/S, hm/S, ho/S, (off[c]-off[o])/S, (outM-outO)/S, run(occM)/6, run(occO)/6, late, (po-pm)/S*late, (po-pm)/Math.max(30,pm+po)*10];
}
module.exports={feats, NF:10};
