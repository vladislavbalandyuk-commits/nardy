// @ts-nocheck
// Supabase Edge Function "game": the only writer of online games and ratings.
// Clients call it with { action, gameId, args }; it validates the move with the same rules as the client.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as TR from './tour.ts';
// ---- rules (same as the client) ----
// Authoritative long-nardy rules for the server. Pure functions, no I/O.
// The same rules as the client (index.html): every action is validated here.
const S=c=>c==='w'?1:-1, OPP=c=>c==='w'?'b':'w', b2=(c,p)=>c==='w'?p:(p+12)%24, mine=(B,c,p)=>B[b2(c,p)]*S(c);
function allHome(st,c){ let n=st.off[c]; for(let p=18;p<24;p++){const k=mine(st.board,c,p); if(k>0)n+=k;} return n===15; }
function blockIllegal(B,c){ const o=OPP(c); let run=0;
  for(let p=0;p<24;p++){ if(mine(B,c,p)>0){ run++; if(run>=6){ const oq=(p-5+12)%24; if(oq+5<=23){ let ahead=false; for(let op=oq+6;op<24;op++){ if(mine(B,o,op)>0){ahead=true;break;} } if(!ahead) return true; } } } else run=0; }
  return false; }
function genSingles(st,c,d){ const res=[], B=st.board, home=allHome(st,c); let minP=24; for(let p=0;p<24;p++) if(mine(B,c,p)>0){minP=p;break;}
  for(let p=0;p<24;p++){ if(mine(B,c,p)<=0) continue; if(p===0 && st.headMoved>=st.headLimit) continue; const t=p+d;
    if(t<24){ const bi=b2(c,t); if(B[bi]*S(c)<0) continue; const nb=B.slice(); nb[b2(c,p)]-=S(c); nb[bi]+=S(c); if(blockIllegal(nb,c)) continue; res.push({from:p,to:t,die:d}); }
    else if(home && (t===24 || p===minP)) res.push({from:p,to:24,die:d}); }
  return res; }
function applyMove(st,c,m){ const B=st.board.slice(); B[b2(c,m.from)]-=S(c); const off={...st.off}; if(m.to===24) off[c]++; else B[b2(c,m.to)]+=S(c);
  const rem=st.remaining.slice(); rem.splice(rem.indexOf(m.die),1); return {...st,board:B,off,remaining:rem,headMoved:st.headMoved+(m.from===0?1:0)}; }
function maxUse(st,c){ if(!st.remaining.length) return 0; let best=0;
  for(const d of new Set(st.remaining)) for(const m of genSingles(st,c,d)){ const v=1+maxUse(applyMove(st,c,m),c); if(v>best) best=v; if(best===st.remaining.length) return best; } return best; }
function legalMoves(st,c){ if(!st.remaining||!st.remaining.length) return []; const total=maxUse(st,c); if(!total) return []; let res=[];
  for(const d of new Set(st.remaining)) for(const m of genSingles(st,c,d)) if(1+maxUse(applyMove(st,c,m),c)===total) res.push(m);
  if(total===1 && st.remaining.length===2 && st.remaining[0]!==st.remaining[1]){ const mx=Math.max(...res.map(m=>m.die)); res=res.filter(m=>m.die===mx); } return res; }
function winChanceOnRoll(st,c){ const o=OPP(c); let pm=0,po=0; for(let q=0;q<24;q++){ const a=mine(st.board,c,q); if(a>0) pm+=a*(24-q); const b=mine(st.board,o,q); if(b>0) po+=b*(24-q); }
  if(st.off[c]===15) return 1; if(st.off[o]===15) return 0; const Sq=Math.sqrt(pm+po+1), hm=Math.max(0,mine(st.board,c,0)), ho=Math.max(0,mine(st.board,o,0));
  return 1/(1+Math.exp(-(0.1702+0.5114*(po-pm)/Sq-6.3696*hm/Sq+6.4309*ho/Sq+4.7955*(st.off[c]-st.off[o])/Sq))); }
function baseGain(r){ const lo=1000,hi=1600; if(r<=lo) return 50; if(r>=hi) return 25; return 50-25*(r-lo)/(hi-lo); }
// rating (0.26.1): Elo on a wide scale. An equal opponent ±30; beating a much stronger one up to +60, a much weaker one only a few points;
// losing to a much weaker one up to −60. A mars ×2 (0.30.4). (The scale is 1500 per «10×», so 4000 vs 2500 is still a game, as dice allow.)
const ELO_K=60, ELO_D=1500;
function eloDelta(my,opp,score,mars){ const E=1/(1+Math.pow(10,(opp-my)/ELO_D)); let d=ELO_K*((score?1:0)-E); if(mars) d*=2; d=Math.round(d); return score?Math.max(1,d):Math.min(-1,d); }


// ---- server-side bots (practice bots and online personas) ----
const BOTS={ marta:{r:900,noise:7,factor:.4}, ostap:{r:1000,noise:3,factor:.4}, taras:{r:1100,noise:.8,factor:.4}, hryts:{r:1250,noise:0,factor:.4}, snowman:{r:1000,noise:3,factor:.4}, ghost:{r:null,noise:0,factor:1}, camp:{r:null,noise:0,factor:0} };
function botEval(st,c){ const o=OPP(c); let made=0,run=0,best=0,stack=0,back=0;
  for(let p=0;p<24;p++){ const k=mine(st.board,c,p); if(k>0){ made++; run++; if(run>best) best=run; if(k>3) stack+=k-3; if(p<12) back+=k; } else run=0; }
  let oppPips=0; for(let p=0;p<24;p++){ const k=mine(st.board,o,p); if(k>0) oppPips+=k*(24-p); } const head=Math.max(0,mine(st.board,c,0)-1);
  return 22*st.off[c]+3*made+5*Math.min(best,5)-1.2*stack-0.25*back-0.6*head+0.02*oppPips; }
function botBestPath(st,c,noise,rnd){ const total=maxUse(st,c); if(!total) return null; let best=null,bestV=-1e9,nodes=0; const seen=new Set();
  (function dfs(s,path,first){ if(nodes++>6000) return; if(path.length===total){ const v=botEval(s,c)+rnd()*(noise+0.05); if(v>bestV){bestV=v;best=path;} return; }
    const key=s.board.join()+'|'+s.off[c]+'|'+s.remaining.join()+'|'+s.headMoved; if(seen.has(key)) return; seen.add(key);
    const cand=first?legalMoves(s,c):[].concat(...[...new Set(s.remaining)].map(d=>genSingles(s,c,d))); for(const m of cand) dfs(applyMove(s,c,m),path.concat([m]),false); })(st,[],true);
  return best; }
// strong ghosts (0.26.1): every distinct way to play the roll, scored for both sides (diff); the strongest also look ahead with short
// Monte-Carlo rollouts (play on 16 half-moves with the plain bot, then the race formula) and pick the best of the top candidates.
function botFinals(st,c,cap){ const total=maxUse(st,c), out=[]; if(!total) return out; let nodes=0; const seen=new Set();
  (function dfs(s,path,first){ if(nodes++>cap) return; if(path.length===total){ const k='F'+s.board.join()+'|'+s.off.w+'|'+s.off.b; if(seen.has(k)) return; seen.add(k); out.push({s,path}); return; }
    const key=s.board.join()+'|'+s.off[c]+'|'+s.remaining.join()+'|'+s.headMoved; if(seen.has(key)) return; seen.add(key);
    const cand=first?legalMoves(s,c):[].concat(...[...new Set(s.remaining)].map(d=>genSingles(s,c,d))); for(const m of cand) dfs(applyMove(s,c,m),path.concat([m]),false); })(st,[],true);
  return out; }
const botDiff=(s,c)=>botEval(s,c)-botEval(s,OPP(c));
function botRollout(s,toMove,me,maxPly,rnd){ let st=s, c=toMove; const d=()=>1+Math.floor(rnd()*6);
  for(let n=0;n<maxPly;n++){ const a=d(),b=d(); st={...st,remaining:a===b?[a,a,a,a]:[a,b],headMoved:0,headLimit:1}; const path=botBestPath(st,c,0.3,rnd); if(path) for(const m of path) st=applyMove(st,c,m);
    if(st.off[c]===15){ const mars=st.off[OPP(c)]===0; return c===me?(mars?2:1):(mars?-2:-1); } st={...st,remaining:[]}; c=OPP(c); }
  const wc=winChanceOnRoll(st,c), pm=c===me?wc:1-wc; return 2*pm-1; }
function botPathPro(st,c,lvl,rnd){ const F=botFinals(st,c,6000); if(!F.length) return null; F.forEach(f=>f.v=botDiff(f.s,c)); F.sort((x,y)=>y.v-x.v);
  if(lvl<2 || F.length===1) return F[0].path; const top=F.slice(0,lvl>=3?4:3), R=lvl>=3?16:10; let best=null,bv=-1e9;
  for(const f of top){ if(f.s.off[c]===15) return f.path; let sum=0; for(let i=0;i<R;i++) sum+=botRollout({...f.s,remaining:[]},OPP(c),c,16,rnd); const v=sum/R+f.v*0.002; if(v>bv){bv=v;best=f.path;} } return best; }
const isBotId=id=>typeof id==='string'&&id.startsWith('bot:');

const TURN_GRACE=3000; // 0.43: the turn clock starts after the opponent's move has been shown
const TURN_MS=60000, MAX_STRIKES=3, RESIGN_MIN=10, CLAIM_MS=45000;
function newGame(p1,p2,score){ return { v:2, p1, p2, white:'', black:'', phase:'opening', open:{p1:0,p2:0}, openRound:0, openLast:null,
  board:(()=>{const B=new Array(24).fill(0); B[0]=15; B[12]=-15; return B;})(), off:{w:0,b:0}, turn:'w', dice:[], remaining:[], headMoved:0, headLimit:1, first:{w:true,b:true},
  snap:null, trail:[], last:[], winner:'', score:score||{p1:0,p2:0}, seq:0, rolled:false, rollId:0, hist:[], strikes:{p1:0,p2:0}, turnAt:0, rematch:{}, secure:1 }; }
const slotOf=(st,uid)=>st.p1===uid?'p1':st.p2===uid?'p2':null;
const slotOfColor=(st,c)=>(st.white===st.p1)===(c==='w')?'p1':'p2';
const colorOfSlot=(st,s)=>slotOfColor(st,'w')===s?'w':'b';
function err(code){ const e=new Error(code); e.code=code; throw e; }
function pushHist(st){ if(st.phase!=='play'||!st.dice||!st.dice.length) return; const pw=st.off[st.turn]===15?(st.turn==='w'?1:0):1-winChanceOnRoll(st,OPP(st.turn)); const wc=st.turn==='w'?pw:1-pw;
  st.hist=(st.hist||[]).concat([{c:st.turn,d:st.dice.slice(),t:(st.trail||[]).slice(),p:Math.round(Math.min(.995,Math.max(.005,wc))*100)}]); }
// custom lobby rules (0.30.0): st.rules = {to: points to win the match, t: seconds per move (0 = no limit), dbl: 'norm'|'none'|'pen', head: 'one'|'free', noMars, noOdds, open}
const RU=st=>st.rules||{};
// 0.33.0: who moves first in a custom lobby — 'roll' (the opening roll), 'host' (always the host), 'alt' (the host in game 1, then by turns)
function lobbyStart(st,now){ const f=RU(st).first; if(!f||f==='roll'||!st.p2||st.phase!=='opening') return; const g=st.game||1, s=f==='host'||g%2===1?'p1':'p2';
  st.white=st[s]; st.black=st[s==='p1'?'p2':'p1']; st.phase='play'; st.turn='w'; st.turnAt=now; st.first={w:true,b:true}; }
// replays (0.32.0): the start position is found by undoing every recorded move from the final one; board cells -> base-32 chars,
// a turn -> colour + dice + its moves (points a..x, z = borne off)
const B32='0123456789abcdefghijklmnopqrstuv';
function encReplay(st){ const H=st.hist||[]; if(!H.length) return null; const B=st.board.slice(), off={...st.off};
  for(let i=H.length-1;i>=0;i--){ const h=H[i], sg=h.c==='w'?1:-1, T=h.t||[]; for(let j=T.length-2;j>=0;j-=2){ const a=T[j], b=T[j+1]; if(b>=0) B[b]-=sg; else off[h.c]--; B[a]+=sg; } }
  const enc=B.map(v=>B32[Math.max(0,Math.min(30,v+15))]).join(''); const turns=H.map(h=>h.c+(h.d||[]).slice(0,2).join('')+(h.t||[]).map(x=>x<0?'z':String.fromCharCode(97+x)).join('')).join(';');
  if(turns.length>2600) return null; return { s: enc, h: turns, w: st.result?.winner ? colorOfSlot(st, st.result.winner) : '' }; }
const colorOfSlotS=(st,s)=>slotOfColor(st,'w')===s?'w':'b';
const turnMs=st=>{ const t=RU(st).t; return t===0 ? Infinity : t ? t*1000 : TURN_MS; };
function passTurn(st,now){ pushHist(st); st.last=st.trail||[]; st.trail=[]; st.turn=OPP(st.turn); st.dice=[]; st.remaining=[]; st.rolled=false; st.snap=null; st.headMoved=0; st.turnAt=now+TURN_GRACE;
  // «a double is a penalty»: a player who still owes turns skips them now
  for(let g=0; g<2 && st.skip && st.skip[st.turn]>0; g++){ st.skip[st.turn]--; st.note={c:st.turn, skip:1, left:st.skip[st.turn], at:now}; st.turn=OPP(st.turn); } }
function finish(st,winner,mars,resign){ if(RU(st).noMars) mars=false; st.winner=winner; st.phase='over'; st.score[slotOfColor(st,winner)]+=mars?2:1; st.dice=[]; st.remaining=[]; st.rolled=false; if(resign) st.resign=resign; st.result={winner:slotOfColor(st,winner),mars:!!mars}; }
function resolveOpening(st,now){ const a=st.open.p1,b=st.open.p2; if(!a||!b) return; st.openLast={p1:a,p2:b,tie:a===b};
  if(a===b){ st.open={p1:0,p2:0}; st.openRound++; return; } const w=a>b?'p1':'p2'; st.white=st[w]; st.black=st[w==='p1'?'p2':'p1']; st.phase='play'; st.turn='w'; st.turnAt=now; }
function autoPassIfStuck(st,now){ if(st.phase==='play' && st.rolled && !legalMoves(st,st.turn).length) passTurn(st,now); }

// act(state, uid, action, args, {now, d6}) -> new state (mutates a copy)
function act(state, uid, action, args, env){
  const now=env.now, d6=env.d6; const st=JSON.parse(JSON.stringify(state)); const me=slotOf(st,uid);
  if(action==='bot_step'){ if(!isBotId(st.p2)||st.p1!==uid) err('not_bot_game'); const rnd=env.rnd||Math.random, kind=st.p2.split(':')[1]; const B=BOTS[kind]||BOTS.ghost, NZ=st.botNoise!=null?st.botNoise:B.noise;
    if(st.phase==='opening'){ if(!st.open.p1) err('wait'); if(st.open.p2) err('already'); st.open.p2=d6(); st.rollId++; resolveOpening(st,now); return st; }
    if(st.phase==='play' && RU(st).t && st.turn===colorOfSlot(st,'p1') && now-(st.turnAt||0)>=turnMs(st)){ st.strikes=st.strikes||{p1:0,p2:0}; st.strikes.p1++;
      if(st.strikes.p1>=MAX_STRIKES){ const w=colorOfSlot(st,'p2'); finish(st,w,false,{c:OPP(w),mars:false,timeout:true}); return st; }
      st.trail=[]; if(st.snap){ st.board=st.snap.board; st.off=st.snap.off; } passTurn(st,now); return st; }
    if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,'p2'); if(st.turn!==c) err('not_bot_turn');
    if(!st.rolled){ const a=d6(),b=d6(); st.dice=[a,b]; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headLimit=(st.first[c]&&a===b&&[3,4,6].includes(a))?2:1; st.first[c]=false; st.headMoved=0; st.rolled=true; st.trail=[]; st.rollId++; st.snap=null; st.turnAt=now;
      st.botPlan = (st.botLvl ? botPathPro(st,c,st.botLvl,rnd) : botBestPath(st,c,NZ,rnd))||[]; if(!st.botPlan.length){ st.botPlan=null; passTurn(st,now); } return st; }
    const m=(st.botPlan||[]).shift(); const ok=m&&legalMoves(st,c).find(x=>x.from===m.from&&x.to===m.to&&x.die===m.die); if(!ok){ st.botPlan=null; passTurn(st,now); return st; }
    Object.assign(st,applyMove(st,c,ok)); st.trail=(st.trail||[]).concat([b2(c,ok.from),ok.to===24?-1:b2(c,ok.to)]);
    if(st.off[c]===15){ pushHist(st); finish(st,c,st.off[OPP(c)]===0); st.botPlan=null; return st; }
    if(!legalMoves(st,c).length){ st.botPlan=null; passTurn(st,now); } return st; }
  if(action==='join'){ if(st.p2 && st.p2!==uid && st.p1!==uid) err('full'); if(!st.p2 && st.p1!==uid){ st.p2=uid; lobbyStart(st,now); } return st; }
  if(!me) err('not_player');
  if(action==='open_roll'){ if(st.phase!=='opening'||!st.p2) err('bad_phase'); if(st.open[me]) err('already'); st.open[me]=d6(); st.rollId++; resolveOpening(st,now); return st; }
  // a match to N points: the next game keeps the score
  if(action==='next'){ if(st.phase!=='over') err('bad_phase'); const to=RU(st).to||0; if(!to || Math.max(st.score.p1,st.score.p2)>=to) err('match_over');
    const ng=newGame(st.p1,st.p2,st.score); for(const k of ['botNoise','botLvl','unrated']) if(st[k]!=null) ng[k]=st[k]; ng.rules=st.rules; ng.names=st.names; ng.avs=st.avs; ng.ratings=st.ratings; ng.frs=st.frs; ng.tts=st.tts; ng.seq=st.seq; ng.rollId=st.rollId; ng.game=(st.game||1)+1; lobbyStart(ng,now); return ng; }
  if(action==='rematch'){ if(st.phase!=='over') err('bad_phase'); st.rematch=st.rematch||{}; st.rematch[me]=true;
    if(st.rematch.p1&&st.rematch.p2){ const ng=newGame(st.p1,st.p2,st.rules&&st.rules.to?{p1:0,p2:0}:st.score); if(st.rules) ng.rules=st.rules; ng.names=st.names; ng.avs=st.avs; ng.ratings=st.ratings; ng.frs=st.frs; ng.tts=st.tts; ng.seq=st.seq; ng.rollId=st.rollId; lobbyStart(ng,now); return ng; } return st; }
  if(action==='timeout'){ if(st.phase!=='play') err('bad_phase'); const opp=me==='p1'?'p2':'p1'; if(colorOfSlot(st,opp)!==st.turn) err('not_their_turn'); if(now-(st.turnAt||0)<turnMs(st)) err('too_early');
    st.strikes=st.strikes||{p1:0,p2:0}; st.strikes[opp]++;
    if(st.strikes[opp]>=MAX_STRIKES){ const w=colorOfSlot(st,me); finish(st,w,st.off[OPP(w)]===0&&false,{c:OPP(w),mars:false,timeout:true}); return st; }
    st.trail=[]; if(st.snap){ st.board=st.snap.board; st.off=st.snap.off; } passTurn(st,now); return st; }
  // leaving a started game counts as a loss (no minimum number of moves)
  if(action==='abandon'){ if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,me), w=OPP(c), mars=st.off[c]===0&&(st.off[w]>0||allHome(st,w)); finish(st,w,mars,{c,mars,abandon:true}); return st; }
  // the opponent has gone quiet on their own turn: take the win without waiting for three timeouts
  if(action==='claim'){ if(st.phase!=='play') err('bad_phase'); const opp=me==='p1'?'p2':'p1'; if(colorOfSlot(st,opp)!==st.turn) err('not_their_turn'); if(now-(st.turnAt||0)<(RU(st).t===0?300000:Math.max(CLAIM_MS,turnMs(st)))) err('too_early');
    const w=colorOfSlot(st,me); finish(st,w,false,{c:OPP(w),mars:false,abandon:true}); return st; }
  if(action==='resign'){ if(st.phase!=='play') err('bad_phase'); if((st.hist||[]).length<RESIGN_MIN) err('too_early'); const c=colorOfSlot(st,me), w=OPP(c), mars=st.off[c]===0&&(st.off[w]>0||allHome(st,w)); finish(st,w,mars,{c,mars}); return st; }
  // turn actions
  if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,me); if(st.turn!==c) err('not_your_turn');
  if(action==='roll'){ if(st.rolled) err('already'); let a=d6(), b=d6(); const R=RU(st); if(R.dbl==='none'){ for(let g=0;g<40&&a===b;g++) b=d6(); }
    if(R.dbl==='pen' && a===b){ st.dice=[a,b]; st.remaining=[]; st.rolled=true; st.trail=[]; st.rollId++; st.first[c]=false; st.skip=st.skip||{w:0,b:0}; st.skip[c]=a-1; st.note={c, pen:a, at:now}; passTurn(st,now); return st; }
    st.dice=[a,b]; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headLimit=R.head==='free'?15:(st.first[c]&&a===b&&[3,4,6].includes(a))?2:1; st.first[c]=false; st.headMoved=0; st.rolled=true; st.trail=[]; st.rollId++; st.snap={board:st.board.slice(),off:{...st.off}}; st.turnAt=now;
    autoPassIfStuck(st,now); return st; }
  if(action==='move'){ if(!st.rolled) err('not_rolled'); const path=(args&&args.path)||[]; if(!path.length||path.length>4) err('bad_move');
    for(const m of path){ const ok=legalMoves(st,c).find(x=>x.from===m.from&&x.to===m.to&&x.die===m.die); if(!ok) err('illegal');
      Object.assign(st,applyMove(st,c,ok)); st.trail=(st.trail||[]).concat([b2(c,ok.from),ok.to===24?-1:b2(c,ok.to)]); if(st.off[c]===15) break; }
    if(st.off[c]===15){ pushHist(st); finish(st,c,st.off[OPP(c)]===0); return st; }
    if(!legalMoves(st,c).length) passTurn(st,now); return st; }
  if(action==='undo'){ if(!st.rolled||!st.snap) err('bad'); st.board=st.snap.board.slice(); st.off={...st.snap.off}; st.trail=[]; const [a,b]=st.dice; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headMoved=0; return st; }
  err('unknown_action');
}
// rating change for a finished game, from the server-held ratings
function ratingChanges(st, rA, rB){ const r=st.result; if(!r) return null; const w=r.winner, l=w==='p1'?'p2':'p1'; const R={p1:rA,p2:rB};
  return { [w]: eloDelta(R[w],R[l],1,r.mars), [l]: eloDelta(R[l],R[w],0,r.mars) }; }
// achievement counters, updated once per rated game for a human player
function achUpdate(prev, st, slot, myR, oppR){ const A={c:{won:0,mars:0,streak:0,bestStreak:0,comeback:0,nodouble:0,games:0,giant:0},got:{},...(prev||{})}; A.c={...{won:0,mars:0,streak:0,bestStreak:0,comeback:0,nodouble:0,games:0,giant:0},...(A.c||{})}; A.got={...(A.got||{})};
  const c=A.c, myC=colorOfSlot(st,slot), won=st.result.winner===slot; c.games++;
  if(won){ c.won++; c.streak++; c.bestStreak=Math.max(c.bestStreak,c.streak); if(st.result.mars) c.mars++;
    const H=st.hist||[]; if(H.length){ const minMine=Math.min(...H.map(h=>myC==='w'?h.p:100-h.p)); if(minMine<=20) c.comeback++; if(!H.some(h=>h.c===myC&&h.d[0]===h.d[1])) c.nodouble++; }
    if(oppR>=myR+300) c.giant++; } else c.streak=0;
  const T={first:c.won>=1,ten:c.won>=10,mars:c.mars>=1,mars5:c.mars>=5,streak3:c.bestStreak>=3,streak5:c.bestStreak>=5,comeback:c.comeback>=1,nodouble:c.nodouble>=1,games50:c.games>=50,giant:c.giant>=1};
  const fresh=[]; for(const k in T) if(T[k]&&!A.got[k]){ A.got[k]=Date.now(); fresh.push(k); } return {A,fresh}; }
const api={BOTS,isBotId,botBestPath,act,newGame,legalMoves,applyMove,ratingChanges,colorOfSlot,slotOfColor,achUpdate,TURN_MS,MAX_STRIKES,CLAIM_MS};
(globalThis as any).NardyCore=api;

const C = (globalThis as any).NardyCore;
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const d6 = () => { const a = new Uint32Array(1); for (;;) { crypto.getRandomValues(a); if (a[0] < 4294967292) return 1 + (a[0] % 6); } };

let iceCache: any = null, iceAt = 0;
async function iceServers() {
  const key = Deno.env.get('METERED_API_KEY'), dom = Deno.env.get('METERED_DOMAIN');
  if (!key || !dom) return null;
  if (iceCache && Date.now() - iceAt < 3600_000) return iceCache;
  const r = await fetch(`https://${dom}/api/v1/turn/credentials?apiKey=${encodeURIComponent(key)}`);
  if (!r.ok) return null; iceCache = await r.json(); iceAt = Date.now(); return iceCache;
}

// coins per finished game: a random amount; a mars win +50 %, 5 % of full games pay double
const COIN_START = 1000;
// coins per game: rating games 120–180 a win / 40–60 a loss; practice bots 30–50 / 5–15; tournament games 50–150 whatever the result
function gameCoins(won: boolean, full: boolean, mars: boolean, tour = false) {
  const R = tour ? [50, 150] : won ? (full ? [120, 180] : [30, 50]) : (full ? [40, 60] : [5, 15]);
  let c = R[0] + Math.floor(Math.random() * (R[1] - R[0] + 1)); if (won && mars) c = Math.round(c * 1.5);
  const lucky = full && Math.random() < 0.05; if (lucky) c *= 2; return { coins: c, lucky };
}
// ---- shop (0.15.1): prices and rarities of the main site's items; the base set is free; owned items in profiles.ach.owned ----
const SHOP_P: any = { frm: { c: 500, r: 1200, e: 2500, l: 5000 }, board: { c: 200, r: 600, e: 1200, l: 2500 }, ck: { c: 150, r: 450, e: 1000, l: 1800 }, dice: { c: 100, r: 300, e: 750, l: 1350 }, table: { c: 300, e: 900 } };
const SHOP_R: any = { frm: { silver: 'c', pearl: 'r', orn: 'e', aurora: 'e', crown: 'l' }, board: { linen: 'c', pistachio: 'r', cobalt: 'e', sultan: 'l', modern: 'c', tri: 'c', walnut: 'r', midnight: 'r', druzi: 'r', sage: 'r', marble: 'e', oak: 'e', ocean: 'e', carbon: 'e', terrazzo: 'r', carrara: 'e', noir: 'e', contrast: 'c', mint: 'c', slate: 'r', rosewood: 'r', lavender: 'e' },
  ck: { wood: 'c', stone: 'c', flat: 'c', metal: 'r', glass: 'r', retro: 'r', pearl: 'e', amber: 'e', jade: 'e', neon: 'e', vyshyvanka: 'l', frost: 'r', spooky: 'e', royal: 'e', iximmo: 'l', contrast: 'c', ruby: 'r', copper: 'r', obsidian: 'e', opal: 'e' },
  dice: { onyx: 'c', wood: 'c', ruby: 'r', marble: 'r', glass: 'r', gold: 'e', neon: 'e', sapphire: 'r', jade: 'r', pearl: 'e' },
  table: { kilim: 'c', zellige: 'c', velvet: 'c', teahouse: 'e', bokeh: 'e', rooftop: 'e', wood: 'c', felt: 'c', carpet: 'c', marble: 'c', cafe: 'c', stone: 'c', leather: 'c', ct1: 'e', ct2: 'e', ct3: 'e', ct4: 'e', ct5: 'e', ct6: 'e', ct7: 'e', ct8: 'e', ct9: 'e' } };
// 0.35.0: cases — open for coins, get one thing from the case. The rarity is rolled (c 55 / r 30 / e 12 / l 3 %, missing tiers move down),
// then a thing of that rarity you do not own yet; if you own them all — a fixed refund. Every 10th case without an epic or better gives one.
// 0.35.2: case-only things (boards, checkers, win effects you cannot buy) and their rarity
const CASE_R: any = { 'board:tavla': 'l', 'board:usta': 'e', 'ck:sedef': 'e', 'ck:nar': 'e', 'ck:lapis': 'r', 'dice:bone': 'r', 'dice:izmir': 'e', 'fx:carpet': 'l', 'fx:mosaic': 'e', 'fx:seeds': 'r', 'ph:vo:saz': 'e', 'ph:vo:darbuka': 'r', 'board:snowfall': 'e', 'board:garland': 'l', 'ck:snowball': 'r', 'ck:bauble': 'e', 'ck:ginger': 'e', 'dice:ice': 'r', 'dice:candy': 'e', 'fx:giftrain': 'l', 'fx:sled': 'e', 'fx:snowburst': 'r', 'ph:vo:jingle': 'e', 'ph:vo:pop': 'r', 'board:vitrazh': 'e', 'board:azulejo': 'e', 'board:synth': 'e', 'board:holo': 'l', 'board:fib': 'l', 'ck:lava': 'l', 'ck:vitrazh': 'e', 'ck:galaxy': 'e', 'ck:holo': 'l', 'ck:fib': 'e', 'ck:forest': 'e', 'ck:dzsunrise': 'e', 'ck:dbapple': 'r', 'ck:dzmint': 'r', 'fx:aperol': 'l', 'fx:delivery': 'e', 'fx:cloud': 'e', 'fx:lanterns': 'e', 'fx:stars': 'e', 'fx:bolt': 'r', 'av:hookah': 'l', 'dice:skyline': 'e', 'dice:disco': 'l', 'dice:metro': 'r', 'dice:ember': 'e', 'dice:mint': 'r', 'av:dj': 'l', 'fx:neonsign': 'e', 'ph:chZWow': 'c', 'ph:chZHmm': 'c', 'ph:chZLuck': 'c', 'ph:chZTry': 'c', 'ph:chZCalm': 'r', 'ph:chZPro': 'r', 'ph:chZMaster': 'r', 'ph:vo:clap': 'e', 'ph:vo:laugh': 'e', 'ph:vo:hookah': 'e', 'ph:vo:dice': 'e', 'ph:vo:champ': 'l', 'ph:vo:fanfare': 'l', 'ph:vo:hoho': 'e',
  'ph:vo:zap': 'r', 'ph:vo:boing': 'r', 'ph:vo:drumroll': 'r', 'ph:vo:wow': 'e', 'ph:vo:siren': 'e', 'ph:vo:tada': 'l', 'fx:hookahm': 'l', 'fx:taxi': 'e' };
// 0.48: 30 achievements with rewards. The server checks each one against the profile before paying; the two it cannot see
// (a phrase in an online game, watching a replay) are flags the site sets and pay only coins.
const ACH_X = ['board:inei', 'board:triumph', 'board:yard', 'ck:veteran', 'ck:champ', 'dice:laurel', 'dice:scholar', 'ph:vo:gong', 'ph:vo:harp', 'ph:vo:bell'];
const ACH2: any = {
  first: [{ coins: 50 }, (P: any, A: any) => (A.c?.won | 0) >= 1], ten: [{ coins: 150 }, (P: any, A: any) => (A.c?.won | 0) >= 10],
  wins50: [{ item: 'dice:laurel' }, (P: any, A: any) => (A.c?.won | 0) >= 50], wins100: [{ item: 'board:triumph' }, (P: any, A: any) => (A.c?.won | 0) >= 100],
  games50: [{ coins: 200 }, (P: any, A: any) => (A.c?.games | 0) >= 50], games200: [{ item: 'ck:veteran' }, (P: any, A: any) => (A.c?.games | 0) >= 200],
  mars: [{ coins: 100 }, (P: any, A: any) => (A.c?.mars | 0) >= 1], mars5: [{ item: 'ph:vo:gong' }, (P: any, A: any) => (A.c?.mars | 0) >= 5],
  streak3: [{ coins: 100 }, (P: any, A: any) => (A.c?.bestStreak | 0) >= 3], streak5: [{ coins: 300 }, (P: any, A: any) => (A.c?.bestStreak | 0) >= 5],
  comeback: [{ coins: 150 }, (P: any, A: any) => (A.c?.comeback | 0) >= 1], giant: [{ coins: 200 }, (P: any, A: any) => (A.c?.giant | 0) >= 1],
  rank2: [{ coins: 150 }, (P: any, A: any) => rankTier(Math.max(A.peak || 0, (P.rgames ?? 0) >= 10 ? (P.rating ?? 1000) : 0)) >= 1],
  rank4: [{ coins: 500 }, (P: any, A: any) => rankTier(Math.max(A.peak || 0, (P.rgames ?? 0) >= 10 ? (P.rating ?? 1000) : 0)) >= 3],
  tut: [{ coins: 50 }, (P: any, A: any) => !!A.tut], course: [{ item: 'dice:scholar' }, (P: any, A: any) => (A.stc | 0) >= 6],
  pz1: [{ coins: 50 }, (P: any, A: any) => !!(A.pz && (A.pz.last || A.pz.n))], pz7: [{ item: 'ph:vo:harp' }, (P: any, A: any) => Math.max(A.pz?.best | 0, A.pz?.streak | 0) >= 7],
  camp1: [{ coins: 100 }, (P: any, A: any) => (A.camp | 0) >= 1], camp4: [{ coins: 300 }, (P: any, A: any) => (A.camp | 0) >= 4], camp8: [{ item: 'board:yard' }, (P: any, A: any) => (A.camp | 0) >= 8],
  tour1: [{ coins: 150 }, (P: any, A: any) => (A.tp || []).length >= 1], tour3: [{ item: 'ck:champ' }, (P: any, A: any) => (A.tp || []).some((x: any) => (x.pl | 0) >= 1 && (x.pl | 0) <= 3)],
  friend1: [{ coins: 100 }, (P: any, A: any) => (A.friends || []).length >= 1], days7: [{ coins: 150 }, (P: any, A: any) => (A.days || []).length >= 7],
  chat: [{ coins: 50 }, (P: any, A: any) => !!A.fl?.chat], own1: [{ coins: 50 }, (P: any, A: any) => (A.owned || []).length >= 1],
  case1: [{ coins: 100 }, (P: any, A: any) => (A.cases | 0) >= 1], col20: [{ item: 'ph:vo:bell' }, (P: any, A: any) => (A.owned || []).length >= 20],
  replay: [{ coins: 50 }, (P: any, A: any) => !!A.fl?.replay],
  week7: [{ item: 'board:inei' }, (P: any, A: any) => (A.dmax | 0) >= 7] };
const CASES: any = {
  hookah: { price: 350, items: ['board:druzi','board:walnut','board:azulejo','board:vitrazh','board:fib','ck:wood','ck:retro','ck:amber','ck:dbapple','ck:dzmint','ck:forest','ck:fib','ck:dzsunrise','ck:lava','dice:wood','dice:ruby','dice:mint','dice:ember','table:cafe','table:carpet','table:leather','fx:cloud','fx:aperol','av:hookah'] },
  east: { price: 350, items: ['board:tavla', 'board:usta', 'ck:sedef', 'ck:nar', 'ck:lapis', 'dice:bone', 'dice:izmir', 'fx:carpet', 'fx:mosaic', 'fx:seeds', 'ph:vo:saz', 'ph:vo:darbuka'] },   // 0.73: «East»
  winter: { price: 350, items: ['board:snowfall', 'board:garland', 'ck:snowball', 'ck:bauble', 'ck:ginger', 'dice:ice', 'dice:candy', 'fx:giftrain', 'fx:sled', 'fx:snowburst', 'ph:vo:jingle', 'ph:vo:pop'] },   // 0.66: «Winter»
  shows: { price: 300, items: ['ph:vo:zap', 'ph:vo:boing', 'ph:vo:drumroll', 'ph:vo:wow', 'ph:vo:siren', 'ph:vo:tada', 'fx:hookahm', 'fx:taxi'] },   // 0.59: «Show» — new sounds and two big win shows
  phrases: { price: 250, items: ['chZWow','chZHmm','chZLuck','chZTry','chZCalm','chZPro','chZMaster','vo:clap','vo:laugh','vo:hookah','vo:dice','vo:hoho','vo:champ','vo:fanfare'].map((x) => 'ph:' + x) },
  night: { price: 350, items: ['board:modern','board:midnight','board:carbon','board:synth','board:holo','ck:flat','ck:glass','ck:neon','ck:galaxy','ck:vitrazh','ck:holo','dice:onyx','dice:glass','dice:neon','dice:metro','dice:skyline','dice:disco','table:stone','table:felt','fx:lanterns','fx:neonsign','fx:delivery','fx:stars','fx:bolt','av:dj'] } };
const CASE_ODDS: any = { c: 55, r: 30, e: 12, l: 3 }, CASE_REFUND: any = { c: 60, r: 120, e: 300, l: 700 };
const rarOf = (id: string) => { if (CASE_R[id]) return CASE_R[id]; const [c, k] = id.split(':'); return SHOP_R[c]?.[k] || 'c'; };
// campaign tables: only the one in this 3-day window is for sale
const exclNow = (now = Date.now()) => 'ct' + (Math.floor((now + 2 * 3600e3) / 864e5 / 3) % 9 + 1);
const shopPrice = (id: string) => { const [c, k] = id.split(':'); if (c === 'table' && /^ct\d$/.test(k) && k !== exclNow()) return 0; const r = SHOP_R[c]?.[k]; return r ? (SHOP_P[c][r] ?? SHOP_P[c].c) : 0; };
// the deal of the day: one epic or legendary thing at −25%, the same for everyone during a Kyiv day (the site picks it the same way)
const shopDay = (now = Date.now()) => new Date(now + 2 * 3600e3).toISOString().slice(0, 10);
const fnv = (str: string) => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; };
const shopDeal = (day = shopDay()) => { const L: string[] = []; for (const c of ['board', 'ck', 'dice']) for (const k of Object.keys(SHOP_R[c])) if (SHOP_R[c][k] === 'e' || SHOP_R[c][k] === 'l') L.push(c + ':' + k); return L[fnv('deal' + day) % L.length]; };
const shopCost = (id: string) => { const p = shopPrice(id); return p && id === shopDeal() ? Math.round(p * 0.75 / 10) * 10 : p; };
// sets: everything in a set you do not have yet, −20%
const BUNDLES: any = { oak: ['board:oak', 'ck:wood', 'dice:wood', 'table:wood'], marble: ['board:marble', 'ck:stone', 'dice:marble', 'table:marble'],
  night: ['board:carbon', 'ck:neon', 'dice:neon', 'table:cafe'], sea: ['board:ocean', 'ck:glass', 'dice:glass', 'table:stone'],
  mintset: ['board:mint', 'ck:pearl', 'dice:jade', 'table:felt'], ruby: ['board:rosewood', 'ck:ruby', 'dice:ruby', 'table:leather'], lavender: ['board:lavender', 'ck:opal', 'dice:pearl', 'table:carpet'],
  iznik: ['board:cobalt', 'ck:glass', 'dice:sapphire', 'table:zellige'], sultan: ['board:sultan', 'ck:royal', 'dice:pearl', 'table:teahouse'] };
const bundleCost = (b: string, owned: string[]) => { const miss = (BUNDLES[b] || []).filter((id: string) => !owned.includes(id)); return { miss, price: Math.round(miss.reduce((a: number, id: string) => a + shopPrice(id), 0) * 0.8 / 10) * 10 }; };
// portrait packs (0.26.0): five portraits for one price; portraits you already have are taken off the price (the site has the same list)
const PT_PACKS: any = { sketch: [['pt1', 'pt2', 'pt3', 'pt4', 'pt5'], 1000], ink: [['pt6', 'pt7', 'pt8', 'pt9', 'pt10'], 1000], yard: [['pt13', 'pt14', 'pt15', 'pt16', 'pt17'], 1200],
  party: [['pt18', 'pt19', 'pt20', 'pt21', 'pt22'], 1200], travel: [['pt23', 'pt24', 'pt25', 'pt26', 'pt28'], 1500], bit8: [['pt31', 'pt32', 'pt33', 'pt34', 'pt35'], 1800], collage: [['pt11', 'pt12', 'pt29', 'pt30', 'pt36'], 1500], east: [['pt37', 'pt38', 'pt39', 'pt40', 'pt41'], 1500] };
// phrase packs (the client has the same list): text and voice phrases for the chat wheel
const PH_PACKS: any = { east: [['chEDubara','chEDushesh','chEYakhshi','chEChai','chEUsta','chEBazar'], 300], yard: [['chYLucky','chYRoll','chYShesh','chYMars','chYBack','chYDouble'], 300], polite: [['chPGood','chPThink','chPSorry','chPWell','chPRev','chPBye'], 300], hookah: [['chHCoal','chHSmoke','chHApple','chHMint','chHBreak','chHTea'], 400], friends: [['chFAgain','chFMyDay','chFHead','chFSlow','chFWow','chFTea'], 300],
  bar: [['vo:clink','vo:bottle','vo:ice','vo:cheers','vo:grill'], 1000], show: [['vo:badum','vo:trombone','vo:airhorn','vo:crickets','vo:kaching'], 1000] , kenta: [['chKDve','chKSmoke','chKHookah','chKFog','chKBreath','chKCake'], 300]};
const phPackCost = (b: string, owned: string[]) => { const P = PH_PACKS[b]; if (!P) return { miss: [], price: 0 }; const miss = P[0].map((k: string) => 'ph:' + k).filter((id: string) => !owned.includes(id)); return { miss, price: Math.round(P[1] * miss.length / P[0].length / 10) * 10 }; };
const packCost = (b: string, owned: string[]) => { const P = PT_PACKS[b]; if (!P) return { miss: [], price: 0 }; const miss = P[0].map((k: string) => 'pt:' + k).filter((id: string) => !owned.includes(id)); return { miss, price: Math.round(P[1] * miss.length / P[0].length / 10) * 10 }; };
// the story campaign «The way of a nardy player» (0.29.0): 8 chapters, each a game against a character; a win unlocks the next one and its prizes
// (the site has the same list with the texts). Campaign games do not change the rating.
const CAMP: any[] = [null,
  { name: 'Дядько Толік', av: 'pt15', r: 900, noise: 4, lvl: 0, coins: 150, items: ['pt:pt15'] },
  { name: 'Оксана Ігорівна', av: 'pt11', r: 1150, noise: 2.5, lvl: 0, coins: 200, items: ['dice:park'] },
  { name: 'Марко', av: 'pt25', r: 1400, noise: 1.3, lvl: 0, coins: 250, items: ['fx:smoke'] },
  { name: 'Рустам', av: 'pt26', r: 1700, noise: 0.6, lvl: 0, coins: 300, items: ['fx:rings', 'pt:pt26'] },
  { name: 'Галина Петрівна', av: 'pt29', r: 2100, noise: 0, lvl: 0, coins: 350, items: ['board:coupe'] },
  { name: 'Капітан Нугзар', av: 'pt28', r: 2700, noise: 0, lvl: 1, coins: 400, items: ['ck:sea', 'fx:sparkle'] },
  { name: 'Тінь', av: 'pt31', r: 3600, noise: 0, lvl: 2, coins: 500, items: ['board:shadow', 'pt:pt31'] },
  { name: 'Майстер', av: 'mask', r: 5200, noise: 0, lvl: 3, coins: 1000, items: ['ck:crown', 'dice:emerald', 'board:marblehall', 'fx:fireworks', 'pt:pt23'] },
  // 0.31.3: the secret chapter 9, opened by beating the Master — Vlad, the teacher who led you all the way to take the hall for himself
  { name: 'Влад', av: 'vladM', r: 6000, noise: 0, lvl: 3, coins: 1500, items: ['fx:confetti', 'av:vladM', 'av:pasha2'] }];
// 0.31.0: each chapter is three steps — a puzzle (1, judged on the site like the daily one), a short game against a minor opponent
// from a set position (2), and the boss (3). ach.cs = steps done in the current chapter (camp+1). Minor games: the player is white and moves first.
const CAMP_STEP_COINS = { 1: 30, 2: 50 };
const RACE = (w: number[], b: number[]) => { const B = new Array(24).fill(0); w.forEach((n, i) => { B[18 + i] = n; }); b.forEach((n, i) => { B[6 + i] = -n; }); return B; };
const BLOCK = (st: number) => { const B = new Array(24).fill(0); B[8] = st; const home = st === 3 ? [2, 2, 2, 2, 2, 2] : [2, 2, 2, 2, 2, 1]; home.forEach((n, i) => { B[18 + i] = n; }); [13, 14, 15, 16, 17].forEach((i) => { B[i] = -1; }); [6, 7, 9, 10, 11].forEach((i) => { B[i] = -2; }); return B; };
const EVEN = [2, 2, 3, 3, 3, 2];
const CAMP_MINI: any[] = [null,
  { name: 'Сусід Вітя', av: 'm5', board: () => RACE(EVEN, EVEN), noise: 3 },
  { name: 'Студент Денис', av: 'm8', board: () => RACE(EVEN, EVEN), t: 10, noise: 2 },
  { name: 'Офіціантка Іра', av: 'n6', board: () => BLOCK(3), noise: 1.5 },
  { name: 'Кальянщик Саша', av: 'm10', board: () => RACE([3, 3, 3, 2, 2, 2], EVEN), noise: 1 },
  { name: 'Пасажир з верхньої полиці', av: 'm3', board: () => RACE(EVEN, EVEN), t: 10, noise: .5 },
  { name: 'Юнга Гіві', av: 'm11', board: () => RACE(EVEN, EVEN), dbl: 'none', noise: 0 },
  { name: 'Охоронець', av: 'm12', board: () => BLOCK(4), noise: 0, lvl: 1 },
  { name: 'Учень Майстра', av: 'n10', board: () => RACE(EVEN, EVEN), t: 10, noise: 0, lvl: 3 },
  { name: 'Права рука Влада', av: 'm7', board: () => BLOCK(4), t: 20, noise: 0, lvl: 3 }];
const SHOP_OPEN = Date.UTC(2026, 10, 7, 10, 0);   // accounts made before the shop opened get 3000 coins once, for the skins that became paid
// ---- daily gift (7-day streak) and quests of the day; quest progress is counted on the server in rate() ----
const DAILY = [50, 70, 90, 110, 130, 150, 300];
// 0.56: the challenge of the day — one harder task with a bigger prize, the same for everyone on a Kyiv day
const CHALS: any[] = [{ k: 'c_mars', ev: 'mars', n: 1, r: 200, ch: 1 }, { k: 'c_human2', ev: 'human', n: 2, r: 150, ch: 1 }, { k: 'c_win3', ev: 'win', n: 3, r: 150, ch: 1 }, { k: 'c_game6', ev: 'game', n: 6, r: 120, ch: 1 }];
function chalId(day: string) { let h = 7; for (const ch of day) h = (h * 131 + ch.charCodeAt(0)) >>> 0; const used = new Set(questIds(day).map((k) => QUESTS.find((q) => q.k === k)?.ev));
  for (let i = 0; i < CHALS.length; i++) { const C = CHALS[(h + i) % CHALS.length]; if (!used.has(C.ev)) return C.k; } return CHALS[h % CHALS.length].k; }
const QUESTS: any[] = [{ k: 'play2', ev: 'game', n: 2, r: 40 }, { k: 'play4', ev: 'game', n: 4, r: 70 }, { k: 'win1', ev: 'win', n: 1, r: 50 }, { k: 'win3', ev: 'win', n: 3, r: 100 }, { k: 'human1', ev: 'human', n: 1, r: 60 }, { k: 'mars1', ev: 'mars', n: 1, r: 100 }];
function questIds(day: string) { let h = 0; for (const ch of day) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const L = QUESTS.map((q) => q.k); const out: string[] = []; while (out.length < 3) { h = (h * 1103515245 + 12345) >>> 0; const k = L[h % L.length]; if (!out.includes(k)) out.push(k); } return out; }
function questState(A: any, day: string) { const q = A.q && A.q.d === day ? A.q : { d: day, p: {}, got: [] }; return q; }
function questTick(A: any, ev: Record<string, number>) { const day = kyivDay(); const q = questState(A, day); for (const k in ev) q.p[k] = (q.p[k] || 0) + ev[k]; A.q = q;
  const w = wqState(A); for (const k in ev) w.p[k] = (w.p[k] || 0) + ev[k]; A.wq = w; }
// ===== 0.57: weekly quests (3 a week, one may be swapped once a day), player level 1–50, titles =====
const WQ: any[] = [{ k: 'w_game15', ev: 'game', n: 15, r: 250 }, { k: 'w_game25', ev: 'game', n: 25, r: 400 }, { k: 'w_win8', ev: 'win', n: 8, r: 300 }, { k: 'w_win15', ev: 'win', n: 15, r: 500 },
  { k: 'w_human5', ev: 'human', n: 5, r: 300 }, { k: 'w_human10', ev: 'human', n: 10, r: 500 }, { k: 'w_mars2', ev: 'mars', n: 2, r: 300 }, { k: 'w_mars4', ev: 'mars', n: 4, r: 500 }];
function weekKey(t = Date.now()) { const d = new Date(t + 2 * 3600e3); const wd = (d.getUTCDay() + 6) % 7; return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - wd)).toISOString().slice(0, 10); }
function wqPick(w: string) { let h = 11; for (const ch of w) h = (h * 131 + ch.charCodeAt(0)) >>> 0; const out: string[] = [], evs = new Set(); for (let i = 0; out.length < 3 && i < 40; i++) { const Q = WQ[(h + i * 5) % WQ.length]; if (!evs.has(Q.ev)) { evs.add(Q.ev); out.push(Q.k); } } return out; }
function wqState(A: any) { const w = weekKey(); return A.wq && A.wq.w === w ? A.wq : { w, ids: wqPick(w), p: {}, got: [], rr: '' }; }
function lvXp(P: any, A: any) { return (P?.played | 0) * 10 + (P?.won | 0) * 15 + Object.keys(A.ach2 || {}).length * 40 + (A.pz?.n | 0) * 8 + (A.camp | 0) * 30 + (A.stc | 0) * 20 + (A.dmax | 0) * 10; }
function lvOf(xp: number) { let L = 1, need = 100; while (L < 50 && xp >= need) { xp -= need; L++; need = 100 + 20 * (L - 1); } return L; }
const prevDay = (day: string) => kyivDay(new Date(day + 'T12:00:00Z').getTime() - 864e5 - 2 * 3600e3 + 3600e3);
// ---- admin: only the account registered with the login nickname below (checked by its auth email, which never changes) ----
const ADMIN_NICKS = ['ka1p3r'];
function nickEmail(n: string) { const bytes = new TextEncoder().encode(n.trim().toLowerCase()); let bits = ''; for (const x of bytes) bits += x.toString(2).padStart(8, '0');
  const A = 'abcdefghijklmnopqrstuvwxyz234567'; let out = ''; for (let i = 0; i < bits.length; i += 5) out += A[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]; return 'u' + out + '@nardy.invalid'; }
// how a ghost plays: weaker players make more random moves (the engine at noise 0 is the strongest bot)
const ghostNoise = (sk: number) => sk < 750 ? 6 : sk < 950 ? 4 : sk < 1200 ? 2.5 : sk < 1500 ? 1.3 : sk < 1850 ? 0.6 : sk < 2200 ? 0.25 : 0;
// 0.26.1: above that the engine itself gets stronger: 1 = sees both sides, 2 = + a look ahead, 3 = a deeper look ahead
const ghostLvl = (sk: number) => sk >= 5000 ? 3 : sk >= 4000 ? 2 : sk >= 2700 ? 1 : 0;
// ---- password recovery: the login nickname → the account; the code goes to the Telegram linked to it ----
async function userByNick(db: any, nick: string) {
  const em = nickEmail(nick);
  for (let page = 1; page <= 10; page++) { const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 }); const us = data?.users || [];
    const u = us.find((x: any) => String(x.email || '').toLowerCase() === em); if (u) return u; if (us.length < 1000) break; }
  const { data: pr } = await db.from('profiles').select('id').ilike('name', nick.replace(/[%_\\]/g, (c: string) => '\\' + c)).limit(2);
  if (pr && pr.length === 1) { const { data } = await db.auth.admin.getUserById(pr[0].id); const u = data?.user; if (u && !u.is_anonymous && /@nardy\.invalid$/.test(u.email || '')) return u; }
  return null; }
// rank tiers (same table as the site): 8 tiers × 6 steps from 1000
const RANK_TH = (() => { const a = [1000]; for (let ti = 0; ti < 7; ti++) for (let k = 0; k < 6; k++) a.push(a[a.length - 1] + 34 + 8 * ti); return a; })();
const rankTier = (r: number) => { let i = 0; for (let t = 1; t < 8; t++) if (r >= RANK_TH[t * 6]) i = t; return i; };
const rndTok = (n: number) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (x) => 'abcdefghijkmnpqrstuvwxyz23456789'[x % 32]).join(''); };
const ADMIN_EMAILS = new Set(ADMIN_NICKS.map(nickEmail));
const isAdminUser = (u: any) => !!u && !u.is_anonymous && ADMIN_EMAILS.has(String(u.email || '').toLowerCase());
const kyivDay = (t = Date.now()) => new Date(t + 2 * 3600e3).toISOString().slice(0, 10);
// 0.65: evening prime time — 21:00–22:00 Kyiv every day: coins ×2 and the arena (points for every full game, top 3 get prizes)
const kyivHour = (t = Date.now()) => (new Date(t).getUTCHours() + 2) % 24;
const primeOn = (t = Date.now()) => kyivHour(t) === 21;
const AR_PRIZE = [500, 300, 200], AR_PLAY = 100, AR_MIN = 3;
// activity: the days a player was here (last 60) and games per day (last 60), kept in the profile for the admin statistics
function markDay(A: any, field: string, day = kyivDay()) { const L: string[] = Array.isArray(A[field]) ? A[field] : []; if (!L.includes(day)) L.push(day); A[field] = L.slice(-60); }
function markGame(A: any, human: boolean, day = kyivDay()) { const L: any[] = Array.isArray(A.gd) ? A.gd : []; let e = L.find((x) => x.d === day); if (!e) { e = { d: day, h: 0, b: 0 }; L.push(e); } if (human) e.h++; else e.b++; A.gd = L.slice(-60); markDay(A, 'days', day); }

// ---- web push (RFC 8030/8291/8292) with WebCrypto only: VAPID keys are made once and kept in a private storage bucket ----
const b64u = (u8: Uint8Array) => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ub64 = (s: string) => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s); return Uint8Array.from(b, (c) => c.charCodeAt(0)); };
const cat = (...a: Uint8Array[]) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
const te = new TextEncoder();
async function hmac(key: Uint8Array, data: Uint8Array) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, data)); }
let VAPID: any = null;
async function vapid(db: any) {
  if (VAPID) return VAPID;
  try { await db.storage.createBucket('srv', { public: false }); } catch (_) {}
  const dl = await db.storage.from('srv').download('vapid.json');
  let j: any = null; if (dl.data) { try { j = JSON.parse(await dl.data.text()); } catch (_) {} }
  if (!j) { const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    j = { priv: await crypto.subtle.exportKey('jwk', kp.privateKey), pub: b64u(new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey))) };
    await db.storage.from('srv').upload('vapid.json', new Blob([JSON.stringify(j)], { type: 'application/json' }), { upsert: true }); }
  const key = await crypto.subtle.importKey('jwk', j.priv, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  VAPID = { key, pub: j.pub }; return VAPID; }
async function vapidJwt(V: any, endpoint: string) {
  const aud = new URL(endpoint).origin, h = b64u(te.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))), p = b64u(te.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:nardy@nardy.invalid' })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, V.key, te.encode(h + '.' + p))); return h + '.' + p + '.' + b64u(sig); }
async function encrypt(sub: any, payload: Uint8Array) {
  const ua = ub64(sub.keys.p256dh), auth = ub64(sub.keys.auth);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']); const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const prkKey = await hmac(auth, ecdh), ikm = await hmac(prkKey, cat(te.encode('WebPush: info\0'), ua, asPub, new Uint8Array([1])));
  const salt = crypto.getRandomValues(new Uint8Array(16)), prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(te.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1])))).slice(0, 16), nonce = (await hmac(prk, cat(te.encode('Content-Encoding: nonce\0'), new Uint8Array([1])))).slice(0, 12);
  const k = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']); const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, k, cat(payload, new Uint8Array([2]))));
  const rs = new Uint8Array([0, 0, 16, 0]); return cat(salt, rs, new Uint8Array([65]), asPub, ct); }
async function pushOne(db: any, sub: any, msg: any) { const V = await vapid(db); const body = await encrypt(sub, te.encode(JSON.stringify(msg)));
  const r = await fetch(sub.endpoint, { method: 'POST', headers: { Authorization: 'vapid t=' + (await vapidJwt(V, sub.endpoint)) + ', k=' + V.pub, 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '3600', Urgency: 'high' }, body });
  return r.status; }
// send to a list of profiles; subscriptions that are gone (404/410) are dropped
async function pushTo(db: any, rows: any[], msg: any) { let sent = 0;
  for (const r of rows) { const A = { ...(r.ach || {}) }; const L = Array.isArray(A.push) ? A.push : []; if (!L.length) continue; const keep: any[] = [];
    for (const sub of L) { try { const st = await pushOne(db, sub, msg); if (st === 404 || st === 410) continue; if (st < 300) sent++; } catch (_) {} keep.push(sub); }
    if (keep.length !== L.length) { A.push = keep; await db.from('profiles').update({ ach: A }).eq('id', r.id); } }
  return sent; }
// the weekend tournament reminders: Saturday 12:00 (everyone), 17:00 and 17:50 (signed up), Sunday 17:50 play-off (signed up) — Kyiv time
const KYIV_OFF = 2 * 3600e3;
function pushEvents(now: number) {
  const E = TR.tourEvent(now); const ev: any[] = []; if (!E) return ev;
  const hm = (t: number) => new Date(t + KYIV_OFF).toISOString().slice(11, 16);
  const dayUk = (t: number) => ['у неділю', 'у понеділок', 'у вівторок', 'у середу', 'у четвер', 'у п’ятницю', 'у суботу'][new Date(t + KYIV_OFF).getUTCDay()];
  const dayEn = (t: number) => ['on Sunday', 'on Monday', 'on Tuesday', 'on Wednesday', 'on Thursday', 'on Friday', 'on Saturday'][new Date(t + KYIV_OFF).getUTCDay()];
  const win = (from: number, len: number) => now >= from && now < from + len;
  if (E.moved && now < E.gAt - 60 * TR.MIN && now >= E.gAt - 24 * 3600e3) ev.push({ id: 'moved-' + E.id, who: 'reg', uk: ['Турнір перенесено', 'Групи ' + dayUk(E.gAt) + ' о ' + hm(E.gAt) + ', плей-оф о ' + hm(E.pAt) + '. Ваш запис зберігається.'], en: ['The tournament has moved', 'Groups ' + dayEn(E.gAt) + ' at ' + hm(E.gAt) + ', play-off at ' + hm(E.pAt) + '. You are still signed up.'] });
  if (win(E.gAt - 6 * 3600e3, 40 * TR.MIN)) ev.push({ id: 'day-' + E.id, who: 'all', uk: ['Сьогодні турнір вихідного дня', 'О ' + hm(E.gAt) + ' — групи. Запис ще відкритий, заходьте!'], en: ['Weekend tournament today', 'Groups at ' + hm(E.gAt) + '. Sign-up is still open!'] });
  if (win(E.gAt - 60 * TR.MIN, 40 * TR.MIN)) ev.push({ id: 'h1-' + E.id, who: 'reg', uk: ['Турнір через годину', 'Групи стартують о ' + hm(E.gAt) + ' — ви записані.'], en: ['Tournament in an hour', 'Groups start at ' + hm(E.gAt) + ' — you are signed up.'] });
  if (win(E.gAt - 10 * TR.MIN, 30 * TR.MIN)) ev.push({ id: 'g-' + E.id, who: 'reg', uk: ['Турнір починається!', 'Ваша група вже чекає — відкрийте турнір і грайте перший матч.'], en: ['The tournament is starting!', 'Your group is waiting — open the tournament and play your first match.'] });
  if (win(E.pAt - 10 * TR.MIN, 30 * TR.MIN)) ev.push({ id: 'p-' + E.id, who: 'reg', uk: ['Плей-оф починається', 'О ' + hm(E.pAt) + ' — чвертьфінали. Якщо ви вийшли з групи — заходьте!'], en: ['The play-off is starting', 'Quarter-finals at ' + hm(E.pAt) + '. If you got through your group, come in!'] });
  if (E.fmt === 'cs' && win(E.drawAt, 40 * TR.MIN)) ev.push({ id: 'draw-' + E.id, who: 'reg', uk: ['Жеребкування готове', 'Перший раунд — у суботу о ' + hm(E.gAt) + '. Відкрийте турнір: там ваш суперник.'], en: ['The draw is out', 'Round 1 is on Saturday at ' + hm(E.gAt) + '. Open the tournament to see your opponent.'] });
  if (E.fmt === 'cs') { const fx: any = [[/Запис ще відкритий, заходьте!/g, 'Перші пари вже відомі — відкрийте турнір.'], [/Sign-up is still open!/g, 'The first pairs are out — open the tournament.'], [/Групи стартують/g, 'Швейцарська система стартує'], [/Групи /g, 'Швейцарська система '], [/— групи\./g, '— швейцарська система.'], [/Ваша група вже чекає — відкрийте турнір і грайте перший матч\./g, 'Перший раунд уже чекає — відкрийте турнір і грайте.'], [/— чвертьфінали\. Якщо ви вийшли з групи/g, '— плей-оф (верхня й нижня сітки). Якщо ви пройшли швейцарку'],
      [/Groups start/g, 'The Swiss stage starts'], [/Groups at/g, 'The Swiss stage at'], [/Groups /g, 'The Swiss stage '], [/Your group is waiting/g, 'Round 1 is waiting'], [/Quarter-finals at/g, 'The play-off (upper and lower brackets) at']];
    ev.forEach((e: any) => { for (const L of ['uk', 'en']) e[L] = e[L].map((x: string) => fx.reduce((t: string, [re, to]: any) => t.replace(re, to), x)); }); }
  return ev; }

// ---- Telegram Mini App login ----
// The Mini App gets a signed initData string from Telegram. Telegram signs it with its own Ed25519 key, so we can
// check it with just the bot's id (no bot token on the server). If TG_BOT_TOKEN is set, the HMAC hash is accepted too.
const TG_BOT_ID = 9048788159;
const TG_PUB = 'e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d';
const hex2u8 = (h: string) => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));
async function tgVerify(initData: string, pubHex = TG_PUB, botId = TG_BOT_ID): Promise<any | null> {
  const P = new URLSearchParams(initData); const hash = P.get('hash') || '', sig = P.get('signature') || '';
  const pairs: string[] = []; P.forEach((v, k) => { if (k !== 'hash' && k !== 'signature') pairs.push(k + '=' + v); }); pairs.sort();
  const enc = new TextEncoder(); let ok = false;
  if (sig) { try { const key = await crypto.subtle.importKey('raw', hex2u8(pubHex), { name: 'Ed25519' }, false, ['verify']);
    ok = await crypto.subtle.verify('Ed25519', key, ub64(sig), enc.encode(botId + ':WebAppData\n' + pairs.join('\n'))); } catch (_) { ok = false; } }
  const tok = (globalThis as any).Deno?.env.get('TG_BOT_TOKEN');
  if (!ok && tok && hash) { const sk = await hmac(enc.encode('WebAppData'), enc.encode(tok));
    const h = Array.from(await hmac(sk, enc.encode([...pairs].join('\n')))).map((b) => b.toString(16).padStart(2, '0')).join(''); ok = h === hash; }
  if (!ok) return null;
  const at = +(P.get('auth_date') || 0); if (!at || Date.now() / 1000 - at > 86400) return null;
  try { return JSON.parse(P.get('user') || 'null'); } catch (_) { return null; }
}

// "Log in with Telegram" button on the website: Telegram signs these fields with SHA256(bot token), so it needs TG_BOT_TOKEN.
async function tgWidgetVerify(d: any): Promise<any | null> {
  const tok = (globalThis as any).Deno?.env.get('TG_BOT_TOKEN'); if (!tok || !d || !d.hash || !d.id) return null;
  const pairs = Object.keys(d).filter((k) => k !== 'hash' && d[k] != null && d[k] !== '').sort().map((k) => k + '=' + d[k]);
  const sk = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tok)));
  const h = Array.from(await hmac(sk, new TextEncoder().encode(pairs.join('\n')))).map((b) => b.toString(16).padStart(2, '0')).join('');
  if (h !== String(d.hash)) return null; if (Date.now() / 1000 - (+d.auth_date || 0) > 86400) return null;
  return { id: d.id, first_name: d.first_name, last_name: d.last_name, username: d.username, language_code: '' };
}
// one account per Telegram user: a nickname account the player linked (ach.tg), otherwise tg-<id>@telegram.invalid
async function tgSession(db: any, tu: any) {
  const { data: linked } = await db.from('profiles').select('id').eq('ach->>tg', String(tu.id)).limit(1);
  let email = 'tg-' + tu.id + '@telegram.invalid', isNew = false;
  if (linked && linked.length) { const { data: u } = await db.auth.admin.getUserById(linked[0].id); if (u?.user?.email) email = u.user.email; }
  else { const cr = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: { tg: tu.id } }); isNew = !cr.error; }
  const { data: L, error } = await db.auth.admin.generateLink({ type: 'magiclink', email }); if (error || !L?.properties?.hashed_token) return null;
  return { ok: true, token_hash: L.properties.hashed_token, isNew, tg: { id: tu.id, first: tu.first_name || '', last: tu.last_name || '', username: tu.username || '', lang: tu.language_code || '' } };
}
const TG_BONUS = 500, TG_FRAME = 'frame:tg';

// ---- CrazyGames accounts: the SDK gives a signed token (RS256); we check it with CrazyGames' public key and sign the player in ----
let cgKey: any = null, cgKeyAt = 0;
async function cgPublicKey() { if (cgKey && Date.now() - cgKeyAt < 3600e3) return cgKey;
  const r = await fetch('https://sdk.crazygames.com/publicKey.json'); const j = await r.json(); const pem = String(j.publicKey || '').replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)); cgKey = await crypto.subtle.importKey('spki', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']); cgKeyAt = Date.now(); return cgKey; }
const b64d = (x: string) => Uint8Array.from(atob(x.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((x.length + 3) % 4)), (c) => c.charCodeAt(0));
async function cgVerify(tok: string): Promise<any | null> { try { const [h, p, sg] = String(tok || '').split('.'); if (!h || !p || !sg) return null;
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', await cgPublicKey(), b64d(sg), new TextEncoder().encode(h + '.' + p)); if (!ok) return null;
    const c = JSON.parse(new TextDecoder().decode(b64d(p))); if (c.exp && c.exp * 1000 < Date.now()) return null;
    const gid = (globalThis as any).Deno?.env.get('CG_GAME_ID') || ''; if (gid && String(c.gameId || '') !== gid) return null;
    return c.userId ? c : null; } catch (_) { return null; } }
// one account per CrazyGames user: cg-<userId>@crazygames.invalid, the CrazyGames id kept in ach.cg
async function cgSession(db: any, cu: any) {
  const id = String(cu.userId).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64); const email = 'cg-' + id.toLowerCase() + '@crazygames.invalid'; let isNew = false;
  const { data: linked } = await db.from('profiles').select('id').eq('ach->>cg', id).limit(1);
  if (!(linked && linked.length)) { const cr = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: { cg: id } }); isNew = !cr.error; }
  const { data: L, error } = await db.auth.admin.generateLink({ type: 'magiclink', email }); if (error || !L?.properties?.hashed_token) return null;
  return { ok: true, token_hash: L.properties.hashed_token, isNew, cg: { id, name: String(cu.username || '').slice(0, 30) } }; }

// ---- the Telegram bot itself (needs TG_BOT_TOKEN): answers /start with a "Play" button; set up from Admin → Tools ----
const SITE = 'https://nardy-nine.vercel.app/';
const tgTok = () => (globalThis as any).Deno?.env.get('TG_BOT_TOKEN') || '';
async function tgApi(method: string, body: any) {
  const r = await fetch('https://api.telegram.org/bot' + tgTok() + '/' + method, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return await r.json().catch(() => ({ ok: false }));
}
async function tgHookSecret() { const h = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('nardy-hook:' + tgTok()))); return Array.from(h.slice(0, 24)).map((b) => b.toString(16).padStart(2, '0')).join(''); }
const TG_TXT: any = {
  uk: { hi: (n: string) => `Привіт${n ? ', ' + n : ''}! 🎲\n\n<b>Довгі нарди</b> онлайн — грайте з друзями або з випадковим суперником, піднімайте рейтинг і забирайте призи турніру вихідного дня.\n\n🎁 За вхід через Telegram — <b>+500 монет</b> і рамка Telegram.`,
        play: '🎲 Грати', tour: '🏆 Турнір вихідного дня', invite: '👥 Запросити друга', inviteText: 'Зіграймо в довгі нарди!',
        help: 'Натисніть «Грати», щоб відкрити нарди.', menu: 'Грати',
        desc: 'Довгі нарди онлайн: гра з друзями за посиланням, суперники за рейтингом, турнір вихідного дня з призами, колекція дощок і шашок. Натисніть «Почати» і грайте прямо в Telegram.',
        short: 'Довгі нарди онлайн: друзі, рейтинг, турніри. Грайте прямо в Telegram.' },
  en: { hi: (n: string) => `Hi${n ? ', ' + n : ''}! 🎲\n\n<b>Long nardy</b> online — play friends or a random opponent, climb the rating and win the weekend tournament prizes.\n\n🎁 Signing in with Telegram gives <b>+500 coins</b> and the Telegram frame.`,
        play: '🎲 Play', tour: '🏆 Weekend tournament', invite: '👥 Invite a friend', inviteText: 'Let’s play long nardy!',
        help: 'Tap “Play” to open nardy.', menu: 'Play',
        desc: 'Long nardy (backgammon) online: play friends by link, opponents by rating, a weekend tournament with prizes, a collection of boards and checkers. Tap Start and play right in Telegram.',
        short: 'Long nardy online: friends, rating, tournaments. Play right in Telegram.' },
};
// a message from the bot with one button that opens the Mini App (startapp = where to go: g-<game>, tour, …)
async function tgTell(chat: any, text: string, btn: string, start = '') {
  if (!chat || !tgTok()) return 0; const url = 'https://t.me/dovgi_nardy_bot' + (start ? '?startapp=' + start : '');
  const r = await tgApi('sendMessage', { chat_id: Number(chat), text, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: btn, url }]] } }).catch(() => null); return r?.ok ? 1 : 0; }
const tgLang = (c: string) => /^(uk|ru|be)/.test(c || '') ? 'uk' : 'en';
async function tgOnUpdate(u: any, db: any = null) {
  const m = u?.message; if (!m || !m.chat || m.chat.type !== 'private') return;
  const L = TG_TXT[tgLang(m.from?.language_code)], text = String(m.text || '');
  const kb = { inline_keyboard: [[{ text: L.play, web_app: { url: SITE } }], [{ text: L.tour, web_app: { url: SITE + '?tour=1' } }],
    [{ text: L.invite, url: 'https://t.me/share/url?url=' + encodeURIComponent('https://t.me/dovgi_nardy_bot?startapp=go') + '&text=' + encodeURIComponent(L.inviteText) }]] };
  // 0.61: /stop and /remind switch the evening reminders off and on
  if (db && (text.startsWith('/stop') || text.startsWith('/remind'))) { const off = text.startsWith('/stop'); const { data: rows } = await db.from('profiles').select('id,ach').eq('ach->>tg', String(m.from?.id || m.chat.id)).limit(1);
    if (rows && rows[0]) { const A = { ...(rows[0].ach || {}) }; if (off) A.noRem = 1; else delete A.noRem; await db.from('profiles').update({ ach: A }).eq('id', rows[0].id); }
    await tgApi('sendMessage', { chat_id: m.chat.id, text: off ? (tgLang(m.from?.language_code) === 'uk' ? 'Добре, вечірніх нагадувань більше не буде. Повернути: /remind' : 'OK, no more evening reminders. To turn them back on: /remind') : (tgLang(m.from?.language_code) === 'uk' ? 'Нагадування ввімкнено 🔔' : 'Reminders are on 🔔') }); return; }
  if (text.startsWith('/start') || text.startsWith('/play')) await tgApi('sendMessage', { chat_id: m.chat.id, text: L.hi(m.from?.first_name || ''), parse_mode: 'HTML', reply_markup: kb });
  else await tgApi('sendMessage', { chat_id: m.chat.id, text: L.help, reply_markup: kb });
}
async function tgSetup(hookUrl: string) {
  const out: any = {};
  out.webhook = (await tgApi('setWebhook', { url: hookUrl, secret_token: await tgHookSecret(), allowed_updates: ['message'], drop_pending_updates: true })).ok;
  for (const [lc, L] of [['', TG_TXT.en], ['uk', TG_TXT.uk], ['ru', TG_TXT.uk]] as any) {
    const lcA = lc ? { language_code: lc } : {};
    out['desc' + lc] = (await tgApi('setMyDescription', { description: L.desc, ...lcA })).ok;
    out['short' + lc] = (await tgApi('setMyShortDescription', { short_description: L.short, ...lcA })).ok;
    out['cmd' + lc] = (await tgApi('setMyCommands', { commands: [{ command: 'start', description: L.play.replace(/^\S+\s/, '') }], ...lcA })).ok;
  }
  out.menu = (await tgApi('setChatMenuButton', { menu_button: { type: 'web_app', text: TG_TXT.uk.menu, web_app: { url: SITE } } })).ok;
  const me = await tgApi('getMe', {}); out.bot = me?.result?.username || null;
  return out;
}

// ---- weekend tournament on the server (see tour.ts): the draw and each result are files in Storage srv/tour/<event>/ ----
// results are written once: a lock file l_<match> (first writer wins) and a name x_<match>_<w>_<mars>_<at>_<how> to read them back with one list call
const tourSeason = (t: number) => Math.max(0, Math.floor((t - Date.UTC(2026, 10, 7, 16, 0) + 3 * 864e5) / (4 * 7 * 864e5)));
async function tourLoad(db: any, eid: string) {
  const dir = 'tour/' + eid; const { data: L } = await db.storage.from('srv').list(dir, { limit: 1000 });
  const names = (L || []).map((f: any) => f.name); const res: any = {};
  for (const n of names) { const m = n.match(/^x_([a-z0-9]+)_(a|b)_(0|1)_(\d+)_([a-z]+)$/); if (m) res[m[1]] = { w: m[2], mars: m[3] === '1', at: +m[4], how: m[5] }; }
  for (const n of names) { const m = n.match(/^l_([a-z0-9]+)$/); if (m && !res[m[1]]) { const d = await db.storage.from('srv').download(dir + '/' + n); if (d.data) { try { res[m[1]] = JSON.parse(await d.data.text()); } catch (_) {} } } }
  let draw = null; if (names.includes('draw.json')) { const d = await db.storage.from('srv').download(dir + '/draw.json'); if (d.data) draw = JSON.parse(await d.data.text()); }
  return { draw, res, names };
}
// season points of the tournament bots (they took part too): tour/botpts.json = { evs: [event ids], p: { botId: [{ at, pl, pts, ev }] } }
async function botPtsAdd(db: any, eid: string, draw: any, C: any, res: any) {
  const F = (await lgFile(db, 'tour/botpts.json')) || { evs: [], p: {} }; if (F.evs.includes(eid)) return F; const all = [...C.gm, ...C.po];
  for (let i = 0; i < 16; i++) { const P = draw.players[i]; if (!P?.bot) continue; const pl = C.places[i]; (F.p[P.id] ||= []).push({ at: Date.now(), pl, pts: (draw.fmt === 'cs' ? TR.TPTS_CS : TR.TPTS)(pl, C.wins ? C.wins[i] : TR.winsOf(all, res, i)), ev: eid }); F.p[P.id] = F.p[P.id].slice(-30); }
  F.evs = [...F.evs, eid].slice(-20); await lgSave(db, 'tour/botpts.json', F); return F; }
async function tourPut(db: any, path: string, body: string) { const r = await db.storage.from('srv').upload(path, new Blob([body], { type: 'application/json' }), { upsert: false }); return !r.error; }
async function tourWrite(db: any, eid: string, mid: string, r: any) {
  const ok = await tourPut(db, 'tour/' + eid + '/l_' + mid, JSON.stringify(r)); if (!ok) return false;
  await tourPut(db, 'tour/' + eid + '/x_' + mid + '_' + r.w + '_' + (r.mars ? 1 : 0) + '_' + Math.round(r.at) + '_' + r.how, '{}'); return true;
}
async function tourEnsureDraw(db: any, E: any) {
  let { draw, res, names } = await tourLoad(db, E.id); if (draw || Date.now() < (E.drawAt || E.gAt)) return { draw, res, names };
  const season = tourSeason(E.gAt - 864e5);
  const { data } = await db.from('profiles').select('id,name,av,rating,ach').not('ach->treg', 'is', null).limit(1000);
  const reals = (data || []).filter((r: any) => r.ach?.treg && r.ach.treg.s === season).map((r: any) => ({ id: r.id, nick: r.ach.treg.nick, name: r.name, full: r.ach.treg.first + ' «' + r.ach.treg.nick + '» ' + r.ach.treg.last, av: r.av, r: r.rating || 1000, at: r.ach.treg.at || 0 }));
  const d = TR.tourDraw(E, season, reals);
  if (!(await tourPut(db, 'tour/' + E.id + '/draw.json', JSON.stringify(d)))) return await tourLoad(db, E.id);
  return { draw: d, res, names };
}
// resolve what is due (bot games, no-shows, finished online games), then pay the prizes once the final is over
async function tourTick(db: any, E: any) {
  let { draw, res, names } = await tourEnsureDraw(db, E); if (!draw) return { draw: null, res: {}, C: null };
  let C = TR.tourCompute(draw, res, Date.now());
  for (let pass = 0; pass < 6 && C.due.length; pass++) {
    let wrote = false; const now = Date.now();
    for (const d of C.due) {
      const m = [...C.gm, ...C.po].find((x: any) => x.id === d.mid); let r: any = null; const key = d.key || d.mid, cs = draw.fmt === 'cs';   // CS format: a result per game of a series
      const sim = (at: number) => cs ? TR.simGameCS(draw, m, key, at) : TR.simResult(draw, m, at);
      if (d.kind === 'sim') r = sim(d.at);
      else if (d.kind === 'botwin') r = { w: d.w, mars: false, at: now, how: 'noshow' };
      else if (d.kind === 'hvh') {
        const { data: g } = await db.from('games').select('state').eq('id', TR.gameIdOf(draw, key)).maybeSingle(); const st = g?.state; const A = draw.players[m.a].id;
        if (st && st.phase === 'over' && st.result) { const wu = st[st.result.winner]; r = { w: wu === A ? 'a' : 'b', mars: !!st.result.mars, at: now, how: 'play' }; }
        else if (d.noshow && st && !st.p2) r = { w: st.p1 === A ? 'a' : 'b', mars: false, at: now, how: 'noshow' };
        else if ((d.hard && !st) || d.late) r = { ...sim(now), how: 'sim' };
      }
      if (r && await tourWrite(db, E.id, key, r)) { res[key] = r; wrote = true; }
    }
    if (!wrote) break; C = TR.tourCompute(draw, res, Date.now());
  }
  if (C.done && !names.includes('paid')) {
    const all = [...C.gm, ...C.po];
    if (await tourPut(db, 'tour/' + E.id + '/paid', '{}')) {
      try { await botPtsAdd(db, E.id, draw, C, res); } catch (_) {}
      for (let i = 0; i < 16; i++) { const P = draw.players[i]; if (P.bot) continue; const pl = C.places[i], prize = draw.fmt === 'cs' ? TR.PRIZE_CS(pl) : TR.PRIZE(pl), pts = (draw.fmt === 'cs' ? TR.TPTS_CS : TR.TPTS)(pl, C.wins ? C.wins[i] : TR.winsOf(all, res, i));
        const { data: p } = await db.from('profiles').select('ach').eq('id', P.id).maybeSingle(); if (!p) continue;
        const A = { ...(p.ach || {}) }; A.tourAt = Date.now(); A.coins = (A.coins ?? COIN_START) + prize; A.tp = [...(A.tp || []), { at: A.tourAt, pl, pts, ev: E.id }].slice(-30);
        await db.from('profiles').update({ ach: A }).eq('id', P.id);
        if (A.tg) { const en = A.lang === 'en'; await tgTell(A.tg, en ? `🏆 The weekend tournament is over: you are <b>#${pl}</b> of 16` + (prize ? ` and get <b>${prize}</b> coins.` : '.') + `\nThe next one is next weekend — sign up early.`
          : `🏆 Турнір вихідного дня завершено: ви на <b>${pl}-му місці</b> з 16` + (prize ? ` і отримуєте <b>${prize}</b> монет.` : '.') + `\nНаступний — на вихідних, записуйтесь заздалегідь.`, en ? 'Results' : 'Результати', 'tour'); } }
    }
  }
  return { draw, res, C };
}
// a tournament game id belongs to one match: only its two players may create or join it, and only while it is open
async function tourGuard(db: any, gid: string, uid: string): Promise<string | null> {
  const mm = String(gid || '').match(/^t(\d{6})((?:g\d\d)|(?:qf\d)|(?:sf\d)|f0|th0|(?:(?:s\d\d|uq\d|us\d|uf0|l1\d|l2\d|ls0|lf0|gf0)n\d))$/); if (!mm) return null;
  const E = TR.tourEvent(Date.now()); if (!E || E.id !== mm[1]) return 'tour_closed';
  const { draw, res } = await tourLoad(db, E.id); if (!draw) return 'tour_closed';
  const C = TR.tourCompute(draw, res, Date.now()); const cs = draw.fmt === 'cs', mid = cs ? mm[2].replace(/n\d$/, '') : mm[2];
  const m = [...C.gm, ...C.po].find((x: any) => x.id === mid);
  if (!m || m.a == null || m.b == null || draw.players[m.a].bot || draw.players[m.b].bot) return 'bad_match';
  if (draw.players[m.a].id !== uid && draw.players[m.b].id !== uid) return 'not_yours';
  if (cs) { if (!m.cur || m.cur.key !== mm[2] || Date.now() < m.cur.av - 60e3) return 'tour_closed'; }
  else if (res[m.id] || Date.now() < m.av - 60e3) return 'tour_closed';
  return null;
}
function tourView(E: any, draw: any, res: any, C: any) {
  if (draw && draw.fmt === 'cs') return tourViewCS(E, draw, res, C);
  const pub = (m: any) => ({ id: m.id, st: m.st, G: m.G, k: m.k, rd: m.rd, a: m.a, b: m.b, av: m.av === Infinity ? null : m.av, hard: m.hard === Infinity ? null : m.hard, r: res[m.id] || null, gid: draw && m.a != null && m.b != null && !draw.players[m.a].bot && !draw.players[m.b].bot ? TR.gameIdOf(draw, m.id) : null });
  return { ev: { id: E.id, gAt: E.gAt, pAt: E.pAt, moved: E.moved }, now: Date.now(), phase: C ? C.phase : 'pre', season: draw ? draw.season : tourSeason(E.gAt - 864e5),
    players: draw ? draw.players.map((p: any) => ({ id: p.id, bot: p.bot, name: p.name, full: p.full, av: p.av, r: p.r })) : null,
    gm: C ? C.gm.map(pub) : null, po: C ? C.po.map(pub) : null, places: C ? C.places : null };
}

function tourViewCS(E: any, draw: any, res: any, C: any) {
  const T = (x: number) => x === Infinity || x == null ? null : x; const hvh = (m: any) => m.a != null && m.b != null && !draw.players[m.a].bot && !draw.players[m.b].bot;
  const pub = (m: any) => ({ id: m.id, st: m.st, rd: m.rd, k: m.k, rec: m.rec, a: m.a, b: m.b, bo: m.bo, av: T(m.av), hard: T(m.hard), sa: m.sa, sb: m.sb, r: m.r,
    g: (m.g || []).map((x: any) => ({ n: x.n, key: x.key, r: x.r, av: T(x.av), gid: hvh(m) ? TR.gameIdOf(draw, x.key) : null })), cur: m.cur ? { n: m.cur.n, key: m.cur.key, av: T(m.cur.av), gid: hvh(m) ? TR.gameIdOf(draw, m.cur.key) : null } : null });
  return { fmt: 'cs', ev: { id: E.id, gAt: E.gAt, pAt: E.pAt, moved: E.moved, fmt: 'cs' }, now: Date.now(), phase: C ? C.phase : 'pre', season: draw.season,
    players: draw.players.map((p: any) => ({ id: p.id, bot: p.bot, name: p.name, full: p.full, av: p.av, r: p.r })), rec: C ? C.rec : null,
    gm: C ? C.gm.map(pub) : [], po: C ? C.po.map(pub) : [], places: C ? C.places : null };
}
// ---- weekly leagues: Bronze → Silver → Gold → Diamond. Groups of 20 (free places = league bots whose points grow
// through the week). Points: a full game 1, a win 3, a mars win 4. Week = Monday 00:00 → Sunday 24:00 (Kyiv).
// At the end: top 5 go up, bottom 5 go down; prizes for places 1–5. Group files live in storage: srv/league/<wk>/<g>.json.
const LG_EPOCH = Date.UTC(2026, 10, 8, 22, 0), LG_WEEK = 7 * 864e5, LG_N = 30, LG_TIERS = 4;
const lgWeek = (t = Date.now()) => Math.max(0, Math.floor((t - LG_EPOCH) / LG_WEEK));
const lgEnd = (wk: number) => LG_EPOCH + (wk + 1) * LG_WEEK;
const lgStart = (wk: number) => wk === 0 ? Date.UTC(2026, 10, 7, 22, 0) : LG_EPOCH + wk * LG_WEEK;
const LG_PRIZE = [500, 300, 200, 100, 100];
const LG_NAMES = ['Артем', 'Олег', 'Ірина', 'Максим', 'Софія', 'Денис', 'Оля', 'Тарас', 'Марта', 'Богдан', 'Юлія', 'Сергій', 'Настя', 'Віктор', 'Даша', 'Ігор', 'Аня', 'Роман', 'Катя', 'Назар', 'Ліза', 'Андрій', 'Віра', 'Остап', 'Зоя', 'Петро', 'Леся', 'Влад К.', 'Яна', 'Гліб'];
function lgRng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function lgHash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
// the league bots of a group, with their points at time t
function lgBots(wk: number, g: string, n: number, t: number) {
  const tier = +g.split('-')[0], r = lgRng(lgHash(wk + ':' + g)), hrs = Math.max(0, Math.min(t, lgEnd(wk)) - lgStart(wk)) / 3600e3, out: any[] = [];
  for (let i = 0; i < n; i++) { const rate = (0.04 + r() * 0.26) * (1 + tier * 0.35), lazy = r() < 0.25 ? 0.25 : 1, nm = LG_NAMES[Math.floor(r() * LG_NAMES.length)] + (r() < 0.3 ? ' ' + 'АБВГДКМНОПРСТ'[Math.floor(r() * 13)] + '.' : '');
    out.push({ id: 'lb' + i, bot: 1, name: nm, av: 'pt' + (1 + Math.floor(r() * 36)), pts: Math.floor(hrs * rate * lazy * (0.85 + r() * 0.3)) }); }
  return out; }
async function lgFile(db: any, path: string) { const dl = await db.storage.from('srv').download(path); if (!dl.data) return null; try { return JSON.parse(await dl.data.text()); } catch (_) { return null; } }
async function lgSave(db: any, path: string, obj: any) { await db.storage.from('srv').upload(path, new Blob([JSON.stringify(obj)], { type: 'application/json' }), { upsert: true }); }
function lgTable(wk: number, g: string, F: any, t: number) {
  const reals = Object.entries((F && F.m) || {}).map(([id, v]: any) => ({ id, name: v.n, av: v.av, pts: v.p || 0 }));
  const all = [...reals, ...lgBots(wk, g, Math.max(0, LG_N - reals.length), t)]; all.sort((a, b) => b.pts - a.pts || (a.bot ? 1 : 0) - (b.bot ? 1 : 0)); return all; }
// settle the player's finished week (prize, up / down) — once
async function lgSettle(db: any, A: any) {
  const L = A.lg; if (!L || L.w >= lgWeek() || A.lgPaid === L.w) return null;
  const F = await lgFile(db, 'league/' + L.w + '/' + L.g + '.json'); const T = lgTable(L.w, L.g, F, lgEnd(L.w)); const place = T.findIndex((r: any) => r.id === A.__id) + 1 || T.length;
  const tier = +L.g.split('-')[0]; let nt = tier; if (place <= 5 && tier < LG_TIERS - 1) nt = tier + 1; else if (place > LG_N - 5 && tier > 0) nt = tier - 1;
  const prize = LG_PRIZE[place - 1] || 0; A.coins = (A.coins ?? COIN_START) + prize; A.lgTier = nt; A.lgPaid = L.w; A.lgLast = { w: L.w, place, tier, nt, prize, at: Date.now() };
  return A.lgLast; }
// add points for a finished game (joins this week's group on the first points)
const LG_ON = true;   // 0.71: weekly leagues are back (groups of 30)
async function lgAdd(db: any, id: string, A: any, name: string, av: string, pts: number) {
  try { A.__id = id; await lgSettle(db, A); delete A.__id;
    const wk = lgWeek(); if (!A.lg || A.lg.w !== wk) { const tier = A.lgTier || 0; const ixP = 'league/' + wk + '/index.json'; const I = (await lgFile(db, ixP)) || {}; const n = I[tier] || 0; I[tier] = n + 1; await lgSave(db, ixP, I);
      A.lg = { w: wk, g: tier + '-' + Math.floor(n / LG_N), p: 0 }; }
    A.lg.p = (A.lg.p || 0) + pts; const path = 'league/' + wk + '/' + A.lg.g + '.json'; const F = (await lgFile(db, path)) || { m: {} };
    F.m[id] = { n: String(name || '').slice(0, 20), av: av || '', p: A.lg.p }; await lgSave(db, path, F);
  } catch (_) {} }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!, svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')!;
    const db = createClient(url, svc, { auth: { persistSession: false } });
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const body0 = await req.json().catch(() => ({}));
    // Telegram webhook: an update from the bot (checked by the secret header)
    if (body0 && body0.update_id != null) {
      if (!tgTok() || req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== await tgHookSecret()) return json({ ok: false }, 401);
      try { await tgOnUpdate(body0, db); } catch (_) {} return json({ ok: true });
    }
    // public: the VAPID public key, and the reminder tick (called every few minutes by a scheduled GitHub Action)
    if (body0.action === 'tour_state') {
      const E = TR.tourEvent(Date.now()); if (!E) return json({ ev: null });
      const { draw, res, C } = await tourTick(db, E); return json(tourView(E, draw, res, C));
    }
    // 0.75: the history of finished weekend tournaments (top 3, your place) — cached for 10 minutes in srv/tour/hist.json
    if (body0.action === 'tour_hist') {
      const cache = await lgFile(db, 'tour/hist.json'); if (cache && Date.now() - cache.at < 10 * 60e3) return json(cache);
      const { data: L } = await db.storage.from('srv').list('tour', { limit: 500 });
      const ids = (L || []).map((f: any) => f.name).filter((n: string) => /^\d{6}$/.test(n)).sort().reverse();
      const cur = TR.tourEvent(Date.now()); const list: any[] = [];
      for (const id of ids) { if (list.length >= 10) break; if (cur && id === cur.id) continue;
        try { const { draw, res } = await tourLoad(db, id); if (!draw) continue; const C: any = TR.tourCompute(draw, res, Date.now()); if (!C || !C.places) continue;
          const Pl = draw.players; const top = [1, 2, 3].map((pl) => { const i = C.places.indexOf(pl); return i < 0 ? null : { id: Pl[i].bot ? null : Pl[i].id, name: Pl[i].name, av: Pl[i].av }; });
          const pl: any = {}; Pl.forEach((p: any, i: number) => { if (!p.bot && p.id) pl[p.id] = C.places[i]; });
          list.push({ id, fmt: draw.fmt || 'g', n: Pl.length, reals: Pl.filter((p: any) => !p.bot).length, top, pl }); } catch (_) {} }
      const out = { at: Date.now(), list }; await lgSave(db, 'tour/hist.json', out); return json(out);
    }
    if (body0.action === 'pw_forgot') {
      const nick = String(body0.args?.nick || '').trim().slice(0, 20); if (nick.length < 2) return json({ ok: false, why: 'nick' });
      const u = await userByNick(db, nick); if (!u) return json({ ok: false, why: 'nouser' });
      const { data: pf } = await db.from('profiles').select('ach,name').eq('id', u.id).maybeSingle(); const chat = pf?.ach?.tg, en = pf?.ach?.lang === 'en';
      if (!chat || !tgTok()) return json({ ok: false, why: 'notg' });
      const cdP = 'pwreset/u_' + u.id + '.json', cd = await lgFile(db, cdP); if (cd && Date.now() - cd.at < 90e3) return json({ ok: false, why: 'wait' });
      const tok = rndTok(24); await lgSave(db, 'pwreset/' + tok + '.json', { uid: u.id, exp: Date.now() + 20 * 60e3 }); await lgSave(db, cdP, { at: Date.now() });
      const link = 'https://nardy-nine.vercel.app/#pw-' + tok;
      const r = await tgApi('sendMessage', { chat_id: Number(chat), parse_mode: 'HTML', text: en ? '🔑 <b>New password for ' + (pf?.name || nick) + '</b>\nTap the button to set a new password. The link works for 20 minutes.\nIf it was not you — just ignore this message.' : '🔑 <b>Новий пароль для ' + (pf?.name || nick) + '</b>\nНатисніть кнопку, щоб задати новий пароль. Посилання діє 20 хвилин.\nЯкщо це були не ви — просто ігноруйте це повідомлення.', reply_markup: { inline_keyboard: [[{ text: en ? 'Set a new password' : 'Задати новий пароль', url: link }]] } }).catch(() => null);
      return json(r?.ok ? { ok: true } : { ok: false, why: 'tgfail' }); }
    if (body0.action === 'pw_reset') {
      const tok = String(body0.args?.token || ''), pw = String(body0.args?.pw || ''); if (!/^[a-z0-9]{24}$/.test(tok)) return json({ ok: false, why: 'bad' });
      if (pw.length < 6 || pw.length > 72) return json({ ok: false, why: 'short' });
      const T = await lgFile(db, 'pwreset/' + tok + '.json'); if (!T || T.used || Date.now() > T.exp) return json({ ok: false, why: 'expired' });
      const { data, error } = await db.auth.admin.updateUserById(T.uid, { password: pw }); if (error) return json({ ok: false, why: 'db' });
      await lgSave(db, 'pwreset/' + tok + '.json', { ...T, used: Date.now() });
      return json({ ok: true, email: data?.user?.email || '' }); }
    if (body0.action === 'push_key') return json({ key: (await vapid(db)).pub });
    if (body0.action === 'push_tick') {
      try { const E = TR.tourEvent(Date.now()); if (E && Date.now() >= E.gAt && Date.now() < E.end) await tourTick(db, E); } catch (_) {}
      // 0.61: the evening reminder (19:00 Kyiv, once a day): your streak and the gift waiting — only if the streak is alive and not claimed today
      let remSent = 0; try { const kh = (new Date().getUTCHours() + 2) % 24, day = kyivDay(); if (kh === 19) {
        const dl0 = await db.storage.from('srv').download('rem_sent.json'); let RJ: any = {}; if (dl0.data) { try { RJ = JSON.parse(await dl0.data.text()); } catch (_) {} }
        if (!RJ[day]) { RJ = { [day]: Date.now() }; await db.storage.from('srv').upload('rem_sent.json', new Blob([JSON.stringify(RJ)], { type: 'application/json' }), { upsert: true });
          const { data: R1 } = await db.from('profiles').select('id,ach').not('ach->tg', 'is', null).limit(5000); const { data: R2 } = await db.from('profiles').select('id,ach').not('ach->push', 'is', null).limit(5000);
          const seen0 = new Set(); const RR = [...(R1 || []), ...(R2 || [])].filter((r: any) => !seen0.has(r.id) && seen0.add(r.id));
          for (const r of RR) { const A = r.ach || {}; const D = A.daily || {}; if (A.noRem || D.d === day || D.d !== prevDay(day) || (D.s | 0) < 2) continue;
            const s2 = (D.s % 7) + 1, n = DAILY[s2 - 1], uk = A.lang !== 'en', ru = A.lang === 'ru';
            const ttl = ru ? '🔥 Серия ' + (D.s | 0) + ' дн. — не дайте ей сгореть' : uk ? '🔥 Серія ' + (D.s | 0) + ' дн. — не дайте їй згоріти' : '🔥 ' + (D.s | 0) + '-day streak — keep it alive';
            const body = ru ? 'Подарок дня ждёт: +' + n + ' монет. А в 21:00 — прайм-тайм: монеты ×2 и арена с призами.' : uk ? 'Подарунок дня чекає: +' + n + ' монет. А о 21:00 — прайм-тайм: монети ×2 і арена з призами.' : 'Your daily gift is waiting: +' + n + ' coins. And at 21:00 Kyiv — prime time: coins ×2 and an arena with prizes.';
            if (A.tg) remSent += await tgTell(A.tg, '<b>' + ttl + '</b>\n' + body + (uk ? '\n\n<i>Вимкнути: /stop</i>' : '\n\n<i>Turn off: /stop</i>'), uk ? '🎁 Забрати' : '🎁 Claim', 'gift');
            else if (A.push) remSent += await pushTo(db, [r], { title: ttl, body, tag: 'rem-' + day, url: '/?gift=1' }); } } } } catch (_) {}
      const ev = pushEvents(Date.now()); if (!ev.length) return json({ ok: true, events: 0, rem: remSent });
      let doneJ: any = {}; const dl = await db.storage.from('srv').download('push_sent.json'); if (dl.data) { try { doneJ = JSON.parse(await dl.data.text()); } catch (_) {} }
      const EPOCH = Date.UTC(2026, 10, 7, 16, 0), season = Math.max(0, Math.floor((Date.now() - EPOCH + 3 * 864e5) / (4 * 7 * 864e5)));
      const { data: rowsP } = await db.from('profiles').select('id,ach').not('ach->push', 'is', null).limit(5000);
      const { data: rowsT } = await db.from('profiles').select('id,ach').not('ach->tg', 'is', null).limit(5000);
      const seen = new Set(); const rows = [...(rowsP || []), ...(rowsT || [])].filter((r: any) => !seen.has(r.id) && seen.add(r.id));
      let sent = 0; for (const e of ev) { if (doneJ[e.id]) continue; doneJ[e.id] = Date.now();
        await db.storage.from('srv').upload('push_sent.json', new Blob([JSON.stringify(doneJ)], { type: 'application/json' }), { upsert: true });
        const to = (rows || []).filter((r: any) => e.who === 'all' || (r.ach?.treg && r.ach.treg.s === season));
        for (const r of to) { const L = r.ach?.lang === 'en' ? e.en : e.uk; if (r.ach?.push) sent += await pushTo(db, [r], { title: L[0], body: L[1], tag: e.id, url: '/' + (r.ach?.beta ? 'beta/' : '') + '?tour=1' });
          if (r.ach?.tg && e.who === 'reg') sent += await tgTell(r.ach.tg, '🏆 <b>' + L[0] + '</b>\n' + L[1], r.ach?.lang === 'en' ? 'Open the tournament' : 'Відкрити турнір', 'tour'); } }
      return json({ ok: true, events: ev.length, sent }); }
    if (body0.action === 'cg_login') { const cu = await cgVerify(String(body0.args?.token || '')); if (!cu) return json({ error: 'cg_bad' }, 401);
      const r = await cgSession(db, cu); return r ? json(r) : json({ error: 'cg_link' }, 500); }
    // the signed-in player's CrazyGames id is remembered on the profile (one account per CrazyGames user)
    if (body0.action === 'cg_mark') { /* handled below, after auth */ }
    if (body0.action === 'tg_login' || body0.action === 'tg_widget') {
      const tu = body0.action === 'tg_login' ? await tgVerify(String(body0.args?.initData || '')) : await tgWidgetVerify(body0.args?.data);
      if (!tu || !tu.id) return json({ error: body0.action === 'tg_widget' && !(globalThis as any).Deno?.env.get('TG_BOT_TOKEN') ? 'tg_off' : 'tg_bad' }, 401);
      const r = await tgSession(db, tu); return r ? json(r) : json({ error: 'tg_link' }, 500);
    }
    // the season table and the sign-up list are public: visitors who are not signed in see them too
    const PUBLIC = ['tour_table', 'tour_regs', 'lobbies'].includes(body0.action);
    const { data: { user: user0 }, error: authErr } = PUBLIC && !token.includes('.') ? { data: { user: null }, error: null } : await db.auth.getUser(token);
    const user: any = user0 || (PUBLIC ? { id: '' } : null);
    if (!user) { let cl: any = {}; try { cl = JSON.parse(atob(String(token).split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch (_) {}
      console.log('auth401 ' + JSON.stringify({ a: body0.action, op: body0.args?.op, role: cl.role, anon: cl.is_anonymous, sub: String(cl.sub || '').slice(0, 8), expIn: cl.exp ? Math.round(cl.exp - Date.now() / 1000) : null, err: authErr?.message || null, ua: (req.headers.get('user-agent') || '').slice(0, 60) }));
      return json({ error: 'auth' }, 401); }
    const { action, gameId, args } = body0;
    if (action === 'cg_mark') { const cu = await cgVerify(String(args?.token || '')); if (!cu) return json({ error: 'cg_bad' }, 401); const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle();
      const A = { ...((p && p.ach) || {}) }; if (A.cg !== String(cu.userId)) { A.cg = String(cu.userId); await db.from('profiles').update({ ach: A }).eq('id', user.id); } return json({ ok: true }); }
    // link Telegram to the signed-in (nickname) account, and the one-time Telegram bonus: 500 coins + the Telegram frame
    if (action === 'tg_link') {
      const tu = args?.initData ? await tgVerify(String(args.initData)) : await tgWidgetVerify(args?.data); if (!tu || !tu.id) return json({ error: 'tg_bad' }, 401);
      const { data: other } = await db.from('profiles').select('id').eq('ach->>tg', String(tu.id)).neq('id', user.id).limit(1); if (other && other.length) return json({ error: 'tg_taken' }, 400);
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; A.tg = String(tu.id); await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, tg: A.tg });
    }
    if (action === 'tg_bonus') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const isTg = /^tg-\d+@telegram\.invalid$/.test(user.email || '') || !!A.tg;
      if (!isTg) return json({ error: 'not_tg' }, 400); if (A.tgb) return json({ ok: true, already: true, coins: A.coins ?? COIN_START });
      if (!A.tg && user.email) A.tg = (user.email.match(/^tg-(\d+)@/) || [])[1];
      A.tgb = 1; A.coins = (A.coins ?? COIN_START) + TG_BONUS; A.owned = Array.isArray(A.owned) ? A.owned : []; if (!A.owned.includes(TG_FRAME)) A.owned = [...A.owned, TG_FRAME];
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: TG_BONUS, frame: TG_FRAME, coins: A.coins });
    }
    if (action === 'ice') return json({ ice: await iceServers().catch(() => null) });
    // coins live in profiles.ach.coins (start 1000); the tutorial pays 200 once
    if (action === 'rewards') {
      const op = String(args?.op || 'get'), day = kyivDay();
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const D = A.daily || { d: '', s: 0 };
      // 0.56: a «freeze» — one missed day a week does not break the streak
      const fzOk = !A.dfz || A.dfz <= kyivDay(Date.now() - 7 * 864e5), gap2 = !!D.d && D.d === prevDay(prevDay(day));
      const streakNext = D.d === day ? D.s : (D.d === prevDay(day) || (gap2 && fzOk) ? (D.s % 7) + 1 : 1);
      const fzNow = D.d !== day && D.d !== prevDay(day) && gap2 && fzOk;
      const view = () => { const q = questState(A, day); return { day, coins: A.coins ?? COIN_START, daily: { ready: D.d !== day, day: streakNext, list: DAILY, fz: fzOk ? 1 : 0, fzNow: fzNow ? 1 : 0, max: A.dmax | 0 }, quests: questIds(day).concat([chalId(day)]).map((k) => { const Q = QUESTS.find((x) => x.k === k) || CHALS.find((x) => x.k === k); return { k, ev: Q.ev, n: Q.n, r: Q.r, p: Math.min(Q.n, q.p[Q.ev] || 0), got: q.got.includes(k), ch: Q.ch ? 1 : 0 }; }), week: (() => { const w = wqState(A); return { w: w.w, rr: w.rr === day ? 1 : 0, list: w.ids.map((k: string) => { const Q = WQ.find((x) => x.k === k); return { k, ev: Q.ev, n: Q.n, r: Q.r, p: Math.min(Q.n, w.p[Q.ev] || 0), got: w.got.includes(k) }; }) }; })() }; };
      if (op === 'daily') { if (D.d === day) return json({ ok: true, already: true, ...view() }); const n = DAILY[streakNext - 1]; if (fzNow) A.dfz = day; A.dmax = Math.max(A.dmax | 0, streakNext); A.daily = { d: day, s: streakNext }; A.coins = (A.coins ?? COIN_START) + n; Object.assign(D, A.daily);
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: n, fz: fzNow ? 1 : 0, ...view() }); }
      if (op === 'quest') { const k = String(args?.k || ''); const q = questState(A, day); const Q = QUESTS.find((x) => x.k === k) || CHALS.find((x) => x.k === k);
        if (!Q || !(questIds(day).includes(k) || chalId(day) === k) || q.got.includes(k) || (q.p[Q.ev] || 0) < Q.n) return json({ error: 'not_ready', ...view() }, 400);
        q.got.push(k); A.q = q; A.coins = (A.coins ?? COIN_START) + Q.r; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: Q.r, ...view() }); }
      if (op === 'wquest') { const k = String(args?.k || ''); const w = wqState(A); const Q = WQ.find((x) => x.k === k);
        if (!Q || !w.ids.includes(k) || w.got.includes(k) || (w.p[Q.ev] || 0) < Q.n) return json({ error: 'not_ready', ...view() }, 400);
        w.got.push(k); A.wq = w; A.coins = (A.coins ?? COIN_START) + Q.r; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: Q.r, ...view() }); }
      if (op === 'wrr') { const k = String(args?.k || ''); const w = wqState(A); if (w.rr === day || !w.ids.includes(k) || w.got.includes(k)) return json({ error: 'not_ready', ...view() }, 400);
        const evs = new Set(w.ids.filter((x: string) => x !== k).map((x: string) => WQ.find((q) => q.k === x)?.ev)); const pool = WQ.filter((q) => !w.ids.includes(q.k) && !evs.has(q.ev));
        if (!pool.length) return json({ error: 'no_swap', ...view() }, 400); const nq = pool[Math.floor(Math.random() * pool.length)]; w.ids = w.ids.map((x: string) => x === k ? nq.k : x); w.rr = day; A.wq = w;
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, ...view() }); }
      return json({ ok: true, ...view() });
    }
    // 0.57: level rewards every 5 levels (coins = level × 20), and the title under the nickname (any claimed achievement)
    if (action === 'lvl') { const { data: p } = await db.from('profiles').select('ach,played,won').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const L = lvOf(lvXp(p, A)); const m = Math.round(Number(args?.m)); A.lv = Array.isArray(A.lv) ? A.lv : [];
      if (!(m >= 5 && m <= 50 && m % 5 === 0) || m > L || A.lv.includes(m)) return json({ error: 'not_ready', lv: L, got: A.lv }, 400);
      A.lv.push(m); A.coins = (A.coins ?? COIN_START) + m * 20; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: m * 20, coins: A.coins, lv: L, claimed: A.lv }); }
    // 0.70: reports (kept for the admin, the last 400) and the block list (kept on the profile)
    if (action === 'report') { const to = String(args?.id || ''); if (!/^[0-9a-f-]{36}$/.test(to) || to === user.id) return json({ error: 'bad_args' }, 400);
      const why = ['cheat', 'abuse', 'nick', 'afk', 'other'].includes(args?.why) ? args.why : 'other'; const note = String(args?.note || '').slice(0, 300); const gid = String(args?.gid || '').slice(0, 40);
      const { data: P } = await db.from('profiles').select('id,name').in('id', [to, user.id]); const nm = (id: string) => (P || []).find((r: any) => r.id === id)?.name || '';
      const R: any = (await lgFile(db, 'reports.json')) || { list: [] }; const mine = (R.list || []).filter((r: any) => r.from === user.id && Date.now() - r.at < 864e5).length; if (mine >= 10) return json({ ok: false, why: 'limit' });
      R.list = [...(R.list || []), { at: Date.now(), from: user.id, fromN: nm(user.id), to, toN: nm(to), why, note, gid }].slice(-400); await lgSave(db, 'reports.json', R); return json({ ok: true }); }
    if (action === 'block') { const id = String(args?.id || ''); if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_args' }, 400); const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; let L: string[] = Array.isArray(A.blk) ? A.blk.filter((x: string) => x !== id) : []; if (args?.on) L = [id, ...L].slice(0, 100); A.blk = L; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, n: L.length }); }
    if (action === 'arena') { const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const h = kyivHour(), today = kyivDay(); const day = h >= 21 ? today : prevDay(today); const live = h === 21 && day === today, over = !live;
      const { data: rows } = await db.from('profiles').select('id,name,av,ach->ar').eq('ach->ar->>d', day).limit(1000);
      const L = (rows || []).map((r: any) => ({ id: r.id, n: r.name || '', av: r.av || '', p: r.ar?.p | 0, g: r.ar?.g | 0, w: r.ar?.w | 0 })).filter((r: any) => r.g > 0).sort((a: any, b: any) => b.p - a.p || b.w - a.w || a.g - b.g);
      const meI = L.findIndex((r: any) => r.id === user.id), me = meI >= 0 ? { ...L[meI], rank: meI + 1 } : null;
      const prizeOf = (rank: number, g: number) => (rank >= 1 && rank <= 3 && g >= 1 ? AR_PRIZE[rank - 1] : 0) + (g >= AR_MIN ? AR_PLAY : 0);
      const can = over && me && A.ar && A.ar.d === day && !A.ar.cl ? prizeOf(me.rank, me.g) : 0;
      if (args?.op === 'claim') { if (!can) return json({ ok: false, why: 'none' }); A.ar = { ...A.ar, cl: Date.now() }; A.coins = (A.coins ?? COIN_START) + can; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: can, coins: A.coins }); }
      return json({ ok: true, day, live, n: L.length, top: L.slice(0, 20).map((r: any) => ({ n: r.n, av: r.av, p: r.p, g: r.g, me: r.id === user.id ? 1 : 0 })), me: me ? { p: me.p, g: me.g, rank: me.rank } : null, prize: can, claimed: !!(A.ar && A.ar.d === day && A.ar.cl) }); }
    if (action === 'rem') { const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400); const A = { ...(p.ach || {}) }; if (args?.on) delete A.noRem; else A.noRem = 1; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, on: !A.noRem }); }
    if (action === 'title') { const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const k = String(args?.k || ''); if (k && !(A.ach2 && A.ach2[k])) return json({ error: 'locked' }, 400);
      if (k) A.tt = k; else delete A.tt; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, tt: A.tt || '' }); }
    // the campaign: a won chapter game gives its prizes once and opens the next chapter
    // the campaign puzzle (step 1) of the current chapter, solved on the site
    if (action === 'campstep') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const done = A.camp | 0, n = Math.round(Number(args?.n));
      if (n !== done + 1 || n > CAMP.length - 1) return json({ ok: true, already: true, camp: done, cs: A.cs | 0, coins: A.coins ?? COIN_START });
      if ((A.cs | 0) >= 1) return json({ ok: true, already: true, camp: done, cs: A.cs | 0, coins: A.coins ?? COIN_START });
      A.cs = 1; A.coins = (A.coins ?? COIN_START) + CAMP_STEP_COINS[1]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
      return json({ ok: true, camp: done, cs: 1, coins: A.coins, gotCoins: CAMP_STEP_COINS[1] });
    }
    if (action === 'camp') {
      const gid = String(args?.gid || ''); if (!/^[a-z0-9]{4,16}$/.test(gid)) return json({ error: 'bad_game' }, 400);
      const { data: g } = await db.from('games').select('p1,state').eq('id', gid).maybeSingle(); const st = g?.state;
      if (!st || g.p1 !== user.id || !st.camp || st.phase !== 'over' || st.result?.winner !== 'p1') return json({ error: 'not_won' }, 400);
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; A.owned = Array.isArray(A.owned) ? A.owned : []; const done = A.camp | 0, n = st.camp | 0, CH = CAMP[n];
      if (!CH || n > done + 1) return json({ error: 'camp_locked' }, 400);
      if (st.campStep === 2) {   // a minor opponent beaten: step 2 of the current chapter
        if (n !== done + 1 || (A.cs | 0) >= 2) return json({ ok: true, already: true, step: 2, camp: done, cs: A.cs | 0, coins: A.coins ?? COIN_START, owned: A.owned });
        A.cs = 2; A.coins = (A.coins ?? COIN_START) + CAMP_STEP_COINS[2]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, step: 2, camp: done, cs: 2, coins: A.coins, owned: A.owned, gotCoins: CAMP_STEP_COINS[2] });
      }
      if (n <= done) return json({ ok: true, already: true, camp: done, coins: A.coins ?? COIN_START, owned: A.owned });
      const got = CH.items.filter((id: string) => !A.owned.includes(id)); A.owned = [...A.owned, ...got]; A.coins = (A.coins ?? COIN_START) + CH.coins; A.camp = n; A.cs = 0;
      await db.from('profiles').update({ ach: A }).eq('id', user.id);
      return json({ ok: true, camp: n, cs: 0, coins: A.coins, owned: A.owned, got, gotCoins: CH.coins });
    }
    // open lobbies: games with custom rules that wait for a second player
    if (action === 'lobbies') {
      const since = new Date(Date.now() - 30 * 60e3).toISOString();
      const { data } = await db.from('games').select('id,p1,state,updated_at').is('p2', null).eq('state->rules->>open', 'true').eq('state->>phase', 'opening').gte('updated_at', since).order('updated_at', { ascending: false }).limit(30);
      return json({ rows: (data || []).filter((g: any) => !g.state?.p2).map((g: any) => ({ id: g.id, mine: g.p1 === user.id, name: g.state?.names?.p1 || '', av: g.state?.avs?.p1 || '', rating: g.state?.ratings?.p1 || 1000, rules: g.state.rules, at: g.updated_at })) });
    }
    if (action === 'shop') {
      const op = String(args?.op || '');
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; A.owned = Array.isArray(A.owned) ? A.owned : [];
      if (op === 'migrate') {
        if (A.mig15) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned, gift: 0 });
        const old = new Date(user.created_at).getTime() < SHOP_OPEN; A.mig15 = Date.now(); let gift = 0;
        if (old) { gift = 3000; A.coins = (A.coins ?? COIN_START) + gift; A.founder = 1; }
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned, gift });
      }
      if (op === 'buy') {
        const id = String(args?.id || ''), price = shopCost(id); if (!price) return json({ error: 'not_for_sale' }, 400);
        if (A.owned.includes(id)) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned });
        const coins = A.coins ?? COIN_START; if (coins < price) return json({ error: 'no_coins', coins }, 400);
        A.coins = coins - price; A.owned = [...A.owned, id]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, coins: A.coins, owned: A.owned, price });
      }
      if (op === 'case') {
        const ck = String(args?.id || ''), C = CASES[ck]; if (!C) return json({ error: 'not_for_sale' }, 400);
        const coins = A.coins ?? COIN_START; if (coins < C.price) return json({ error: 'no_coins', coins }, 400);
        const P = { ...(A.cpity || {}) }; const pity = (P[ck] | 0) + 1; const tiers = ['c', 'r', 'e', 'l'].filter((r) => C.items.some((i: string) => rarOf(i) === r));
        const R = (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296);
        let pool = pity >= 10 ? tiers.filter((r) => r === 'e' || r === 'l') : tiers; if (!pool.length) pool = tiers;
        const tot = pool.reduce((a, r) => a + CASE_ODDS[r], 0); let x = R * tot, rar = pool[pool.length - 1]; for (const r of pool) { if (x < CASE_ODDS[r]) { rar = r; break; } x -= CASE_ODDS[r]; }
        const ofR = C.items.filter((i: string) => rarOf(i) === rar), fresh = ofR.filter((i: string) => !A.owned.includes(i));
        const R2 = crypto.getRandomValues(new Uint32Array(1))[0]; const got = (fresh.length ? fresh : ofR)[R2 % (fresh.length || ofR.length)]; const dup = !fresh.length;
        A.coins = coins - C.price + (dup ? CASE_REFUND[rar] : 0); if (!dup) A.owned = [...A.owned, got];
        P[ck] = rar === 'e' || rar === 'l' ? 0 : pity; A.cpity = P; A.cases = (A.cases | 0) + 1;
        await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, got, rar, dup, refund: dup ? CASE_REFUND[rar] : 0, coins: A.coins, owned: A.owned, pity: P[ck] });
      }
      if (op === 'bundle') {
        const b = String(args?.id || ''); if (!BUNDLES[b]) return json({ error: 'not_for_sale' }, 400);
        const { miss, price } = bundleCost(b, A.owned); if (!miss.length) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned });
        const coins = A.coins ?? COIN_START; if (coins < price) return json({ error: 'no_coins', coins }, 400);
        A.coins = coins - price; A.owned = [...A.owned, ...miss]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, coins: A.coins, owned: A.owned, price, got: miss });
      }
      if (op === 'phpack') {
        const b = String(args?.id || ''); if (!PH_PACKS[b]) return json({ error: 'not_for_sale' }, 400);
        const { miss, price } = phPackCost(b, A.owned); if (!miss.length) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned });
        const coins = A.coins ?? COIN_START; if (coins < price) return json({ error: 'no_coins', coins }, 400);
        A.coins = coins - price; A.owned = [...A.owned, ...miss]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, coins: A.coins, owned: A.owned, price, got: miss });
      }
      if (op === 'pack') {
        const b = String(args?.id || ''); if (!PT_PACKS[b]) return json({ error: 'not_for_sale' }, 400);
        const { miss, price } = packCost(b, A.owned); if (!miss.length) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned });
        const coins = A.coins ?? COIN_START; if (coins < price) return json({ error: 'no_coins', coins }, 400);
        A.coins = coins - price; A.owned = [...A.owned, ...miss]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, coins: A.coins, owned: A.owned, price, got: miss });
      }
      return json({ error: 'bad_op' }, 400);
    }
    // 0.54: one client in the lobby reports how many people are online right now (the max per 5-minute slot is kept)
    if (action === 'onl') { const n = Math.max(0, Math.min(5000, Math.round(Number(args?.n) || 0))); if (!n) return json({ ok: true });
      const b = new Date(Math.floor(Date.now() / 3e5) * 3e5).toISOString(); const { data: ex } = await db.from('online_log').select('n').eq('b', b).maybeSingle();
      if (!ex || (ex.n | 0) < n) await db.from('online_log').upsert({ b, n }); return json({ ok: true }); }
    // a player opened the site today (once a day from the client)
    if (action === 'seen') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ ok: false });
      const A = { ...(p.ach || {}) }; const day = kyivDay();
      // where the player plays from: tg = Telegram Mini App, app = the site installed as an app, web = browser
      const plat = ['tg', 'app', 'web'].includes(args?.plat) ? args.plat : 'web', pf = plat + 'd';
      if (!(A.days || []).includes(day) || !(A[pf] || []).includes(day) || A.plat !== plat) { markDay(A, 'days', day); markDay(A, pf, day); A.plat = plat; await db.from('profiles').update({ ach: A }).eq('id', user.id); }
      return json({ ok: true, admin: isAdminUser(user), tester: !!A.tester });
    }
    if (action === 'test') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); const A = { ...(p?.ach || {}) };
      if (!A.tester && !isAdminUser(user)) return json({ error: 'forbidden' }, 403);
      if (String(args?.op) === 'camp_set') { A.camp = Math.max(0, Math.min(CAMP.length - 1, Math.round(Number(args?.camp) || 0))); A.cs = Math.max(0, Math.min(2, Math.round(Number(args?.cs) || 0))); if (A.camp >= CAMP.length - 1) A.cs = 0;
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, camp: A.camp, cs: A.cs }); }
      return json({ error: 'bad_op' }, 400);
    }
    if (action === 'admin') {
      if (!isAdminUser(user)) return json({ error: 'forbidden' }, 403);
      const op = String(args?.op || '');
      if (op === 'me') return json({ ok: true });
      if (op === 'reports') { const R: any = (await lgFile(db, 'reports.json')) || { list: [] }; return json({ ok: true, list: (R.list || []).slice(-200) }); }
      // 0.33.2: the tester role — set by the admin; testers get the test mode (all skins on their device, campaign progress) and a badge
      if (op === 'tester') { const id = String(args?.id || ''); if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_args' }, 400); const { data: p } = await db.from('profiles').select('ach,name').eq('id', id).maybeSingle(); if (!p) return json({ ok: false });
        const A = { ...(p.ach || {}) }; if (args?.on) A.tester = true; else delete A.tester; await db.from('profiles').update({ ach: A }).eq('id', id);
        if (id !== user.id) { const { data: me } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); const M = { ...(me?.ach || {}) }; M.alog = [...(M.alog || []), { at: Date.now(), to: id, name: p.name, n: 0, note: args?.on ? 'tester +' : 'tester −' }].slice(-200); await db.from('profiles').update({ ach: M }).eq('id', user.id); }
        return json({ ok: true, tester: !!A.tester }); }
      // 0.33.1: the admin sets their own campaign progress (to test the chapters and the story)
      if (op === 'camp_set') { const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); const A = { ...(p?.ach || {}) };
        A.camp = Math.max(0, Math.min(CAMP.length - 1, Math.round(Number(args?.camp) || 0))); A.cs = Math.max(0, Math.min(2, Math.round(Number(args?.cs) || 0))); if (A.camp >= CAMP.length - 1) A.cs = 0;
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, camp: A.camp, cs: A.cs }); }
      if (op === 'stats') {
        const users: any[] = []; for (let page = 1; page <= 20; page++) { const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 }); const L = data?.users || []; users.push(...L); if (L.length < 1000) break; }
        const { data: profs } = await db.from('profiles').select('id,name,av,rating,rgames,played,won,ach').limit(20000);
        const P = new Map((profs || []).map((r: any) => [r.id, r]));
        const today = kyivDay(), days: string[] = []; for (let i = 29; i >= 0; i--) days.push(kyivDay(Date.now() - i * 864e5));
        const per: any = {}; days.forEach((d) => per[d] = { d, newReg: 0, newGuest: 0, actReg: 0, actGuest: 0, hum: 0, bot: 0, tg: 0, web: 0, app: 0, newTg: 0 });
        const reg = users.filter((u) => !u.is_anonymous), guests = users.filter((u) => u.is_anonymous);
        const isTgMail = (u: any) => /^tg-\d+@telegram\.invalid$/.test(u.email || '');
        users.forEach((u) => { const d = kyivDay(new Date(u.created_at).getTime()); if (per[d]) { per[d][u.is_anonymous ? 'newGuest' : 'newReg']++; if (isTgMail(u)) per[d].newTg++; } });
        const tgIds = new Set(users.filter(isTgMail).map((u) => u.id)), tgReg = tgIds.size; let tgLinked = 0; const wk = days.slice(-7); const pl7: any = { tg: new Set(), web: new Set(), app: new Set() };
        let coins = 0, tut = 0, treg = 0, refBy = 0, calib = 0, played = 0; const rich: any[] = []; let casesN = 0, itemsN = 0; const cb = [0, 0, 0, 0];
        const anon = new Set(guests.map((u) => u.id));
        (profs || []).forEach((r: any) => { const A = r.ach || {}; const g = anon.has(r.id);
          (A.days || []).forEach((d: string) => { if (per[d]) per[d][g ? 'actGuest' : 'actReg']++; });
          (A.gd || []).forEach((e: any) => { if (per[e.d]) { per[e.d].hum += e.h || 0; per[e.d].bot += e.b || 0; } });
          for (const k of ['tg', 'web', 'app']) (A[k + 'd'] || []).forEach((d: string) => { if (per[d]) per[d][k]++; if (wk.includes(d)) pl7[k].add(r.id); });
          if (A.tg && !g && !tgIds.has(r.id)) tgLinked++;
          if (!g) { { const cc = A.coins ?? COIN_START; cb[cc < 500 ? 0 : cc < 2000 ? 1 : cc < 5000 ? 2 : 3]++; casesN += A.cases | 0; itemsN += Array.isArray(A.owned) ? A.owned.length : 0; } coins += A.coins ?? COIN_START; if (A.tut) tut++; if (A.treg) treg++; if (A.refBy) refBy++; if ((r.rgames || 0) >= 10) calib++; played += r.played || 0; rich.push({ name: r.name, coins: A.coins ?? COIN_START }); } });
        Object.values(per).forEach((x: any) => { x.hum = Math.round(x.hum / 2); });
        // retention of registered players: came back the next day / within 7 days
        let c1 = 0, r1 = 0, c7 = 0, r7 = 0; reg.forEach((u) => { const t0 = new Date(u.created_at).getTime(), d0 = kyivDay(t0), A = (P.get(u.id) as any)?.ach || {}, L: string[] = A.days || [];
          if (Date.now() - t0 > 2 * 864e5) { c1++; if (L.includes(kyivDay(t0 + 864e5))) r1++; }
          if (Date.now() - t0 > 8 * 864e5) { c7++; if (L.some((d) => d > d0 && d <= kyivDay(t0 + 7 * 864e5))) r7++; } });
        const sum = (k: string, n: number) => days.slice(-n).reduce((a, d) => a + per[d][k], 0);
        // 0.50: where new players (last 30 days, guests included) came from, and how far they got
        const SRC: any = {}; const t30 = Date.now() - 30 * 864e5;
        users.forEach((u) => { const t0 = new Date(u.created_at).getTime(); if (t0 < t30) return; const r: any = P.get(u.id) || {}; const A = r.ach || {};
          const k = A.src?.s || (isTgMail(u) ? 'telegram' : '?'); const x = SRC[k] || (SRC[k] = { s: k, n: 0, reg: 0, play: 0, c1: 0, r1: 0, c7: 0, r7: 0 });
          x.n++; if (!u.is_anonymous) x.reg++; if ((r.played || 0) > 0 || (A.gd || []).length) x.play++;
          const L: string[] = A.days || [], d0 = kyivDay(t0);
          if (Date.now() - t0 > 2 * 864e5) { x.c1++; if (L.includes(kyivDay(t0 + 864e5))) x.r1++; }
          if (Date.now() - t0 > 8 * 864e5) { x.c7++; if (L.some((d) => d > d0 && d <= kyivDay(t0 + 7 * 864e5))) x.r7++; } });
        const srcList = Object.values(SRC).sort((a: any, b: any) => b.n - a.n).slice(0, 25);
        // 0.54: the real online — peak per day (7 days) and per hour today, from online_log
        const { data: OL } = await db.from('online_log').select('b,n').gte('b', new Date(Date.now() - 8 * 864e5).toISOString()).order('b').limit(3000);
        const onl: any = {}; const hrs = Array(24).fill(0);
        (OL || []).forEach((r: any) => { const t = new Date(r.b).getTime(), d = kyivDay(t); const o = onl[d] || (onl[d] = { d, peak: 0, at: 0 }); if ((r.n | 0) > o.peak) { o.peak = r.n | 0; o.at = t; }
          if (d === today) { const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', hourCycle: 'h23' }).format(new Date(t))) % 24; hrs[h] = Math.max(hrs[h], r.n | 0); } });
        const online = { days: days.slice(-7).map((d) => onl[d] || { d, peak: 0, at: 0 }), hours: hrs };
        return json({ ok: true, today, days: days.map((d) => per[d]),
          totals: { reg: reg.length, guests: guests.length, coins, tut, treg, refBy, calib, played },
          last: { d1: { newReg: per[today].newReg, act: per[today].actReg, hum: per[today].hum, bot: per[today].bot },
                  d7: { newReg: sum('newReg', 7), hum: sum('hum', 7), bot: sum('bot', 7) }, d30: { newReg: sum('newReg', 30), hum: sum('hum', 30), bot: sum('bot', 30) } },
          plat: { tgReg, tgLinked, today: { tg: per[today].tg, web: per[today].web, app: per[today].app }, d7: { tg: pl7.tg.size, web: pl7.web.size, app: pl7.app.size }, newTg7: sum('newTg', 7) },
          ret: { d1: c1 ? Math.round(r1 / c1 * 100) : null, d1n: c1, d7: c7 ? Math.round(r7 / c7 * 100) : null, d7n: c7 },
          rich: rich.sort((a, b) => b.coins - a.coins).slice(0, 5), src: srcList, online, econ: { cases: casesN, items: itemsN, buckets: cb } });
      }
      if (op === 'find') {
        const q = String(args?.q || '').trim().slice(0, 24); if (q.length < 2) return json({ rows: [] });
        const { data } = await db.from('profiles').select('id,name,av,rating,rgames,played,won,ach').ilike('name', '%' + q.replace(/[%_]/g, '') + '%').limit(20);
        return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, rgames: r.rgames, played: r.played, won: r.won, coins: r.ach?.coins ?? COIN_START, last: (r.ach?.days || []).slice(-1)[0] || null, plat: r.ach?.plat || null, tg: !!r.ach?.tg, treg: r.ach?.treg || null, refN: r.ach?.refN || 0, tester: !!r.ach?.tester })) });
      }
      if (op === 'pw_admin') { const u = await userByNick(db, String(args?.nick || '').trim()); if (!u) return json({ ok: false, why: 'nouser' });
        const pw = rndTok(10); const { error } = await db.auth.admin.updateUserById(u.id, { password: pw }); if (error) return json({ ok: false, why: 'db' });
        const { data: pf } = await db.from('profiles').select('name').eq('id', u.id).maybeSingle(); return json({ ok: true, pw, name: pf?.name || '' }); }
      if (op === 'tg_setup') { if (!tgTok()) return json({ error: 'no_token' }); return json({ ok: true, ...(await tgSetup(url + '/functions/v1/game')) }); }
      if (op === 'coins') {
        const id = String(args?.id || ''), n = Math.round(Number(args?.n) || 0), note = String(args?.note || '').slice(0, 80);
        if (!/^[0-9a-f-]{36}$/.test(id) || !n || Math.abs(n) > 100000) return json({ error: 'bad_args' }, 400);
        const [{ data: p }, { data: me }] = await Promise.all([db.from('profiles').select('name,ach').eq('id', id).maybeSingle(), db.from('profiles').select('ach').eq('id', user.id).maybeSingle()]);
        if (!p) return json({ error: 'no_profile' }, 400);
        const A = { ...(p.ach || {}) }; A.coins = Math.max(0, (A.coins ?? COIN_START) + n); await db.from('profiles').update({ ach: A }).eq('id', id);
        const M = { ...(me?.ach || {}) }; M.alog = [...(M.alog || []), { at: Date.now(), to: id, name: p.name, n, note }].slice(-200); await db.from('profiles').update({ ach: M }).eq('id', user.id);
        return json({ ok: true, coins: A.coins });
      }
      if (op === 'log') { const { data: me } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); return json({ rows: (me?.ach?.alog || []).slice().reverse() }); }
      return json({ error: 'bad_op' }, 400);
    }
    // «Вечори в кальянній» (the story course) and Pasha's tour: rewards once, chapters in order (chapter 1 = the first lesson, ach.tut)
    // the daily puzzle: one prize per Kyiv day (best move 60, a good one 20), and the streak of solved days
    // the profile showcase (0.32.0): up to 3 things you own (or a campaign badge), shown to everyone on your profile
    if (action === 'show') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const own = Array.isArray(A.owned) ? A.owned : []; const L = Array.isArray(args?.items) ? args.items.slice(0, 3).map(String) : [];
      const ok = (id: string) => /^[a-z]+:[a-z0-9_-]{1,24}$/i.test(id) && (own.includes(id) || (id === 'badge:camp' && (A.camp | 0) >= 9) || (id === 'badge:tester' && !!A.tester) || (id.startsWith('card:cp') && (A.camp | 0) >= Number(id.slice(7))));
      A.show = L.filter(ok); await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, show: A.show });
    }
    if (action === 'src') {   // 0.50: where the player came from — set once, never overwritten
      const sv = String(args?.s || '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32) || 'direct';
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; if (A.src) return json({ ok: true, src: A.src });
      const at = Number(args?.at) > 0 ? Math.min(Number(args.at), Date.now()) : Date.now(); A.src = { s: sv, at };
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, src: A.src }); }
    if (action === 'g200') {   // 0.55: a one-time gift for having an account (progress saved) — registered players only
      if ((user as any).is_anonymous) return json({ ok: false, why: 'guest' });
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; if (A.g200) return json({ ok: true, already: true, coins: A.coins ?? COIN_START });
      A.g200 = Date.now(); A.coins = (A.coins ?? COIN_START) + 200; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: 200, coins: A.coins }); }
    if (action === 'ach') {   // 0.48: claim an achievement's reward, or set one of the two flags the site reports
      const op = String(args?.op || ''), k = String(args?.k || '');
      const { data: p } = await db.from('profiles').select('ach,rating,rgames').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; A.owned = Array.isArray(A.owned) ? A.owned : []; const G = { ...(A.ach2 || {}) };
      if (op === 'flag') { if (!['chat', 'replay'].includes(k)) return json({ error: 'bad_flag' }, 400); const F = { ...(A.fl || {}) }; if (!F[k]) { F[k] = Date.now(); A.fl = F; await db.from('profiles').update({ ach: A }).eq('id', user.id); } return json({ ok: true, fl: A.fl }); }
      if (op === 'claim') { const D = ACH2[k]; if (!D) return json({ error: 'bad_ach' }, 400); if (G[k]) return json({ ok: true, already: true, ach2: G, coins: A.coins ?? COIN_START, owned: A.owned });
        if (!D[1](p, A)) return json({ ok: false, why: 'not_done' });
        const R = D[0]; let got = 0; if (R.coins) { got = R.coins; A.coins = (A.coins ?? COIN_START) + got; } if (R.item && !A.owned.includes(R.item)) A.owned = [...A.owned, R.item];
        G[k] = Date.now(); A.ach2 = G; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, got, item: R.item || null, ach2: G, coins: A.coins ?? COIN_START, owned: A.owned }); }
      return json({ error: 'bad_op' }, 400); }
    if (action === 'puzzle') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const P = { ...(A.pz || {}) }; const today = kyivDay(), y = kyivDay(Date.now() - 864e5);
      const res = ['best', 'good', 'miss'].includes(args?.res) ? args.res : 'miss';
      if (P.day === today) return json({ ok: true, got: 0, pz: P, coins: A.coins ?? COIN_START });
      P.streak = res === 'miss' ? 0 : (P.last === y ? (P.streak || 0) + 1 : 1); if (res !== 'miss') P.last = today; P.day = today; P.res = res; if (res !== 'miss') { P.n = (P.n | 0) + 1; P.best = Math.max(P.best | 0, P.streak | 0); }
      const got = res === 'best' ? 60 : res === 'good' ? 20 : 0; A.pz = P; A.coins = (A.coins ?? COIN_START) + got;
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got, pz: P, coins: A.coins });
    }
    if (action === 'frame') {   // the rank frame to show: 0 = always the current rank, 1…8 = a rank reached once (by the best rating)
      const { data: p } = await db.from('profiles').select('ach,rating,rgames').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const best = Math.max(A.peak || 0, (p.rgames ?? 0) >= 10 ? (p.rating ?? 1000) : 0); const tf = Math.round(Number(args?.t) || 0);
      if (tf < 0 || tf > 8 || (tf > 0 && tf - 1 > rankTier(best))) return json({ ok: false, why: 'locked' });
      if (best > (A.peak || 0)) A.peak = best; if (tf) A.fr = tf; else delete A.fr;
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, fr: A.fr || 0, peak: A.peak || 0 }); }
    if (action === 'course') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const done = Math.max(A.stc || 0, A.tut ? 1 : 0);
      if (args?.op === 'guide') { if (A.guide) return json({ ok: true, got: 0, coins: A.coins ?? COIN_START });
        A.guide = 1; A.coins = (A.coins ?? COIN_START) + 100; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: 100, coins: A.coins }); }
      const RW: any = { 1: { item: 'frame:uchen' }, 2: { item: 'dice:hookah' }, 3: { coins: 300 }, 4: { item: 'ck:coal' }, 5: { coins: 500, item: 'table:lounge' } };
      const n = Math.round(Number(args?.n)); if (!RW[n]) return json({ error: 'bad_chapter' }, 400);
      if (done > n) return json({ ok: true, got: 0, stc: done, coins: A.coins ?? COIN_START, owned: A.owned || [] });
      if (done < n) return json({ error: 'locked' }, 400);
      const rw = RW[n]; A.stc = n + 1; A.owned = Array.isArray(A.owned) ? A.owned : [];
      if (rw.item && !A.owned.includes(rw.item)) A.owned = [...A.owned, rw.item]; if (rw.coins) A.coins = (A.coins ?? COIN_START) + rw.coins;
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: 1, stc: A.stc, coins: A.coins ?? COIN_START, owned: A.owned });
    }
    if (action === 'tut_reward') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; if (A.tut) return json({ coins: A.coins ?? COIN_START, already: true });
      A.tut = 1; A.coins = (A.coins ?? COIN_START) + 200; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ coins: A.coins });
    }
    // invite a friend: a new registered player who came by a friend's link gets 300 coins and the Druzi checkers;
    // the friend gets 200 coins (for up to 50 friends) and counts towards the Friends board (1 / 3 / 5 / 10)
    // weekend tournament (played against grandmaster bots in the browser): coins for the place and tournament points,
    // at most once every 6 days per account; points = 10 for taking part + 5 per game won (max 15) + a bonus for the place
    // tournament table: everyone who has taken a tournament prize, with their recent tournament results (no coins or other profile data)
    if (action === 'tour_report') {
      const E = TR.tourEvent(Date.now()); if (!E) return json({ error: 'no_event' }, 400);
      const { draw, res } = await tourLoad(db, E.id); if (!draw) return json({ error: 'no_draw' }, 400);
      const C = TR.tourCompute(draw, res, Date.now()); const m = [...C.gm, ...C.po].find((x: any) => x.id === String(args?.mid || ''));
      if (!m || m.a == null || m.b == null) return json({ error: 'bad_match' }, 400);
      const cs = draw.fmt === 'cs', key = cs ? TR.gameKey(m.id, Number(args?.n) || (m.cur ? m.cur.n : 1)) : m.id;
      if (res[key]) return json({ ok: true, already: true, r: res[key] });
      if (cs && (!m.cur || m.cur.key !== key)) return json({ error: 'closed' }, 400);
      const meA = draw.players[m.a].id === user.id, meB = draw.players[m.b].id === user.id; if (!meA && !meB) return json({ error: 'not_yours' }, 403);
      if (!(meA ? draw.players[m.b].bot : draw.players[m.a].bot)) return json({ error: 'online_match' }, 400);
      const now = Date.now(); if (now < (cs ? m.cur.av : m.av) - 60e3 || now > m.hard + TR.GRACE) return json({ error: 'closed' }, 400);
      const won = !!args?.won; const r = { w: (won === meA) ? 'a' : 'b', mars: !!args?.mars, at: now, how: 'play' };
      await tourWrite(db, E.id, key, r);
      // tournament game against a tournament bot: 50–150 coins whatever the result
      const gc = gameCoins(won, true, !!args?.mars, true); const { data: pc } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle();
      if (pc) { const A = { ...(pc.ach || {}) }; A.coins = (A.coins ?? COIN_START) + gc.coins; await db.from('profiles').update({ ach: A }).eq('id', user.id); }
      return json({ ok: true, r, coins: gc.coins, lucky: gc.lucky, total: pc ? (pc.ach?.coins ?? COIN_START) + gc.coins : null });
    }
    if (action === 'tour_table') {
      const { data } = await db.from('profiles').select('id,name,av,rating,played,won,ach').not('ach->tourAt', 'is', null).limit(1000);
      let F = (await lgFile(db, 'tour/botpts.json')) || { evs: [], p: {} };
      { const E = TR.tourEvent(Date.now()); if (E && Date.now() > E.pAt && !F.evs.includes(E.id)) { const { draw, res, names } = await tourLoad(db, E.id); if (draw && names.includes('paid')) { const C = TR.tourCompute(draw, res, Date.now()); if (C.done) F = await botPtsAdd(db, E.id, draw, C, res); } } }   // the event paid before this existed
      const bots = Object.entries(F.p || {}).map(([id, tp]: any) => ({ id, bot: 1, rating: TR.botRating ? TR.botRating(id) : 0, tp }));
      return json({ rows: [...(data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, played: r.played, won: r.won, fr: r.ach?.fr || 0, tp: (r.ach?.tp || []).slice(-30) })), ...bots] });
    }
    if (action === 'tour_done') {
      return json({ error: 'moved' }, 400);
      const pl = Math.round(Number(args?.place)), wins = Math.max(0, Math.min(15, Math.round(Number(args?.wins) || 0)));
      if (!(pl >= 1 && pl <= 16)) return json({ error: 'bad_place' }, 400);
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; if (A.tourAt && Date.now() - A.tourAt < 6 * 864e5) return json({ already: true, coins: A.coins ?? COIN_START, next: A.tourAt + 6 * 864e5 });
      const prize = pl === 1 ? 4000 : pl === 2 ? 2500 : pl === 3 ? 1500 : pl === 4 ? 1000 : pl <= 8 ? 250 : 0;
      const bonus = pl === 1 ? 100 : pl === 2 ? 60 : pl <= 4 ? 40 : pl <= 8 ? 20 : 0, pts = 10 + wins * 5 + bonus;
      A.tourAt = Date.now(); A.coins = (A.coins ?? COIN_START) + prize; A.tp = [...(A.tp || []), { at: A.tourAt, pl, pts }].slice(-30);
      await db.from('profiles').update({ ach: A }).eq('id', user.id);
      return json({ ok: true, coins: A.coins, prize, pts, tp: A.tp });
    }
    // sign up for the weekend tournaments of this season: first name, nickname, last name — fixed until the season ends
    if (action === 'push_sub') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; let L = Array.isArray(A.push) ? A.push : []; const sub = args?.sub;
      if (sub && sub.endpoint) L = L.filter((x: any) => x.endpoint !== sub.endpoint);
      if (args?.on && sub && sub.endpoint && sub.keys?.p256dh && sub.keys?.auth) L = [...L, { endpoint: String(sub.endpoint).slice(0, 600), keys: { p256dh: String(sub.keys.p256dh).slice(0, 200), auth: String(sub.keys.auth).slice(0, 60) } }].slice(-4);
      A.push = L.length ? L : null; if (args?.lang) A.lang = args.lang === 'en' ? 'en' : args.lang === 'ru' ? 'ru' : 'uk'; if (args?.beta != null) A.beta = !!args.beta;
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, n: L.length });
    }
    // friends: a list in ach.friends (one-way, like a contact list); "call to a game" sends a push and a Telegram message
    // nicknames are unique for new names: is this one free (case-insensitive)? If not, suggest a free variant
    if (action === 'league' && !LG_ON) return json({ off: true });
    if (action === 'league') {
      const { data: p } = await db.from('profiles').select('name,av,ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; A.__id = user.id; const settled = await lgSettle(db, A); delete A.__id;
      if (settled) await db.from('profiles').update({ ach: A }).eq('id', user.id);
      const wk = lgWeek(), L = A.lg && A.lg.w === wk ? A.lg : null, tier = L ? +L.g.split('-')[0] : (A.lgTier || 0);
      let rows: any[] = []; if (L) { const F = await lgFile(db, 'league/' + wk + '/' + L.g + '.json'); rows = lgTable(wk, L.g, F, Date.now()).map((r: any) => ({ ...r, me: r.id === user.id })); }
      return json({ wk, tier, ends: lgEnd(wk), joined: !!L, rows, last: A.lgLast && A.lgLast.w === wk - 1 ? A.lgLast : null, prize: LG_PRIZE, n: LG_N, up: 5, down: 5 });
    }
    if (action === 'name_ok') {
      const nm = String(args?.name || '').trim().slice(0, 16); if (nm.length < 2) return json({ ok: false, suggest: null });
      const taken = async (x: string) => { const { data } = await db.from('profiles').select('id').ilike('name', x.replace(/[%_\\]/g, (c) => '\\' + c)).neq('id', user.id).limit(1); return !!(data && data.length); };
      if (!(await taken(nm))) return json({ ok: true });
      const base = nm.slice(0, 13).replace(/[ _.-]+$/, ''); for (let i = 0; i < 12; i++) { const c = base + '_' + (i < 4 ? 2 + i : Math.floor(10 + Math.random() * 89)); if (!(await taken(c))) return json({ ok: false, suggest: c }); }
      return json({ ok: false, suggest: null });
    }
    if (action === 'nudge') {
      const gid = String(gameId || '').toLowerCase(); const { data: g } = await db.from('games').select('state').eq('id', gid).maybeSingle(); const st = g?.state;
      if (!st || st.phase !== 'play') return json({ ok: true, sent: 0 }); const meSlot = st.p1 === user.id ? 'p1' : st.p2 === user.id ? 'p2' : null; if (!meSlot) return json({ error: 'not_yours' }, 403);
      const other = meSlot === 'p1' ? st.p2 : st.p1;
      const oppTurn = st[st.turn === 'w' ? (st.white === st.p1 ? 'p1' : 'p2') : (st.white === st.p1 ? 'p2' : 'p1')] === other;
      if (!other || String(other).startsWith('bot') || !oppTurn) return json({ ok: true, sent: 0 });
      const { data: o } = await db.from('profiles').select('id,ach').eq('id', other).maybeSingle(); if (!o) return json({ ok: true, sent: 0 });
      const A = { ...(o.ach || {}) }; const N = { ...(A.nudge || {}) }; if (Date.now() - (N[gid] || 0) < 10 * 60e3) return json({ ok: true, sent: 0 });
      N[gid] = Date.now(); for (const k of Object.keys(N)) if (Date.now() - N[k] > 864e5) delete N[k]; A.nudge = N; await db.from('profiles').update({ ach: A }).eq('id', other);
      const { data: me } = await db.from('profiles').select('name').eq('id', user.id).maybeSingle(); const nm = String(me?.name || '').slice(0, 20); const en = A.lang === 'en';
      let sent = 0; if (A.tg) sent += await tgTell(A.tg, en ? `🎲 Your turn! <b>${nm || 'Your opponent'}</b> is waiting for your move.` : `🎲 Ваш хід! <b>${nm || 'Суперник'}</b> чекає на ваш хід.`, en ? 'Play' : 'Грати', 'g-' + gid);
      if (A.push) sent += await pushTo(db, [o], { title: en ? 'Your turn' : 'Ваш хід', body: en ? (nm || 'Your opponent') + ' is waiting for your move.' : (nm || 'Суперник') + ' чекає на ваш хід.', tag: 'turn-' + gid, url: '/' + (A.beta ? 'beta/' : '') + '#g-' + gid });
      return json({ ok: true, sent });
    }
    if (action === 'friends') {
      const { data: me } = await db.from('profiles').select('id,name,ach').eq('id', user.id).maybeSingle(); if (!me) return json({ error: 'no_profile' }, 400);
      const A = { ...(me.ach || {}) }; let F: string[] = Array.isArray(A.friends) ? A.friends.slice(0, 100) : []; const op = String(args?.op || 'list');
      const save = async () => { A.friends = F; await db.from('profiles').update({ ach: A }).eq('id', user.id); };
      const pub = (r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, fr: r.ach?.fr || 0, played: r.played, won: r.won, last: (r.ach?.days || []).slice(-1)[0] || null, plat: r.ach?.plat || null, mutual: Array.isArray(r.ach?.friends) && r.ach.friends.includes(user.id) });
      if (op === 'find') {
        const q = String(args?.name || '').trim().slice(0, 24); if (q.length < 2) return json({ rows: [] });
        const { data } = await db.from('profiles').select('id,name,av,rating,played,won,ach').ilike('name', q.replace(/[%_]/g, '') + '%').neq('id', user.id).order('played', { ascending: false }).limit(8);
        return json({ rows: (data || []).map(pub) });
      }
      if (op === 'add') { const id = String(args?.id || ''); if (!id || id === user.id) return json({ error: 'bad' }, 400);
        const { data: o } = await db.from('profiles').select('id').eq('id', id).maybeSingle(); if (!o) return json({ error: 'not_found' }, 404);
        if (!F.includes(id)) { if (F.length >= 100) return json({ error: 'full' }, 400); F = [id, ...F]; await save(); } return json({ ok: true, friends: F }); }
      if (op === 'remove') { F = F.filter((x) => x !== String(args?.id || '')); await save(); return json({ ok: true, friends: F }); }
      if (op === 'invite') {
        const id = String(args?.id || ''), gid = String(args?.gameId || '').toLowerCase(); if (!/^[a-z0-9]{4,24}$/.test(gid)) return json({ error: 'bad_game' }, 400);
        const inv = { ...(A.inv || {}) }; if (Date.now() - (inv[id] || 0) < 60e3) return json({ error: 'too_often' }, 429); inv[id] = Date.now(); A.inv = inv; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        const { data: o } = await db.from('profiles').select('id,ach').eq('id', id).maybeSingle(); if (!o) return json({ error: 'not_found' }, 404);
        const en = o.ach?.lang === 'en', nm = String(me.name || '').slice(0, 20) || (en ? 'A friend' : 'Друг');
        const url = '/' + (o.ach?.beta ? 'beta/' : '') + '#g-' + gid;
        const pushed = await pushTo(db, [o], { title: en ? nm + ' invites you to a game' : nm + ' кличе вас на партію', body: en ? 'Tap to join — the board is ready.' : 'Натисніть, щоб приєднатись — дошка вже готова.', tag: 'inv-' + gid, url });
        let tg = 0; if (o.ach?.tg && tgTok()) { const r = await tgApi('sendMessage', { chat_id: Number(o.ach.tg), text: (en ? '🎲 ' + nm + ' invites you to a game of long nardy!' : '🎲 ' + nm + ' кличе вас зіграти в довгі нарди!'), reply_markup: { inline_keyboard: [[{ text: en ? 'Play' : 'Грати', url: 'https://t.me/dovgi_nardy_bot?startapp=g-' + gid }]] } }); tg = r?.ok ? 1 : 0; }
        return json({ ok: true, pushed, tg });
      }
      // list: your friends + players connected by an invite link (who invited you, whom you invited)
      const { data: refs } = await db.from('profiles').select('id').eq('ach->>refBy', user.id).limit(100);
      const ids = [...new Set([...F, ...(refs || []).map((r: any) => r.id), ...(A.refBy ? [A.refBy] : [])])].filter((x) => x && x !== user.id).slice(0, 150);
      if (!ids.length) return json({ rows: [], friends: F });
      const { data } = await db.from('profiles').select('id,name,av,rating,played,won,ach').in('id', ids);
      return json({ rows: (data || []).map((r: any) => ({ ...pub(r), added: F.includes(r.id), ref: !F.includes(r.id) })), friends: F });
    }
    if (action === 'push_test') {
      const { data: p } = await db.from('profiles').select('id,ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const en = p.ach?.lang === 'en'; const sent = await pushTo(db, [p], { title: en ? 'Notifications are on' : 'Сповіщення увімкнено', body: en ? 'We will remind you about the weekend tournament.' : 'Нагадаємо про турнір вихідного дня.', tag: 'test', url: '/' });
      return json({ ok: true, sent });
    }
    if (action === 'tour_reg') {
      const EPOCH = Date.UTC(2026, 10, 7, 16, 0), WK = 7 * 864e5, Q = 4;
      const season = Math.max(0, Math.floor((Date.now() - EPOCH + 3 * 864e5) / (Q * WK)));
      const clean = (v: any, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
      const first = clean(args?.first, 24), last = clean(args?.last, 32), nick = clean(args?.nick, 20);
      const nameOk = (v: string) => /^[\p{L}][\p{L}'’ -]{1,}$/u.test(v);
      if (!nameOk(first) || !nameOk(last)) return json({ error: 'bad_name' }, 400);
      if (!/^[\p{L}\p{N}_.-]{2,20}$/u.test(nick)) return json({ error: 'bad_nick' }, 400);
      { const E = TR.tourEvent(Date.now()); if (E && E.fmt === 'cs' && (Date.now() < E.regStart || Date.now() >= E.regEnd)) return json({ error: 'reg_closed' }, 400); }   // sign-up: Monday – Friday 18:00
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; if (A.treg && A.treg.s === season) return json({ error: 'locked', treg: A.treg }, 400);
      A.treg = { s: season, first, nick, last, at: Date.now() };
      await db.from('profiles').update({ ach: A }).eq('id', user.id);
      return json({ ok: true, treg: A.treg });
    }
    // who signed up this season (public: the tournament name only)
    if (action === 'tour_regs') {
      const { data } = await db.from('profiles').select('id,name,av,rating,ach').not('ach->treg', 'is', null).limit(1000);
      return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, treg: r.ach?.treg })) });
    }
    if (action === 'ref_claim') {
      const ref = String(args?.ref ?? '');
      if (!/^[0-9a-f-]{36}$/.test(ref) || ref === user.id) return json({ error: 'bad_ref' }, 400);
      if ((user as any).is_anonymous) return json({ error: 'not_registered' }, 400);
      if (Date.now() - new Date(user.created_at).getTime() > 14 * 864e5) return json({ error: 'not_new' }, 400);
      const [{ data: me }, { data: inv }] = await Promise.all([
        db.from('profiles').select('ach').eq('id', user.id).maybeSingle(),
        db.from('profiles').select('ach').eq('id', ref).maybeSingle()]);
      if (!me || !inv) return json({ error: 'no_profile' }, 400);
      const A = { ...(me.ach || {}) }; if (A.refBy) return json({ already: true, coins: A.coins ?? COIN_START });
      const B = { ...(inv.ach || {}) }; if (B.refBy === user.id) return json({ error: 'bad_ref' }, 400);
      A.refBy = ref; A.coins = (A.coins ?? COIN_START) + 300;
      B.refN = (B.refN | 0) + 1; if (B.refN <= 50) B.coins = (B.coins ?? COIN_START) + 200;
      await db.from('profiles').update({ ach: A }).eq('id', user.id);
      await db.from('profiles').update({ ach: B }).eq('id', ref);
      return json({ ok: true, coins: A.coins });
    }
    if (typeof gameId !== 'string' || !/^[a-z0-9]{4,16}$/.test(gameId)) return json({ error: 'bad_id' }, 400);
    const prof = async (id: string) => (await db.from('profiles').select('name,av,rating,rgames,played,won,ach').eq('id', id).maybeSingle()).data;
    const ghostRow = async (gid: number) => (await db.from('ghosts').select('id,name,av,rating,played,won,skill').eq('id', gid).maybeSingle()).data;

    // rating for a finished game; called only after the game row was saved with rated=true (so it runs once)
    const CALIB = 10, CAL_MAX = 2000;   // calibration: 10 games; the starting rating is at most 2000
    const rate = async (st: any, gid = '') => { const tourG = /^t\d{6}/.test(gid);
      const vsBot = C.isBotId(st.p2), gh = vsBot && st.ghost != null ? await ghostRow(st.ghost) : null;
      const [a, b] = await Promise.all([prof(st.p1), vsBot ? Promise.resolve(null) : prof(st.p2)]);
      const oppR = vsBot ? (gh ? gh.rating : st.ratings.p2) : (b?.rating ?? 1000);
      const d = C.ratingChanges(st, a?.rating ?? 1000, oppR); if (st.rules || st.unrated) { d.p1 = 0; d.p2 = 0; }   // custom lobby games and bot practice do not change the rating
      const dGhost = d.p2;
      if (vsBot) { const f = (C.BOTS[st.p2.split(':')[1]] || C.BOTS.ghost).factor; d.p1 = Math.round(d.p1 * f); }
      const refPay: any[] = []; const fresh: any = {}, coinsPaid: any = {}, fullGame = (!vsBot || st.ghost != null || !!st.mbot) && !st.rules;
      for (const [s, p] of (vsBot ? [['p1', a]] : [['p1', a], ['p2', b]]) as any) {
        const id = st[s]; const won = st.result.winner === s; const myR = p?.rating ?? 1000, opR = s === 'p1' ? oppR : (a?.rating ?? 1000);
        const ach = C.achUpdate(p?.ach, st, s, myR, opR); fresh[s] = ach.fresh;
        // calibration: the first CALIB rated games keep the rating hidden; after the last one it is set by the share of them won
        const rg = p?.rgames ?? 0;
        // calibration (like Dota / CS): 10 games against people (or matchmaking opponents), a hidden rating with a big step (Elo, K = 160)
        // that depends a lot on whom you beat; matchmaking uses it, so winning brings stronger opponents. After game 10 it becomes your rating.
        // Practice bots do not count while calibrating.
        let calSkip = false;
        if (rg < CALIB) { if (!fullGame) { calSkip = true; d[s] = 0; }
          else { const cal = { g: 0, w: 0, mars: 0, ...(ach.A.cal || {}) }; if (cal.m == null) cal.m = Math.max(1000, Math.min(CAL_MAX, 1000 + cal.w * 90 - (cal.g - cal.w) * 30));
            cal.g++; if (won) { cal.w++; if (st.result.mars) cal.mars++; } cal.best = won ? Math.max(cal.best || 0, opR) : (cal.best || 0);
            { const E = 1 / (1 + Math.pow(10, (opR - cal.m) / 1500)); let dm = 200 * ((won ? 1 : 0) - E); if (won && st.result.mars) dm *= 2;   // classic Elo, K = 160: whom you beat matters a lot
              cal.m = Math.max(1000, Math.min(CAL_MAX, Math.round(cal.m + dm))); }
            ach.A.cal = cal; d[s] = rg + 1 >= CALIB ? cal.m - myR : 0; } }
        const dayN = ((ach.A.gd || []).find((x: any) => x.d === kyivDay()) || { h: 0, b: 0 }); const nToday = (dayN.h || 0) + (dayN.b || 0);
        const gc = gameCoins(won, fullGame && nToday < 20, !!st.result.mars, tourG); if (!tourG && fullGame && nToday >= 10 && nToday < 20) gc.coins = Math.round(gc.coins / 2); if (!tourG && fullGame && primeOn()) { (gc as any).hh = 1; gc.coins *= 2; const dd = kyivDay(); const o = ach.A.ar && ach.A.ar.d === dd ? ach.A.ar : { d: dd, p: 0, g: 0, w: 0 }; ach.A.ar = { ...o, p: o.p + (won ? (st.result.mars ? 4 : 3) : 1), g: o.g + 1, w: o.w + (won ? 1 : 0) }; } ach.A.coins = (ach.A.coins ?? COIN_START) + gc.coins; coinsPaid[s] = gc; markGame(ach.A, !vsBot); questTick(ach.A, { game: 1, win: won ? 1 : 0, human: fullGame ? 1 : 0, mars: won && st.result.mars ? 1 : 0 });
        if (!calSkip && rg + 1 >= CALIB) ach.A.peak = Math.max(ach.A.peak || 0, Math.max(100, myR + d[s]));   // the best rating reached: unlocks rank frames
        { const os = s === 'p1' ? 'p2' : 'p1', cal = !calSkip && rg + 1 >= CALIB;   // the last 20 games for the profile (any device): opponent, result, rating change
          ach.A.rh = [...(Array.isArray(ach.A.rh) ? ach.A.rh : []), { t: Date.now(), o: String(st.names?.[os] || '').slice(0, 20), oa: String(st.avs?.[os] || '').slice(0, 8), w: won ? 1 : 0, m: st.result.mars ? 1 : 0, d: cal ? d[s] : 0, r: cal ? Math.max(100, myR + d[s]) : 0, b: vsBot && st.ghost == null ? 1 : 0, g: gid }].slice(-20); }
        // 0.32.0: a compact replay of the game (the last 8), and the head-to-head score against people
        try { const os = s === 'p1' ? 'p2' : 'p1'; const rp = encReplay(st); if (rp && gid) ach.A.rp = [...(Array.isArray(ach.A.rp) ? ach.A.rp : []).filter((x: any) => x.g !== gid), { g: gid, t: Date.now(), c: colorOfSlotS(st, s), ...rp }].slice(-8);
          if (!vsBot && st[os]) { const H = { ...(ach.A.h2h || {}) }; const o = H[st[os]] || { w: 0, l: 0 }; H[st[os]] = { w: o.w + (won ? 1 : 0), l: o.l + (won ? 0 : 1), t: Date.now(), n: String(st.names?.[os] || '').slice(0, 20) };
            const keys = Object.keys(H); if (keys.length > 60) keys.sort((a, b) => (H[a].t || 0) - (H[b].t || 0)).slice(0, keys.length - 60).forEach((k) => delete H[k]); ach.A.h2h = H; } } catch (_) { /* never block the rating */ }
        // 0.67: the player's own roll stats (online games): rolls, doubles, how often each number came up, pips
        try { const myC = colorOfSlotS(st, s); const D0 = ach.A.dst || {}; const D = { n: D0.n | 0, dd: D0.dd | 0, pip: D0.pip | 0, f: Array.isArray(D0.f) && D0.f.length === 6 ? D0.f.slice() : [0, 0, 0, 0, 0, 0] };
          for (const h of (st.hist || [])) { if (h.c !== myC || !Array.isArray(h.d) || h.d.length < 2) continue; const a1 = h.d[0] | 0, b1 = h.d[1] | 0; if (a1 < 1 || a1 > 6 || b1 < 1 || b1 > 6) continue;
            D.n++; D.f[a1 - 1]++; D.f[b1 - 1]++; if (a1 === b1) { D.dd++; D.pip += a1 * 4; } else D.pip += a1 + b1; }
          ach.A.dst = D; } catch (_) { /* never block the rating */ }
        // 0.60: a friend who came by an invite and played 5 games — both get a bonus (×2 in December)
        if (ach.A.refBy && !ach.A.ref5 && ((p?.played ?? 0) + 1) >= 5) { const dec = new Date(Date.now() + 2 * 3600e3).getUTCMonth() === 11, bonus = dec ? 600 : 300;
          ach.A.ref5 = Date.now(); ach.A.coins = (ach.A.coins ?? COIN_START) + bonus; refPay.push([ach.A.refBy, bonus]); }
        if (fullGame && LG_ON) await lgAdd(db, id, ach.A, p?.name || '', p?.av || '', won ? (st.result.mars ? 4 : 3) : 1);
        await db.from('profiles').update({ rating: Math.max(100, myR + d[s]), rgames: (p?.rgames ?? 0) + (calSkip ? 0 : 1), played: (p?.played ?? 0) + 1, won: (p?.won ?? 0) + (won ? 1 : 0), ach: ach.A, updated_at: new Date().toISOString() }).eq('id', id);
      }
      if (gh) { const gw = st.result.winner === 'p2'; await db.from('ghosts').update({ rating: Math.max(100, gh.rating + dGhost), played: gh.played + 1, won: gh.won + (gw ? 1 : 0), updated_at: new Date().toISOString() }).eq('id', gh.id); }
      for (const [rid, bonus] of refPay) { try { const { data: inv } = await db.from('profiles').select('ach').eq('id', rid).maybeSingle(); if (!inv) continue; const B = { ...(inv.ach || {}) };
        B.refAct = (B.refAct | 0) + 1; if (B.refAct <= 50) { B.coins = (B.coins ?? COIN_START) + bonus; B.refGot = [...(Array.isArray(B.refGot) ? B.refGot : []), { t: Date.now(), n: bonus }].slice(-10); } await db.from('profiles').update({ ach: B }).eq('id', rid); } catch (_) { /* never block the rating */ } }
      st.ratingDelta = d; st.achNew = fresh; st.coins = coinsPaid;
    };
    // save with an optimistic lock; if this save finishes the game, apply the rating once and store the result
    const commit = async (id: string, prevAt: string, st: any) => {
      const finishing = st.phase === 'over' && !st.rated; if (finishing) st.rated = true;
      const { data: upd, error } = await db.from('games').update({ p2: st.p2 && !C.isBotId(st.p2) ? st.p2 : null, state: st, updated_at: new Date().toISOString() }).eq('id', id).eq('updated_at', prevAt).select('id');
      if (error) return 'error'; if (!upd || !upd.length) return 'conflict';
      if (finishing) { await rate(st, id); await db.from('games').update({ state: st }).eq('id', id); }
      return 'ok';
    };

    if (action === 'create' || action === 'join') { const ge = await tourGuard(db, gameId, user.id); if (ge) return json({ error: ge }, 403); }
    if (action === 'create') {
      // a bot game left unfinished counts as a loss before a new one starts
      const { data: stale } = await db.from('games').select('id,state,updated_at').eq('p1', user.id).is('p2', null).eq('state->>phase', 'play').like('state->>p2', 'bot:%').limit(5);
      for (const row of stale || []) {
        try { const st = C.act(row.state, user.id, 'abandon', {}, { now: Date.now(), d6 }); st.seq = (row.state.seq || 0) + 1; await commit(row.id, row.updated_at, st); } catch (_) { /* already over */ }
      }
      const me = await prof(user.id); const bot = args?.bot && C.BOTS[args.bot] ? args.bot : null;
      let gh = null; if (bot === 'ghost') { gh = await ghostRow(Number(args?.ghost)); if (!gh) return json({ error: 'bad_ghost' }, 400); }
      const cn = bot === 'camp' ? Math.round(Number(args?.camp)) : 0, CH = cn ? CAMP[cn] : null;
      if (bot === 'camp' && (!CH || ((me?.ach?.camp | 0) < cn - 1))) return json({ error: 'camp_locked' }, 400);
      const cStep = bot === 'camp' && Number(args?.step) === 2 ? 2 : 3, cDone = me?.ach?.camp | 0, cs = me?.ach?.cs | 0;
      if (bot === 'camp' && cn === cDone + 1 && cs < cStep - 1) return json({ error: 'camp_step' }, 400);
      const st = C.newGame(user.id, bot ? 'bot:' + bot : null); if (bot && bot !== 'ghost' && bot !== 'camp' && args?.pr) st.unrated = 1;   // 0.58: practice with a bot — no rating
      // 0.76: a match to 3/5/7 points and/or blitz (10 s a move) against a bot — practice, no rating
      if (bot && bot !== 'ghost' && bot !== 'camp' && args?.fmt && typeof args.fmt === 'object') { const to = [1, 3, 5, 7].includes(Number(args.fmt.to)) ? Number(args.fmt.to) : 1, bz = !!args.fmt.bz;
        if (to > 1 || bz) { st.rules = { to, t: bz ? 10 : 0, dbl: 'norm', head: 'one', noMars: false, noOdds: false, open: false, first: 'roll' }; st.unrated = 1; } }
      if (!bot && args?.rules && typeof args.rules === 'object') { const q = args.rules, pick = (v: any, L: any[], d: any) => L.includes(v) ? v : d;
        st.rules = { to: pick(Number(q.to), [1, 3, 5, 7], 1), t: pick(Number(q.t), [0, 10, 20, 30, 60], 60), dbl: pick(q.dbl, ['norm', 'none', 'pen'], 'norm'), head: pick(q.head, ['one', 'free'], 'one'), noMars: !!q.noMars, noOdds: !!q.noOdds, open: !!q.open, first: pick(q.first, ['roll', 'host', 'alt'], 'roll') };
        // the host's table, board, checkers and dice, shown to both players (names only; the site checks they exist)
        if (q.sty && typeof q.sty === 'object') { const S: any = {}; for (const k of ['board', 'ck', 'dice', 'table']) { const v = String(q.sty[k] || ''); if (/^[a-z0-9_-]{1,24}$/i.test(v)) S[k] = v; } if (Object.keys(S).length) st.rules.sty = S; }
        st.lobbyAt = Date.now(); }
      const myR = me?.rating ?? 1000;
      const botR = gh ? gh.rating : CH ? CH.r : bot ? C.BOTS[bot].r : 0;
      st.names = { p1: me?.name ?? '', p2: gh ? gh.name : CH ? CH.name : bot ? String(args?.name ?? '').slice(0, 24) : '' }; st.avs = { p1: me?.av ?? '', p2: gh ? gh.av : CH ? CH.av : bot ? String(args?.av ?? '').slice(0, 8) : '' };
      st.ratings = { p1: myR, p2: botR }; st.frs = { p1: me?.ach?.fr || 0, p2: 0 }; st.tts = { p1: me?.ach?.tt || '', p2: '' }; if (gh) { st.ghost = gh.id; st.botNoise = ghostNoise(gh.skill ?? gh.rating); const lv = ghostLvl(gh.skill ?? gh.rating); if (lv) st.botLvl = lv; }
      if (CH) { st.camp = cn; st.botNoise = CH.noise; if (CH.lvl) st.botLvl = CH.lvl;
        if (cStep === 2) { const M = CAMP_MINI[cn]; st.campStep = 2; st.board = M.board(); st.botNoise = M.noise; if (M.lvl) st.botLvl = M.lvl; else delete st.botLvl;
          st.rules = { to: 1, t: M.t || 60, dbl: M.dbl || 'norm', head: 'one', noMars: false, noOdds: false, open: false };
          st.white = st.p1; st.black = st.p2; st.phase = 'play'; st.turn = 'w'; st.first = { w: false, b: false }; st.turnAt = Date.now(); st.names.p2 = M.name; st.avs.p2 = M.av; } }
      const { error } = await db.from('games').insert({ id: gameId, p1: user.id, p2: null, state: st, updated_at: new Date().toISOString() });
      if (error) return json({ error: error.code === '23505' ? 'exists' : 'db' }, 409);
      return json({ state: st });
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: row } = await db.from('games').select('state,updated_at').eq('id', gameId).maybeSingle();
      if (!row) return json({ error: 'not_found' }, 404);
      let st;
      try { st = C.act(row.state, user.id, action, args, { now: Date.now(), d6 }); } catch (e) { return json({ error: (e as Error).message }, 409); }
      if (action === 'join' && st.p2 === user.id && !row.state.p2) {
        const me = await prof(user.id); st.names = { ...(st.names || {}), p2: me?.name ?? '' }; st.avs = { ...(st.avs || {}), p2: me?.av ?? '' }; st.ratings = { ...(st.ratings || {}), p2: me?.rating ?? 1000 }; st.frs = { ...(st.frs || {}), p2: me?.ach?.fr || 0 }; st.tts = { ...(st.tts || {}), p2: me?.ach?.tt || '' };
      }
      st.seq = (row.state.seq || 0) + 1;
      const r = await commit(gameId, row.updated_at, st);
      if (r === 'error') return json({ error: 'db' }, 500);
      if (r === 'ok') return json({ state: st });
    }
    return json({ error: 'busy' }, 409);
  } catch (e) { return json({ error: 'server', detail: String(e) }, 500); }
});
