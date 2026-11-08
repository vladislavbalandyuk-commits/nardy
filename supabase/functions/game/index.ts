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
  if(action==='bot_step'){ if(!isBotId(st.p2)||st.p1!==uid) err('not_bot_game'); const rnd=env.rnd||Math.random, kind=st.p2.split(':')[1]; const B=BOTS[kind]||BOTS.ghost, NZ=st.botNoise!=null?st.botNoise:B.noise;
    if(st.phase==='opening'){ if(!st.open.p1) err('wait'); if(st.open.p2) err('already'); st.open.p2=d6(); st.rollId++; resolveOpening(st,now); return st; }
    if(st.phase!=='play') err('bad_phase'); const c=colorOfSlot(st,'p2'); if(st.turn!==c) err('not_bot_turn');
    if(!st.rolled){ const a=d6(),b=d6(); st.dice=[a,b]; st.remaining=a===b?[a,a,a,a]:[a,b]; st.headLimit=(st.first[c]&&a===b&&[3,4,6].includes(a))?2:1; st.first[c]=false; st.headMoved=0; st.rolled=true; st.trail=[]; st.rollId++; st.snap=null; st.turnAt=now;
      st.botPlan = botBestPath(st,c,NZ,rnd)||[]; if(!st.botPlan.length){ st.botPlan=null; passTurn(st,now); } return st; }
    const m=(st.botPlan||[]).shift(); const ok=m&&legalMoves(st,c).find(x=>x.from===m.from&&x.to===m.to&&x.die===m.die); if(!ok){ st.botPlan=null; passTurn(st,now); return st; }
    Object.assign(st,applyMove(st,c,ok)); st.trail=(st.trail||[]).concat([b2(c,ok.from),ok.to===24?-1:b2(c,ok.to)]);
    if(st.off[c]===15){ pushHist(st); finish(st,c,st.off[OPP(c)]===0); st.botPlan=null; return st; }
    if(!legalMoves(st,c).length){ st.botPlan=null; passTurn(st,now); } return st; }
  if(action==='join'){ if(st.p2 && st.p2!==uid && st.p1!==uid) err('full'); if(!st.p2 && st.p1!==uid){ st.p2=uid; } return st; }
  if(!me) err('not_player');
  if(action==='open_roll'){ if(st.phase!=='opening'||!st.p2) err('bad_phase'); if(st.open[me]) err('already'); st.open[me]=d6(); st.rollId++; resolveOpening(st,now); return st; }
  if(action==='rematch'){ if(st.phase!=='over') err('bad_phase'); st.rematch=st.rematch||{}; st.rematch[me]=true;
    if(st.rematch.p1&&st.rematch.p2){ const ng=newGame(st.p1,st.p2,st.score); ng.names=st.names; ng.avs=st.avs; ng.ratings=st.ratings; ng.frs=st.frs; ng.seq=st.seq; ng.rollId=st.rollId; return ng; } return st; }
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
  const R = full ? [50, 150] : (won ? [30, 50] : [5, 15]);   // a game with an opponent: 50–150 whatever the result; practice bots: small
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
// how a ghost plays: weaker players make more random moves (the engine at noise 0 is the strongest bot)
const ghostNoise = (sk: number) => sk < 800 ? 6 : sk < 950 ? 4 : sk < 1100 ? 2.5 : sk < 1250 ? 1.3 : sk < 1500 ? 0.6 : sk < 1900 ? 0.25 : 0;
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
async function tgOnUpdate(u: any) {
  const m = u?.message; if (!m || !m.chat || m.chat.type !== 'private') return;
  const L = TG_TXT[tgLang(m.from?.language_code)], text = String(m.text || '');
  const kb = { inline_keyboard: [[{ text: L.play, web_app: { url: SITE } }], [{ text: L.tour, web_app: { url: SITE + '?tour=1' } }],
    [{ text: L.invite, url: 'https://t.me/share/url?url=' + encodeURIComponent('https://t.me/dovgi_nardy_bot?startapp=go') + '&text=' + encodeURIComponent(L.inviteText) }]] };
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
async function tourPut(db: any, path: string, body: string) { const r = await db.storage.from('srv').upload(path, new Blob([body], { type: 'application/json' }), { upsert: false }); return !r.error; }
async function tourWrite(db: any, eid: string, mid: string, r: any) {
  const ok = await tourPut(db, 'tour/' + eid + '/l_' + mid, JSON.stringify(r)); if (!ok) return false;
  await tourPut(db, 'tour/' + eid + '/x_' + mid + '_' + r.w + '_' + (r.mars ? 1 : 0) + '_' + Math.round(r.at) + '_' + r.how, '{}'); return true;
}
async function tourEnsureDraw(db: any, E: any) {
  let { draw, res, names } = await tourLoad(db, E.id); if (draw || Date.now() < E.gAt) return { draw, res, names };
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
      const m = [...C.gm, ...C.po].find((x: any) => x.id === d.mid); let r: any = null;
      if (d.kind === 'sim') r = TR.simResult(draw, m, d.at);
      else if (d.kind === 'botwin') r = { w: d.w, mars: false, at: now, how: 'noshow' };
      else if (d.kind === 'hvh') {
        const { data: g } = await db.from('games').select('state').eq('id', TR.gameIdOf(draw, m.id)).maybeSingle(); const st = g?.state; const A = draw.players[m.a].id;
        if (st && st.phase === 'over' && st.result) { const wu = st[st.result.winner]; r = { w: wu === A ? 'a' : 'b', mars: !!st.result.mars, at: now, how: 'play' }; }
        else if (d.noshow && st && !st.p2) r = { w: st.p1 === A ? 'a' : 'b', mars: false, at: now, how: 'noshow' };
        else if ((d.hard && !st) || d.late) r = { ...TR.simResult(draw, m, now), how: 'sim' };
      }
      if (r && await tourWrite(db, E.id, m.id, r)) { res[m.id] = r; wrote = true; }
    }
    if (!wrote) break; C = TR.tourCompute(draw, res, Date.now());
  }
  if (C.done && !names.includes('paid')) {
    const all = [...C.gm, ...C.po];
    if (await tourPut(db, 'tour/' + E.id + '/paid', '{}')) {
      for (let i = 0; i < 16; i++) { const P = draw.players[i]; if (P.bot) continue; const pl = C.places[i], prize = TR.PRIZE(pl), pts = TR.TPTS(pl, TR.winsOf(all, res, i));
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
  const mm = String(gid || '').match(/^t(\d{6})((?:g\d\d)|(?:qf\d)|(?:sf\d)|f0|th0)$/); if (!mm) return null;
  const E = TR.tourEvent(Date.now()); if (!E || E.id !== mm[1]) return 'tour_closed';
  const { draw, res } = await tourLoad(db, E.id); if (!draw) return 'tour_closed';
  const C = TR.tourCompute(draw, res, Date.now()); const m = [...C.gm, ...C.po].find((x: any) => x.id === mm[2]);
  if (!m || m.a == null || m.b == null || draw.players[m.a].bot || draw.players[m.b].bot) return 'bad_match';
  if (draw.players[m.a].id !== uid && draw.players[m.b].id !== uid) return 'not_yours';
  if (res[m.id] || Date.now() < m.av - 60e3) return 'tour_closed';
  return null;
}
function tourView(E: any, draw: any, res: any, C: any) {
  const pub = (m: any) => ({ id: m.id, st: m.st, G: m.G, k: m.k, rd: m.rd, a: m.a, b: m.b, av: m.av === Infinity ? null : m.av, hard: m.hard === Infinity ? null : m.hard, r: res[m.id] || null, gid: draw && m.a != null && m.b != null && !draw.players[m.a].bot && !draw.players[m.b].bot ? TR.gameIdOf(draw, m.id) : null });
  return { ev: { id: E.id, gAt: E.gAt, pAt: E.pAt, moved: E.moved }, now: Date.now(), phase: C ? C.phase : 'pre', season: draw ? draw.season : tourSeason(E.gAt - 864e5),
    players: draw ? draw.players.map((p: any) => ({ id: p.id, bot: p.bot, name: p.name, full: p.full, av: p.av, r: p.r })) : null,
    gm: C ? C.gm.map(pub) : null, po: C ? C.po.map(pub) : null, places: C ? C.places : null };
}

// ---- weekly leagues: Bronze → Silver → Gold → Diamond. Groups of 20 (free places = league bots whose points grow
// through the week). Points: a full game 1, a win 3, a mars win 4. Week = Monday 00:00 → Sunday 24:00 (Kyiv).
// At the end: top 5 go up, bottom 5 go down; prizes for places 1–5. Group files live in storage: srv/league/<wk>/<g>.json.
const LG_EPOCH = Date.UTC(2026, 10, 8, 22, 0), LG_WEEK = 7 * 864e5, LG_N = 20, LG_TIERS = 4;
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
const LG_ON = false;   // weekly leagues are switched off (8.11.2026)
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
      try { await tgOnUpdate(body0); } catch (_) {} return json({ ok: true });
    }
    // public: the VAPID public key, and the reminder tick (called every few minutes by a scheduled GitHub Action)
    if (body0.action === 'tour_state') {
      const E = TR.tourEvent(Date.now()); if (!E) return json({ ev: null });
      const { draw, res, C } = await tourTick(db, E); return json(tourView(E, draw, res, C));
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
      const ev = pushEvents(Date.now()); if (!ev.length) return json({ ok: true, events: 0 });
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
    if (body0.action === 'tg_login' || body0.action === 'tg_widget') {
      const tu = body0.action === 'tg_login' ? await tgVerify(String(body0.args?.initData || '')) : await tgWidgetVerify(body0.args?.data);
      if (!tu || !tu.id) return json({ error: body0.action === 'tg_widget' && !(globalThis as any).Deno?.env.get('TG_BOT_TOKEN') ? 'tg_off' : 'tg_bad' }, 401);
      const r = await tgSession(db, tu); return r ? json(r) : json({ error: 'tg_link' }, 500);
    }
    const { data: { user } } = await db.auth.getUser(token); if (!user) return json({ error: 'auth' }, 401);
    const { action, gameId, args } = body0;
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
      const A = { ...(p.ach || {}) }; const day = kyivDay();
      // where the player plays from: tg = Telegram Mini App, app = the site installed as an app, web = browser
      const plat = ['tg', 'app', 'web'].includes(args?.plat) ? args.plat : 'web', pf = plat + 'd';
      if (!(A.days || []).includes(day) || !(A[pf] || []).includes(day) || A.plat !== plat) { markDay(A, 'days', day); markDay(A, pf, day); A.plat = plat; await db.from('profiles').update({ ach: A }).eq('id', user.id); }
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
        const per: any = {}; days.forEach((d) => per[d] = { d, newReg: 0, newGuest: 0, actReg: 0, actGuest: 0, hum: 0, bot: 0, tg: 0, web: 0, app: 0, newTg: 0 });
        const reg = users.filter((u) => !u.is_anonymous), guests = users.filter((u) => u.is_anonymous);
        const isTgMail = (u: any) => /^tg-\d+@telegram\.invalid$/.test(u.email || '');
        users.forEach((u) => { const d = kyivDay(new Date(u.created_at).getTime()); if (per[d]) { per[d][u.is_anonymous ? 'newGuest' : 'newReg']++; if (isTgMail(u)) per[d].newTg++; } });
        const tgIds = new Set(users.filter(isTgMail).map((u) => u.id)), tgReg = tgIds.size; let tgLinked = 0; const wk = days.slice(-7); const pl7: any = { tg: new Set(), web: new Set(), app: new Set() };
        let coins = 0, tut = 0, treg = 0, refBy = 0, calib = 0, played = 0; const rich: any[] = [];
        const anon = new Set(guests.map((u) => u.id));
        (profs || []).forEach((r: any) => { const A = r.ach || {}; const g = anon.has(r.id);
          (A.days || []).forEach((d: string) => { if (per[d]) per[d][g ? 'actGuest' : 'actReg']++; });
          (A.gd || []).forEach((e: any) => { if (per[e.d]) { per[e.d].hum += e.h || 0; per[e.d].bot += e.b || 0; } });
          for (const k of ['tg', 'web', 'app']) (A[k + 'd'] || []).forEach((d: string) => { if (per[d]) per[d][k]++; if (wk.includes(d)) pl7[k].add(r.id); });
          if (A.tg && !g && !tgIds.has(r.id)) tgLinked++;
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
          plat: { tgReg, tgLinked, today: { tg: per[today].tg, web: per[today].web, app: per[today].app }, d7: { tg: pl7.tg.size, web: pl7.web.size, app: pl7.app.size }, newTg7: sum('newTg', 7) },
          ret: { d1: c1 ? Math.round(r1 / c1 * 100) : null, d1n: c1, d7: c7 ? Math.round(r7 / c7 * 100) : null, d7n: c7 },
          rich: rich.sort((a, b) => b.coins - a.coins).slice(0, 5) });
      }
      if (op === 'find') {
        const q = String(args?.q || '').trim().slice(0, 24); if (q.length < 2) return json({ rows: [] });
        const { data } = await db.from('profiles').select('id,name,av,rating,rgames,played,won,ach').ilike('name', '%' + q.replace(/[%_]/g, '') + '%').limit(20);
        return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, rgames: r.rgames, played: r.played, won: r.won, coins: r.ach?.coins ?? COIN_START, last: (r.ach?.days || []).slice(-1)[0] || null, plat: r.ach?.plat || null, tg: !!r.ach?.tg, treg: r.ach?.treg || null, refN: r.ach?.refN || 0 })) });
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
    if (action === 'puzzle') {
      const { data: p } = await db.from('profiles').select('ach').eq('id', user.id).maybeSingle(); if (!p) return json({ error: 'no_profile' }, 400);
      const A = { ...(p.ach || {}) }; const P = { ...(A.pz || {}) }; const today = kyivDay(), y = kyivDay(Date.now() - 864e5);
      const res = ['best', 'good', 'miss'].includes(args?.res) ? args.res : 'miss';
      if (P.day === today) return json({ ok: true, got: 0, pz: P, coins: A.coins ?? COIN_START });
      P.streak = res === 'miss' ? 0 : (P.last === y ? (P.streak || 0) + 1 : 1); if (res !== 'miss') P.last = today; P.day = today; P.res = res;
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
      if (!m || m.a == null || m.b == null) return json({ error: 'bad_match' }, 400); if (res[m.id]) return json({ ok: true, already: true, r: res[m.id] });
      const meA = draw.players[m.a].id === user.id, meB = draw.players[m.b].id === user.id; if (!meA && !meB) return json({ error: 'not_yours' }, 403);
      if (!(meA ? draw.players[m.b].bot : draw.players[m.a].bot)) return json({ error: 'online_match' }, 400);
      const now = Date.now(); if (now < m.av - 60e3 || now > m.hard + TR.GRACE) return json({ error: 'closed' }, 400);
      const won = !!args?.won; const r = { w: (won === meA) ? 'a' : 'b', mars: !!args?.mars, at: now, how: 'play' };
      await tourWrite(db, E.id, m.id, r); return json({ ok: true, r });
    }
    if (action === 'tour_table') {
      const { data } = await db.from('profiles').select('id,name,av,rating,played,won,ach').not('ach->tourAt', 'is', null).limit(1000);
      return json({ rows: (data || []).map((r: any) => ({ id: r.id, name: r.name, av: r.av, rating: r.rating, played: r.played, won: r.won, tp: (r.ach?.tp || []).slice(-30) })) });
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
      A.push = L.length ? L : null; if (args?.lang) A.lang = args.lang === 'en' ? 'en' : 'uk'; if (args?.beta != null) A.beta = !!args.beta;
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
        // calibration (like Dota / CS): 10 games against people (or matchmaking opponents), a hidden rating with a big step (Elo, K = 160)
        // that depends a lot on whom you beat; matchmaking uses it, so winning brings stronger opponents. After game 10 it becomes your rating.
        // Practice bots do not count while calibrating.
        let calSkip = false;
        if (rg < CALIB) { if (!fullGame) { calSkip = true; d[s] = 0; }
          else { const cal = { g: 0, w: 0, mars: 0, ...(ach.A.cal || {}) }; if (cal.m == null) cal.m = Math.max(1000, Math.min(CAL_MAX, 1000 + cal.w * 90 - (cal.g - cal.w) * 30));
            cal.g++; if (won) { cal.w++; if (st.result.mars) cal.mars++; } cal.best = won ? Math.max(cal.best || 0, opR) : (cal.best || 0);
            { const E = 1 / (1 + Math.pow(10, (opR - cal.m) / 400)); let dm = 160 * ((won ? 1 : 0) - E); if (won && st.result.mars) dm *= 1.2;   // classic Elo, K = 160: whom you beat matters a lot
              cal.m = Math.max(1000, Math.min(CAL_MAX, Math.round(cal.m + dm))); }
            ach.A.cal = cal; d[s] = rg + 1 >= CALIB ? cal.m - myR : 0; } }
        const dayN = ((ach.A.gd || []).find((x: any) => x.d === kyivDay()) || { h: 0, b: 0 }); const nToday = (dayN.h || 0) + (dayN.b || 0);
        const gc = gameCoins(won, fullGame && nToday < 20, !!st.result.mars); if (fullGame && nToday >= 10 && nToday < 20) gc.coins = Math.round(gc.coins / 2); ach.A.coins = (ach.A.coins ?? COIN_START) + gc.coins; coinsPaid[s] = gc; markGame(ach.A, !vsBot); questTick(ach.A, { game: 1, win: won ? 1 : 0, human: fullGame ? 1 : 0, mars: won && st.result.mars ? 1 : 0 });
        if (!calSkip && rg + 1 >= CALIB) ach.A.peak = Math.max(ach.A.peak || 0, Math.max(100, myR + d[s]));   // the best rating reached: unlocks rank frames
        { const os = s === 'p1' ? 'p2' : 'p1', cal = !calSkip && rg + 1 >= CALIB;   // the last 20 games for the profile (any device): opponent, result, rating change
          ach.A.rh = [...(Array.isArray(ach.A.rh) ? ach.A.rh : []), { t: Date.now(), o: String(st.names?.[os] || '').slice(0, 20), oa: String(st.avs?.[os] || '').slice(0, 8), w: won ? 1 : 0, m: st.result.mars ? 1 : 0, d: cal ? d[s] : 0, r: cal ? Math.max(100, myR + d[s]) : 0, b: vsBot && st.ghost == null ? 1 : 0 }].slice(-20); }
        if (fullGame && LG_ON) await lgAdd(db, id, ach.A, p?.name || '', p?.av || '', won ? (st.result.mars ? 4 : 3) : 1);
        await db.from('profiles').update({ rating: Math.max(100, myR + d[s]), rgames: (p?.rgames ?? 0) + (calSkip ? 0 : 1), played: (p?.played ?? 0) + 1, won: (p?.won ?? 0) + (won ? 1 : 0), ach: ach.A, updated_at: new Date().toISOString() }).eq('id', id);
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

    if (action === 'create' || action === 'join') { const ge = await tourGuard(db, gameId, user.id); if (ge) return json({ error: ge }, 403); }
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
      st.ratings = { p1: myR, p2: botR }; st.frs = { p1: me?.ach?.fr || 0, p2: 0 }; if (gh) { st.ghost = gh.id; st.botNoise = ghostNoise(gh.skill ?? gh.rating); }
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
        const me = await prof(user.id); st.names = { ...(st.names || {}), p2: me?.name ?? '' }; st.avs = { ...(st.avs || {}), p2: me?.av ?? '' }; st.ratings = { ...(st.ratings || {}), p2: me?.rating ?? 1000 }; st.frs = { ...(st.frs || {}), p2: me?.ach?.fr || 0 };
      }
      st.seq = (row.state.seq || 0) + 1;
      const r = await commit(gameId, row.updated_at, st);
      if (r === 'error') return json({ error: 'db' }, 500);
      if (r === 'ok') return json({ state: st });
    }
    return json({ error: 'busy' }, 409);
  } catch (e) { return json({ error: 'server', detail: String(e) }, 500); }
});
