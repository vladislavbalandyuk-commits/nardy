const fs=require('fs'); const NC=14; const A=new Float32Array(fs.readFileSync('/tmp/odds/a.bin').buffer.slice(0)), B=new Float32Array(fs.readFileSync('/tmp/odds/b.bin').buffer.slice(0));
const D=new Float32Array(A.length+B.length); D.set(A); D.set(B,A.length); const N=D.length/NC; const M=JSON.parse(fs.readFileSync('/tmp/odds/mlp.json'));
const mlp=i=>{ let z=M.b2; for(let j=0;j<M.H;j++){ let a=M.b1[j]; for(let k=0;k<M.F.length;k++) a+=M.W1[j*M.F.length+k]*D[i*NC+M.F[k]]; z+=M.W2[j]*Math.tanh(a); } return 1/(1+Math.exp(-z)); };
function ev(pred){ let ll=0,br=0,acc=0,n=0; const cal=Array.from({length:10},()=>[0,0,0]); const ph=Array.from({length:4},()=>[0,0,0,0]);
  for(let i=0;i<N;i++){ if(!D[i*NC+12]) continue; const p=Math.min(.995,Math.max(.005,pred(i))), y=D[i*NC+11]; const l=-(y*Math.log(p)+(1-y)*Math.log(1-p)); ll+=l; br+=(p-y)**2; const ok=((p>.5)===(y===1))?1:0; acc+=ok; n++;
    const b=Math.min(9,Math.floor(p*10)); cal[b][0]+=p; cal[b][1]+=y; cal[b][2]++; const L=D[i*NC+7], q=Math.min(3,Math.floor(Math.max(0,L)*4)); ph[q][0]+=l; ph[q][1]+=ok; ph[q][2]++; ph[q][3]+=Math.abs(p-.5); }
  return {ll:+(ll/n).toFixed(4), brier:+(br/n).toFixed(4), acc:+(acc/n*100).toFixed(1), n, cal:cal.map(c=>c[2]?[Math.round(c[0]/c[2]*100), Math.round(c[1]/c[2]*100), c[2]]:null), phase:ph.map(c=>[+(c[1]/c[2]*100).toFixed(1), +(c[0]/c[2]).toFixed(3), c[2]])}; }
const o=ev(i=>D[i*NC+10]), m=ev(mlp); console.log(JSON.stringify({old:o,mlp:m}));
