const fs=require('fs'); const NC=14; const A=new Float32Array(fs.readFileSync('/tmp/odds/a.bin').buffer.slice(0)), B=new Float32Array(fs.readFileSync('/tmp/odds/b.bin').buffer.slice(0));
const D=new Float32Array(A.length+B.length); D.set(A); D.set(B,A.length); const N=D.length/NC; const F=[0,1,2,3,4,5,6,7,9]; const nin=F.length, H=16;
let s=1; const R=()=>{ s^=s<<13; s>>>=0; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; };
const W1=Float64Array.from({length:H*nin},()=>(R()-.5)*.6), b1=new Float64Array(H), W2=Float64Array.from({length:H},()=>(R()-.5)*.6); let b2=0;
const P=[W1,b1,W2]; const m=P.map(p=>new Float64Array(p.length)), v=P.map(p=>new Float64Array(p.length)); let mb=0,vb=0,t=0;
const tr=[], te=[]; for(let i=0;i<N;i++) (D[i*NC+12]?te:tr).push(i);
const fwd=(i,h)=>{ let z=b2; for(let j=0;j<H;j++){ let a=b1[j]; for(let k=0;k<nin;k++) a+=W1[j*nin+k]*D[i*NC+F[k]]; h[j]=Math.tanh(a); z+=W2[j]*h[j]; } return 1/(1+Math.exp(-z)); };
const h=new Float64Array(H); let lr=0.003, BS=256;
for(let ep=0;ep<16;ep++){ for(let q=tr.length-1;q>0;q--){ const r=Math.floor(R()*(q+1)); [tr[q],tr[r]]=[tr[r],tr[q]]; }
  for(let s0=0;s0<tr.length;s0+=BS){ const gW1=new Float64Array(H*nin), gb1=new Float64Array(H), gW2=new Float64Array(H); let gb2=0; const e=Math.min(tr.length,s0+BS);
    for(let q=s0;q<e;q++){ const i=tr[q]; const p=fwd(i,h), dz=p-D[i*NC+11]; gb2+=dz; for(let j=0;j<H;j++){ gW2[j]+=dz*h[j]; const da=dz*W2[j]*(1-h[j]*h[j]); gb1[j]+=da; for(let k=0;k<nin;k++) gW1[j*nin+k]+=da*D[i*NC+F[k]]; } }
    t++; const G=[gW1,gb1,gW2]; const n=e-s0; P.forEach((p,pi)=>{ for(let j=0;j<p.length;j++){ const g=G[pi][j]/n; m[pi][j]=.9*m[pi][j]+.1*g; v[pi][j]=.999*v[pi][j]+.001*g*g; p[j]-=lr*(m[pi][j]/(1-.9**t))/(Math.sqrt(v[pi][j]/(1-.999**t))+1e-8); } });
    const g=gb2/n; mb=.9*mb+.1*g; vb=.999*vb+.001*g*g; b2-=lr*(mb/(1-.9**t))/(Math.sqrt(vb/(1-.999**t))+1e-8); }
  if(ep>=10) lr*=0.6; let ll=0,acc=0; for(const i of te){ const p=Math.min(.995,Math.max(.005,fwd(i,h))), y=D[i*NC+11]; ll-=y*Math.log(p)+(1-y)*Math.log(1-p); acc+=((p>.5)===(y===1))?1:0; } console.log('epoch',ep,'ll',(ll/te.length).toFixed(4),'acc',(acc/te.length).toFixed(4)); }
fs.writeFileSync('/tmp/odds/mlp.json',JSON.stringify({F,H,W1:[...W1].map(x=>+x.toFixed(4)),b1:[...b1].map(x=>+x.toFixed(4)),W2:[...W2].map(x=>+x.toFixed(4)),b2:+b2.toFixed(4)}));
