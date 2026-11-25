const fs=require('fs'); const NC=14;
const load=f=>new Float32Array(fs.readFileSync(f).buffer.slice(0)); const A=load('/tmp/odds/a.bin'), B=load('/tmp/odds/b.bin');
const N=(A.length+B.length)/NC; const row=i=>i*NC<A.length?[A,i*NC]:[B,i*NC-A.length];
const get=(i,k)=>{ const [X,o]=row(i); return X[o+k]; };
function fit(cols,iters=12){ const d=cols.length+1; let w=new Array(d).fill(0);
  for(let it=0;it<iters;it++){ const g=new Array(d).fill(0), H=Array.from({length:d},()=>new Array(d).fill(0));
    for(let i=0;i<N;i++){ if(get(i,12)) continue; const x=[1,...cols.map(k=>get(i,k))]; let z=0; for(let j=0;j<d;j++) z+=w[j]*x[j]; const p=1/(1+Math.exp(-z)), y=get(i,11), r=p*(1-p);
      for(let j=0;j<d;j++){ g[j]+=(y-p)*x[j]; for(let k=0;k<=j;k++) H[j][k]+=r*x[j]*x[k]; } }
    for(let j=0;j<d;j++) for(let k=j+1;k<d;k++) H[j][k]=H[k][j]; for(let j=0;j<d;j++) H[j][j]+=1e-6;
    // solve H*dw = g
    const M=H.map((r,j)=>r.concat([g[j]])); for(let c=0;c<d;c++){ let p=c; for(let r=c+1;r<d;r++) if(Math.abs(M[r][c])>Math.abs(M[p][c])) p=r; [M[c],M[p]]=[M[p],M[c]]; for(let r=0;r<d;r++){ if(r===c) continue; const f=M[r][c]/M[c][c]; for(let k=c;k<=d;k++) M[r][k]-=f*M[c][k]; } }
    const dw=M.map((r,j)=>r[d]/r[j]); w=w.map((v,j)=>v+dw[j]); if(Math.max(...dw.map(Math.abs))<1e-6) break; }
  return w; }
function evalM(pred){ let ll=0,br=0,acc=0,n=0; const cal=Array.from({length:10},()=>[0,0,0]); const ph=Array.from({length:4},()=>[0,0,0]);
  for(let i=0;i<N;i++){ if(!get(i,12)) continue; const p=Math.min(.995,Math.max(.005,pred(i))), y=get(i,11); ll-=y*Math.log(p)+(1-y)*Math.log(1-p); br+=(p-y)**2; acc+=((p>.5)===(y===1))?1:0; n++;
    const b=Math.min(9,Math.floor(p*10)); cal[b][0]+=p; cal[b][1]+=y; cal[b][2]++; const L=get(i,7), q=Math.min(3,Math.floor(Math.max(0,L)*4)); ph[q][0]+=-(y*Math.log(p)+(1-y)*Math.log(1-p)); ph[q][1]+=((p>.5)===(y===1))?1:0; ph[q][2]++; }
  return {ll:ll/n, brier:br/n, acc:acc/n, n, cal:cal.map(c=>c[2]?[ +(c[0]/c[2]).toFixed(3), +(c[1]/c[2]).toFixed(3), c[2]]:null), phase:ph.map(c=>c[2]?[+(c[0]/c[2]).toFixed(4), +(c[1]/c[2]).toFixed(4), c[2]]:null)}; }
const lin=(w,cols)=>i=>{ let z=w[0]; cols.forEach((k,j)=>z+=w[j+1]*get(i,k)); return 1/(1+Math.exp(-z)); };
const res={N}; res.old=evalM(i=>get(i,10));
const sets={base:[0,1,2,3], plus_out:[0,1,2,3,4], plus_prime:[0,1,2,3,4,5,6], full:[0,1,2,3,4,5,6,7,8], full2:[0,1,2,3,4,5,6,7,8,9]};
for(const [k,cols] of Object.entries(sets)){ const w=fit(cols); res[k]={w:w.map(v=>+v.toFixed(4)), ...evalM(lin(w,cols))}; console.error(k, res[k].ll.toFixed(4), res[k].acc.toFixed(4)); }
fs.writeFileSync('/tmp/odds/res.json',JSON.stringify(res,null,1)); console.log('old',res.old.ll.toFixed(4),res.old.brier.toFixed(4),res.old.acc.toFixed(4));
