// @ts-nocheck
// Supabase Edge Function "game": the only writer of online games and ratings.
// Clients call it with { action, gameId, args }; it validates the move with the same rules as the client.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
function eloDelta(my,opp,score,mars){ const E=1/(1+Math.pow(10,(opp-my)/400)), b=baseGain(my); let d=score?b*(0.9+0.2*(1-E)):-b*(0.9+0.2*E); if(mars) d*=1.2; return Math.round(d); }


// ---- server-side bots (practice bots and online personas) ----
const BOTS={ marta:{r:900,noise:7,factor:.4}, ostap:{r:1000,noise:3,factor:.4}, taras:{r:1100,noise:.8,factor:.4}, hryts:{r:1250,noise:0,factor:.4}, ghost:{r:null,noise:0,factor:1} };
function botEval(st,c){ const o=OPP(c); let made=0,run=0,best=0,stack=0,back=0;
  for(let p=0;p<24;p++){ const k=mine(st.board,c,p); if(k>0){ made++; run++; if(run>best) best=run; if(k>3) stack+=k-3; if(p<12) back+=k; } else run=0; }
  let oppPips=0; for(let p=0;p<24;p++){ const k=mine(st.board,o,p); if(k>0) oppPips+=k*(24-p); } const head=Math.max(0,mine(st.board,c,0)-1);
  return 22*st.off[c]+3*made+5*Math.min(best,5)-1.2*stack-0.25*back-0.6*head+0.02*oppPips; }
function botBestPath(st,c,noise,rnd){ const total=maxUse(st,c); if(!total) return null; let best=null,bestV=-1e9,nodes=0; const seen=new Set();
  (function dfs(s,path,first){ if(nodes++>6000) return; if(path.length===total){ const v=botEval(s,c)+rnd()*(noise+0.05); if(v>bestV){bestV=v;best=path;} return; }
    const key=s.board.join()+'|'+s.off[c]+'|'+s.remaining.join()+'|'+s.headMoved; if(seen.has(key)) return; seen.add(key);
    const cand=first?legalMoves(s,c):[].concat(...[...new Set(s.remaining)].map(d=>genSingles(s,c,d))); for(const m of cand) dfs(applyMove(s,c,m),path.concat([m]),false); })(st,[],true);
  return best; }
const isBotId=id=>typeof id==='string'&&id.startsWith('bot:');

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
function passTurn(st,now){ pushHist(st); st.last=st.trail||[]; st.trail=[]; st.turn=OPP(st.turn); st.dice=[]; st.remaining=[]; st.rolled=false; st.snap=null; st.headMoved=0; st.turnAt=now; }
function finish(st,winner,mars,resign){ st.winner=winner; st.phase='over'; st.score[slotOfColor(st,winner)]+=mars?2:1; st.dice=[]; st.remaining=[]; st.rolled=false; if(resign) st.resign=resign; st.result={winner:slotOfColor(st,winner),mars:!!mars}; }
function resolveOpening(st,now){ const a=st.open.p1,b=st.open.p2; if(!a||!b) return; st.openLast={p1:a,p2:b,tie:a===b};
  if(a===b){ st.open={p1:0,p2:0}; st.openRound++; return; } const w=a>b?'p1':'p2'; st.white=st[w]; st.black=st[w==='p1'?'p2':'p1']; st.phase='play'; st.turn='w'; st.turnAt=now; }
function autoPassIfStuck(st,now){ if(st.phase==='play' && st.rolled && !legalMoves(st,st.turn).length) passTurn(st,now); }

// act(state, uid, action, args, {now, d6}) -> new state (mutates a copy)
function act(state, uid, action, args, env){
  const now=env.now, d6=env.d6; const st=JSON.parse(JSON.stringify(state)); const me=slotOf(st,uid);
  if(action==='bot_step'){ if(!isBotId(st.p2)||st.p1!==uid) err('not_bot_game'); const rnd=env.rnd||Math.random, kind=st.p2.split(':')[1]; const B=BOTS[kind]||BOTS.ghost;
    if(st.phase==='opening'){ if(!st.open.p1) err('wait'); if(st.open.p2) err('already'); st.open.p2=d6(); st.rollId++; resolveOpening(st,now); return st; }
    if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,'p2'); if(st.turn!==c) err('not_bot_turn');
    if(!st.rolled){ const a=d6(),b=d6(); st.dice=[a,b]; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headLimit=(st.first[c]&&a===b&&[3,4,6].includes(a))?2:1; st.first[c]=false; st.headMoved=0; st.rolled=true; st.trail=[]; st.rollId++; st.snap=null; st.turnAt=now;
      st.botPlan = botBestPath(st,c,B.noise,rnd)||[]; if(!st.botPlan.length){ st.botPlan=null; passTurn(st,now); } return st; }
    const m=(st.botPlan||[]).shift(); const ok=m&&legalMoves(st,c).find(x=>x.from===m.from&&x.to===m.to&&x.die===m.die); if(!ok){ st.botPlan=null; passTurn(st,now); return st; }
    Object.assign(st,applyMove(st,c,ok)); st.trail=(st.trail||[]).concat([b2(c,ok.from),ok.to===24?-1:b2(c,ok.to)]);
    if(st.off[c]===15){ pushHist(st); finish(st,c,st.off[OPP(c)]===0); st.botPlan=null; return st; }
    if(!legalMoves(st,c).length){ st.botPlan=null; passTurn(st,now); } return st; }
  if(action==='join'){ if(st.p2 && st.p2!==uid && st.p1!==uid) err('full'); if(!st.p2 && st.p1!==uid){ st.p2=uid; } return st; }
  if(!me) err('not_player');
  if(action==='open_roll'){ if(st.phase!=='opening'||!st.p2) err('bad_phase'); if(st.open[me]) err('already'); st.open[me]=d6(); st.rollId++; resolveOpening(st,now); return st; }
  if(action==='rematch'){ if(st.phase!=='over') err('bad_phase'); st.rematch=st.rematch||{}; st.rematch[me]=true;
    if(st.rematch.p1&&st.rematch.p2){ const ng=newGame(st.p1,st.p2,st.score); ng.names=st.names; ng.avs=st.avs; ng.ratings=st.ratings; ng.seq=st.seq; ng.rollId=st.rollId; return ng; } return st; }
  if(action==='timeout'){ if(st.phase!=='play') err('bad_phase'); const opp=me==='p1'?'p2':'p1'; if(colorOfSlot(st,opp)!==st.turn) err('not_their_turn'); if(now-(st.turnAt||0)<TURN_MS) err('too_early');
    st.strikes=st.strikes||{p1:0,p2:0}; st.strikes[opp]++;
    if(st.strikes[opp]>=MAX_STRIKES){ const w=colorOfSlot(st,me); finish(st,w,st.off[OPP(w)]===0&&false,{c:OPP(w),mars:false,timeout:true}); return st; }
    st.trail=[]; if(st.snap){ st.board=st.snap.board; st.off=st.snap.off; } passTurn(st,now); return st; }
  // leaving a started game counts as a loss (no minimum number of moves)
  if(action==='abandon'){ if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,me), w=OPP(c), mars=st.off[c]===0&&(st.off[w]>0||allHome(st,w)); finish(st,w,mars,{c,mars,abandon:true}); return st; }
  // the opponent has gone quiet on their own turn: take the win without waiting for three timeouts
  if(action==='claim'){ if(st.phase!=='play') err('bad_phase'); const opp=me==='p1'?'p2':'p1'; if(colorOfSlot(st,opp)!==st.turn) err('not_their_turn'); if(now-(st.turnAt||0)<CLAIM_MS) err('too_early');
    const w=colorOfSlot(st,me); finish(st,w,false,{c:OPP(w),mars:false,abandon:true}); return st; }
  if(action==='resign'){ if(st.phase!=='play') err('bad_phase'); if((st.hist||[]).length<RESIGN_MIN) err('too_early'); const c=colorOfSlot(st,me), w=OPP(c), mars=st.off[c]===0&&(st.off[w]>0||allHome(st,w)); finish(st,w,mars,{c,mars}); return st; }
  // turn actions
  if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,me); if(st.turn!==c) err('not_your_turn');
  if(action==='roll'){ if(st.rolled) err('already'); const a=d6(), b=d6(); st.dice=[a,b]; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headLimit=(st.first[c]&&a===b&&[3,4,6].includes(a))?2:1; st.first[c]=false; st.headMoved=0; st.rolled=true; st.trail=[]; st.rollId++; st.snap={board:st.board.slice(),off:{...st.off}}; st.turnAt=now;
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
function gameCoins(won: boolean, full: boolean, mars: boolean) {
  const R = won ? (full ? [120, 180] : [30, 50]) : (full ? [40, 60] : [5, 15]);
  let c = R[0] + Math.floor(Math.random() * (R[1] - R[0] + 1)); if (won && mars) c = Math.round(c * 1.5);
  const lucky = full && Math.random() < 0.05; if (lucky) c *= 2; return { coins: c, lucky };
}
// ---- shop (0.15.1): prices and rarities of the main site's items; the base set is free; owned items in profiles.ach.owned ----
const SHOP_P: any = { board: { c: 200, r: 600, e: 1200, l: 2500 }, ck: { c: 150, r: 450, e: 1000, l: 1800 }, dice: { c: 100, r: 300, e: 750, l: 1350 }, table: { c: 300 } };
const SHOP_R: any = { board: { modern: 'c', tri: 'c', walnut: 'r', midnight: 'r', druzi: 'r', sage: 'r', marble: 'e', oak: 'e', ocean: 'e', carbon: 'e' },
  ck: { wood: 'c', stone: 'c', flat: 'c', metal: 'r', glass: 'r', retro: 'r', pearl: 'e', amber: 'e', jade: 'e', neon: 'e', vyshyvanka: 'l' },
  dice: { onyx: 'c', wood: 'c', ruby: 'r', marble: 'r', glass: 'r', gold: 'e', neon: 'e' },
  table: { wood: 'c', felt: 'c', carpet: 'c', marble: 'c', cafe: 'c', stone: 'c', leather: 'c' } };
const shopPrice = (id: string) => { const [c, k] = id.split(':'); const r = SHOP_R[c]?.[k]; return r ? (SHOP_P[c][r] ?? SHOP_P[c].c) : 0; };
const SHOP_OPEN = Date.UTC(2026, 10, 7, 10, 0);   // accounts made before the shop opened get 3000 coins once, for the skins that became paid
// ---- daily gift (7-day streak) and quests of the day; quest progress is counted on the server in rate() ----
const DAILY = [50, 70, 90, 110, 130, 150, 150];
const QUESTS: any[] = [{ k: 'play2', ev: 'game', n: 2, r: 40 }, { k: 'play4', ev: 'game', n: 4, r: 70 }, { k: 'win1', ev: 'win', n: 1, r: 50 }, { k: 'win3', ev: 'win', n: 3, r: 100 }, { k: 'human1', ev: 'human', n: 1, r: 60 }, { k: 'mars1', ev: 'mars', n: 1, r: 100 }];
function questIds(day: string) { let h = 0; for (const ch of day) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const L = QUESTS.map((q) => q.k); const out: string[] = []; while (out.length < 3) { h = (h * 1103515245 + 12345) >>> 0; const k = L[h % L.length]; if (!out.includes(k)) out.push(k); } return out; }
function questState(A: any, day: string) { const q = A.q && A.q.d === day ? A.q : { d: day, p: {}, got: [] }; return q; }
function questTick(A: any, ev: Record<string, number>) { const day = kyivDay(); const q = questState(A, day); for (const k in ev) q.p[k] = (q.p[k] || 0) + ev[k]; A.q = q; }
const prevDay = (day: string) => kyivDay(new Date(day + 'T12:00:00Z').getTime() - 864e5 - 2 * 3600e3 + 3600e3);
// ---- admin: only the account registered with the login nickname below (checked by its auth email, which never changes) ----
const ADMIN_NICKS = ['ka1p3r'];
function nickEmail(n: string) { const bytes = new TextEncoder().encode(n.trim().toLowerCase()); let bits = ''; for (const x of bytes) bits += x.toString(2).padStart(8, '0');
  const A = 'abcdefghijklmnopqrstuvwxyz234567'; let out = ''; for (let i = 0; i < bits.length; i += 5) out += A[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]; return 'u' + out + '@nardy.invalid'; }
const ADMIN_EMAILS = new Set(ADMIN_NICKS.map(nickEmail));
const isAdminUser = (u: any) => !!u && !u.is_anonymous && ADMIN_EMAILS.has(String(u.email || '').toLowerCase());
const kyivDay = (t = Date.now()) => new Date(t + 2 * 3600e3).toISOString().slice(0, 10);
// activity: the days a player was here (last 60) and games per day (last 60), kept in the profile for the admin statistics
function markDay(A: any, field: 'days', day = kyivDay()) { const L: string[] = Array.isArray(A[field]) ? A[field] : []; if (!L.includes(day)) L.push(day); A[field] = L.slice(-60); }
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
function pushEvents(now: number) { const k = new Date(now + KYIV_OFF), dow = k.getUTCDay(), ymd = k.toISOString().slice(0, 10), mins = k.getUTCHours() * 60 + k.getUTCMinutes();
  const ev: any[] = [];
  if (dow === 6 && mins >= 12 * 60 && mins < 12 * 60 + 40) ev.push({ id: 'sat12-' + ymd, who: 'all', uk: ['Сьогодні турнір вихідного дня', 'О 18:00 — групи. Запис ще відкритий, заходьте!'], en: ['Weekend tournament today', 'Groups at 18:00. Sign-up is still open — come in!'] });
  if (dow === 6 && mins >= 17 * 60 && mins < 17 * 60 + 40) ev.push({ id: 'sat17-' + ymd, who: 'reg', uk: ['Турнір через годину', 'Групи стартують о 18:00 — ви записані.'], en: ['Tournament in an hour', 'Groups start at 18:00 — you are signed up.'] });
  if (dow === 6 && mins >= 17 * 60 + 50 && mins < 18 * 60 + 20) ev.push({ id: 'sat1750-' + ymd, who: 'reg', uk: ['Турнір починається!', 'Ваша група вже чекає — відкрийте нарди.'], en: ['The tournament is starting!', 'Your group is waiting — open nardy.'] });
  if (dow === 0 && mins >= 17 * 60 + 50 && mins < 18 * 60 + 20) ev.push({ id: 'sun1750-' + ymd, who: 'reg', uk: ['Плей-оф починається', 'Неділя, 18:00 — ваш плей-оф турніру вихідного дня.'], en: ['The play-off is starting', 'Sunday, 18:00 — your weekend tournament play-off.'] });
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
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!, svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')!;
    const db = createClient(url, svc, { auth: { persistSession: false } });
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const body0 = await req.json().catch(() => ({}));
    // public: the VAPID public key, and the reminder tick (called every few minutes by a scheduled GitHub Action)
    if (body0.action === 'push_key') return json({ key: (await vapid(db)).pub });
    if (body0.action === 'push_tick') {
      const ev = pushEvents(Date.now()); if (!ev.length) return json({ ok: true, events: 0 });
      let doneJ: any = {}; const dl = await db.storage.from('srv').download('push_sent.json'); if (dl.data) { try { doneJ = JSON.parse(await dl.data.text()); } catch (_) {} }
      const EPOCH = Date.UTC(2026, 10, 7, 16, 0), season = Math.max(0, Math.floor((Date.now() - EPOCH + 3 * 864e5) / (4 * 7 * 864e5)));
      const { data: rows } = await db.from('profiles').select('id,ach').not('ach->push', 'is', null).limit(5000);
      let sent = 0; for (const e of ev) { if (doneJ[e.id]) continue; doneJ[e.id] = Date.now();
        await db.storage.from('srv').upload('push_sent.json', new Blob([JSON.stringify(doneJ)], { type: 'application/json' }), { upsert: true });
        const to = (rows || []).filter((r: any) => e.who === 'all' || (r.ach?.treg && r.ach.treg.s === season));
        for (const r of to) { const L = r.ach?.lang === 'en' ? e.en : e.uk; sent += await pushTo(db, [r], { title: L[0], body: L[1], tag: e.id, url: '/' + (r.ach?.beta ? 'beta/' : '') + '?tour=1' }); } }
      return json({ ok: true, events: ev.length, sent }); }
    if (body0.action === 'tg_login') {
      const tu = await tgVerify(String(body0.args?.initData || '')); if (!tu || !tu.id) return json({ error: 'tg_bad' }, 401);
      const email = 'tg-' + tu.id + '@telegram.invalid';
      const cr = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: { tg: tu.id } });
      const isNew = !cr.error;
      const { data: L, error: le } = await db.auth.admin.generateLink({ type: 'magiclink', email }); if (le || !L?.properties?.hashed_token) return json({ error: 'tg_link' }, 500);
      return json({ ok: true, token_hash: L.properties.hashed_token, isNew, tg: { id: tu.id, first: tu.first_name || '', last: tu.last_name || '', username: tu.username || '', lang: tu.language_code || '' } });
    }
    const { data: { user } } = await db.auth.getUser(token); if (!user) return json({ error: 'auth' }, 401);
    const { action, gameId, args } = body0;
    if (action === 'ice') return json({ ice: await iceServers().catch(() => null) });
    // coins live in profiles.ach.coins (start 1000); the tutorial pays 200 once
    if (action === 'rewards') {
      const op = String(args?.op || 'get'), day = kyivDay();
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const D = A.daily || { d: '', s: 0 };
      const streakNext = D.d === day ? D.s : (D.d === prevDay(day) ? (D.s % 7) + 1 : 1);
      const view = () => { const q = questState(A, day); return { day, coins: A.coins ?? COIN_START, daily: { ready: D.d !== day, day: streakNext, list: DAILY }, quests: questIds(day).map((k) => { const Q = QUESTS.find((x) => x.k === k); return { k, ev: Q.ev, n: Q.n, r: Q.r, p: Math.min(Q.n, q.p[Q.ev] || 0), got: q.got.includes(k) }; }) }; };
      if (op === 'daily') { if (D.d === day) return json({ ok: true, already: true, ...view() }); const n = DAILY[streakNext - 1]; A.daily = { d: day, s: streakNext }; A.coins = (A.coins ?? COIN_START) + n; Object.assign(D, A.daily);
        await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: n, ...view() }); }
      if (op === 'quest') { const k = String(args?.k || ''); const q = questState(A, day); const Q = QUESTS.find((x) => x.k === k);
        if (!Q || !questIds(day).includes(k) || q.got.includes(k) || (q.p[Q.ev] || 0) < Q.n) return json({ error: 'not_ready', ...view() }, 400);
        q.got.push(k); A.q = q; A.coins = (A.coins ?? COIN_START) + Q.r; await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, got: Q.r, ...view() }); }
      return json({ ok: true, ...view() });
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
        const id = String(args?.id || ''), price = shopPrice(id); if (!price) return json({ error: 'not_for_sale' }, 400);
        if (A.owned.includes(id)) return json({ ok: true, coins: A.coins ?? COIN_START, owned: A.owned });
        const coins = A.coins ?? COIN_START; if (coins < price) return json({ error: 'no_coins', coins }, 400);
        A.coins = coins - price; A.owned = [...A.owned, id]; await db.from('profiles').update({ ach: A }).eq('id', user.id);
        return json({ ok: true, coins: A.coins, owned: A.owned, price });
      }
      return json({ error: 'bad_op' }, 400);
    }
    // a player opened the site today (once a day from the client)
    if (action === 'seen') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ ok: false });
      const A = { ...(p.ach || {}) }; const day = kyivDay(); if (!(A.days || []).includes(day)) { markDay(A, 'days', day); await db.from('profiles').update({ ach: A }).eq('id', user.id); }
      return json({ ok: true, admin: isAdminUser(user) });
    }
    if (action === 'admin') {
      if (!isAdminUser(user)) return json({ error: 'forbidden' }, 403);
      const op = String(args?.op || '');
      if (op === 'me') return json({ ok: true });
      if (op === 'stats') {
        const users: any[] = []; for (let page = 1; page <= 20; page++) { const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 }); const L = data?.users || []; users.push(...L); if (L.length < 1000) break; }
        const { data: profs } = await db.from('profiles').select('id,name,av,rating,rgames,played,won,ach').limit(20000);
        const P = new Map((profs || []).map((r: any) => [r.id, r]));
        const today = kyivDay(), days: string[] = []; for (let i = 29; i >= 0; i--) days.push(kyivDay(Date.now() - i * 864e5));
        const per: any = {}; days.forEach((d) => per[d] = { d, newReg: 0, newGuest: 0, actReg: 0, actGuest: 0, hum: 0, bot: 0 });
        const reg = users.filter((u) => !u.is_anonymous), guests = users.filter((u) => u.is_anonymous);
        users.forEach((u) => { const d = kyivDay(new Date(u.created_at).getTime()); if (per[d]) per[d][u.is_anonymous ? 'newGuest' : 'newReg']++; });
        let coins = 0, tut = 0, treg = 0, refBy = 0, calib = 0, played = 0; const rich: any[] = [];
        const anon = new Set(guests.map((u) => u.id));
        (profs || []).forEach((r: any) => { const A = r.ach || {}; const g = anon.has(r.id);
          (A.days || []).forEach((d: string) => { if (per[d]) per[d][g ? 'actGuest' : 'actReg']++; });
          (A.gd || []).forEach((e: any) => { if (per[e.d]) { per[e.d].hum += e.h || 0; per[e.d].bot += e.b || 0; } });
          if (!g) { coins += A.coins ?? COIN_START; if (A.tut) tut++; if (A.treg) treg++; if (A.refBy) refBy++; if ((r.rgames || 0) >= 10) calib++; played += r.played || 0; rich.push({ name: r.name, coins: A.coins ?? COIN_START }); } });
        Object.values(per).forEach((x: any) => { x.hum = Math.round(x.hum / 2); });
        // retention of registered players: came back the next day / within 7 days
        let c1 = 0, r1 = 0, c7 = 0, r7 = 0; reg.forEach((u) => { const t0 = new Date(u.created_at).getTime(), d0 = kyivDay(t0), A = (P.get(u.id) as any)?.ach || {}, L: string[] = A.days || [];
          if (Date.now() - t0 > 2 * 864e5) { c1++; if (L.includes(kyivDay(t0 + 864e5))) r1++; }
          if (Date.now() - t0 > 8 * 864e5) { c7++; if (L.some((d) => d > d0 && d <= kyivDay(t0 + 7 * 864e5))) r7++; } });
        const sum = (k: string, n: number) => days.slice(-n).reduce((a, d) => a + per[d][k], 0);
        return json({ ok: true, today, days: days.map((d) => per[d]),
          totals: { reg: reg.length, guests: guests.length, coins, tut, treg, refBy, calib, played },
          last: { d1: { newReg: per[today].newReg, act: per[today].actReg, hum: per[today].hum, bot: per[today].bot },
                  d7: { newReg: sum('newReg', 7), hum: sum('hum', 7), bot: sum('bot', 7) }, d30: { newReg: sum('newReg', 30), hum: sum('hum', 30), bot: sum('bot', 30) } },
          ret: { d1: c1 ? Math.round(r1 / c1 * 100) : null, d1n: c1, d7: c7 ? Math.round(r7 / c7 * 100) : null, d7n: c7 },
          rich: rich.sort((a, b) => b.coins - a.coins).slice(0, 5) });
      }
      if (op === 'find') {
        const q = String(args?.q || '').trim().slice(0, 24); if (q.length < 2) return json({ rows: [] });
        const { data } = await db.from('profiles').select('id,name,av,rating,rgames,played,won,ach').ilike('name', '%' + q.replace(/[%_]/g, '') + '%').limit(20);
        return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, rgames: r.rgames, played: r.played, won: r.won, coins: r.ach?.coins ?? COIN_START, last: (r.ach?.days || []).slice(-1)[0] || null, treg: r.ach?.treg || null, refN: r.ach?.refN || 0 })) });
      }
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
    if (action === 'tour_table') {
      const { data } = await db.from('profiles').select('id,name,av,rating,played,won,ach').not('ach->tourAt', 'is', null).limit(1000);
      return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, played: r.played, won: r.won, tp: (r.ach?.tp || []).slice(-30) })) });
    }
    if (action === 'tour_done') {
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
      A.push = L.length ? L : null; if (args?.lang) A.lang = args.lang === 'en' ? 'en' : 'uk'; if (args?.beta != null) A.beta = !!args.beta;
      await db.from('profiles').update({ ach: A }).eq('id', user.id); return json({ ok: true, n: L.length });
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
    const ghostRow = async (gid: number) => (await db.from('ghosts').select('id,name,av,rating,played,won').eq('id', gid).maybeSingle()).data;

    // rating for a finished game; called only after the game row was saved with rated=true (so it runs once)
    const CALIB = 10, CALIB_PLACE = [1000, 1030, 1060, 1100, 1140, 1180, 1230, 1320, 1470, 1600, 1760];   // rating by wins out of 10: 0–5 Rookie, 6–7 Regular, 8–9 Expert, 10 Master
    const rate = async (st: any) => {
      const vsBot = C.isBotId(st.p2), gh = vsBot && st.ghost != null ? await ghostRow(st.ghost) : null;
      const [a, b] = await Promise.all([prof(st.p1), vsBot ? Promise.resolve(null) : prof(st.p2)]);
      const oppR = vsBot ? (gh ? gh.rating : st.ratings.p2) : (b?.rating ?? 1000);
      const d = C.ratingChanges(st, a?.rating ?? 1000, oppR);
      const dGhost = d.p2;
      if (vsBot) { const f = (C.BOTS[st.p2.split(':')[1]] || C.BOTS.ghost).factor; d.p1 = Math.round(d.p1 * f); }
      const fresh: any = {}, coinsPaid: any = {}, fullGame = !vsBot || st.ghost != null || !!st.mbot;
      for (const [s, p] of (vsBot ? [['p1', a]] : [['p1', a], ['p2', b]]) as any) {
        const id = st[s]; const won = st.result.winner === s; const myR = p?.rating ?? 1000, opR = s === 'p1' ? oppR : (a?.rating ?? 1000);
        const ach = C.achUpdate(p?.ach, st, s, myR, opR); fresh[s] = ach.fresh;
        // calibration: the first CALIB rated games keep the rating hidden; after the last one it is set by the share of them won
        const rg = p?.rgames ?? 0;
        if (rg < CALIB) { const cal = { g: 0, w: 0, ...(ach.A.cal || {}) }; cal.g++; if (won) cal.w++; ach.A.cal = cal;
          d[s] = rg + 1 >= CALIB ? CALIB_PLACE[Math.round(cal.w / cal.g * CALIB)] - myR : 0; }
        const dayN = ((ach.A.gd || []).find((x: any) => x.d === kyivDay()) || { h: 0, b: 0 }); const nToday = (dayN.h || 0) + (dayN.b || 0);
        const gc = gameCoins(won, fullGame && nToday < 20, !!st.result.mars); if (fullGame && nToday >= 10 && nToday < 20) gc.coins = Math.round(gc.coins / 2); ach.A.coins = (ach.A.coins ?? COIN_START) + gc.coins; coinsPaid[s] = gc; markGame(ach.A, !vsBot); questTick(ach.A, { game: 1, win: won ? 1 : 0, human: fullGame ? 1 : 0, mars: won && st.result.mars ? 1 : 0 });
        await db.from('profiles').update({ rating: Math.max(100, myR + d[s]), rgames: (p?.rgames ?? 0) + 1, played: (p?.played ?? 0) + 1, won: (p?.won ?? 0) + (won ? 1 : 0), ach: ach.A, updated_at: new Date().toISOString() }).eq('id', id);
      }
      if (gh) { const gw = st.result.winner === 'p2'; await db.from('ghosts').update({ rating: Math.max(100, gh.rating + dGhost), played: gh.played + 1, won: gh.won + (gw ? 1 : 0), updated_at: new Date().toISOString() }).eq('id', gh.id); }
      st.ratingDelta = d; st.achNew = fresh; st.coins = coinsPaid;
    };
    // save with an optimistic lock; if this save finishes the game, apply the rating once and store the result
    const commit = async (id: string, prevAt: string, st: any) => {
      const finishing = st.phase === 'over' && !st.rated; if (finishing) st.rated = true;
      const { data: upd, error } = await db.from('games').update({ p2: st.p2 && !C.isBotId(st.p2) ? st.p2 : null, state: st, updated_at: new Date().toISOString() }).eq('id', id).eq('updated_at', prevAt).select('id');
      if (error) return 'error'; if (!upd || !upd.length) return 'conflict';
      if (finishing) { await rate(st); await db.from('games').update({ state: st }).eq('id', id); }
      return 'ok';
    };

    if (action === 'create') {
      // a bot game left unfinished counts as a loss before a new one starts
      const { data: stale } = await db.from('games').select('id,state,updated_at').eq('p1', user.id).is('p2', null).eq('state->>phase', 'play').like('state->>p2', 'bot:%').limit(5);
      for (const row of stale || []) {
        try { const st = C.act(row.state, user.id, 'abandon', {}, { now: Date.now(), d6 }); st.seq = (row.state.seq || 0) + 1; await commit(row.id, row.updated_at, st); } catch (_) { /* already over */ }
      }
      const me = await prof(user.id); const bot = args?.bot && C.BOTS[args.bot] ? args.bot : null;
      let gh = null; if (bot === 'ghost') { gh = await ghostRow(Number(args?.ghost)); if (!gh) return json({ error: 'bad_ghost' }, 400); }
      const st = C.newGame(user.id, bot ? 'bot:' + bot : null);
      const myR = me?.rating ?? 1000;
      const botR = gh ? gh.rating : bot ? C.BOTS[bot].r : 0;
      st.names = { p1: me?.name ?? '', p2: gh ? gh.name : bot ? String(args?.name ?? '').slice(0, 24) : '' }; st.avs = { p1: me?.av ?? '', p2: gh ? gh.av : bot ? String(args?.av ?? '').slice(0, 8) : '' };
      st.ratings = { p1: myR, p2: botR }; if (gh) st.ghost = gh.id;
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
        const me = await prof(user.id); st.names = { ...(st.names || {}), p2: me?.name ?? '' }; st.avs = { ...(st.avs || {}), p2: me?.av ?? '' }; st.ratings = { ...(st.ratings || {}), p2: me?.rating ?? 1000 };
      }
      st.seq = (row.state.seq || 0) + 1;
      const r = await commit(gameId, row.updated_at, st);
      if (r === 'error') return json({ error: 'db' }, 500);
      if (r === 'ok') return json({ state: st });
    }
    return json({ error: 'busy' }, 409);
  } catch (e) { return json({ error: 'server', detail: String(e) }, 500); }
});
