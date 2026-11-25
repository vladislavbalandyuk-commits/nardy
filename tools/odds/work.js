const {play}=require('./sim.js'); const {feats,NF}=require('./feat.js'); const {winChanceOnRoll}=require('./core.js'); const fs=require('fs');
const [a,b,out]=process.argv.slice(2); const rows=[]; let g=0;
for(let i=+a;i<+b;i++){ const G=play(i*7919+13); if(!G) continue; g++;
  for(const r of G.recs){ if(r.ply<2) continue; if(((i*131+r.ply*17)%5)>1) continue;   // ~40% of positions
    const f=feats(r.board,r.off,r.c); const old=winChanceOnRoll({board:r.board,off:r.off},r.c); rows.push(...f, old, r.c===G.winner?1:0, i%10===0?1:0, (r.board.length, r.ply)); } }
fs.writeFileSync(out, Buffer.from(new Float32Array(rows).buffer)); console.log(out,'games',g,'rows',rows.length/(14));
