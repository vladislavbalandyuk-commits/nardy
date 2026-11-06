// @ts-nocheck
// Supabase Edge Function "game": the only writer of online games and ratings.
// Clients call it with { action, gameId, args }; it validates the move with the same rules as the client.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import CAT from './catalog.json' with { type: 'json' };
import { walletOp, gameReward, normalize, freshWallet, WalletError } from './wallet.ts';
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!, svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')!;
    const db = createClient(url, svc, { auth: { persistSession: false } });
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: { user } } = await db.auth.getUser(token); if (!user) return json({ error: 'auth' }, 401);
    const { action, gameId, args } = await req.json();
    if (action === 'ice') return json({ ice: await iceServers().catch(() => null) });
    // ---- wallet (beta): the server holds coins and items; optimistic lock on a version number ----
    const loadWallet = async (id: string) => { const { data } = await db.from('wallets').select('w,v').eq('uid', id).maybeSingle(); return data; };
    if (action === 'wallet') {
      for (let attempt = 0; attempt < 3; attempt++) {
        const row = await loadWallet(user.id), cur = row ? normalize(row.w, CAT) : freshWallet(CAT);
        let out; try { out = walletOp(cur, String(args?.op || 'get'), args || {}, CAT, Date.now(), Math.random); }
        catch (e) { if (e instanceof WalletError) return json({ error: e.code, wallet: cur }, 400); throw e; }
        if (!row) { const { error } = await db.from('wallets').insert({ uid: user.id, w: out.w, v: 1 }); if (error) continue; }
        else if (args?.op && args.op !== 'get') { const { data: upd } = await db.from('wallets').update({ w: out.w, v: row.v + 1, updated_at: new Date().toISOString() }).eq('uid', user.id).eq('v', row.v).select('uid'); if (!upd || !upd.length) continue; }
        return json({ wallet: out.w, res: out.res, got: out.got });
      }
      return json({ error: 'busy' }, 409);
    }
    const CALIB = 10, CALIB_PLACE = [1000, 1030, 1060, 1100, 1140, 1180, 1230, 1320, 1470, 1600, 1760];   // rating by wins out of 10: 0–5 Rookie, 6–7 Regular, 8–9 Expert, 10 Master
    const payWallet = async (id: string, key: string, won: boolean, full: boolean, mars = false) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const row = await loadWallet(id); if (!row) return null;   // only players who use the new wallet
        const r = gameReward(normalize(row.w, CAT), CAT, key, won, full, mars);
        const { data: upd } = await db.from('wallets').update({ w: r.w, v: row.v + 1, updated_at: new Date().toISOString() }).eq('uid', id).eq('v', row.v).select('uid');
        if (upd && upd.length) return { coins: r.coins, xp: r.xp, got: r.got, lucky: r.lucky };
      }
      return null;
    };
    if (typeof gameId !== 'string' || !/^[a-z0-9]{4,16}$/.test(gameId)) return json({ error: 'bad_id' }, 400);
    const prof = async (id: string) => (await db.from('profiles').select('name,av,rating,rgames,played,won,ach').eq('id', id).maybeSingle()).data;
    const ghostRow = async (gid: number) => (await db.from('ghosts').select('id,name,av,rating,played,won').eq('id', gid).maybeSingle()).data;

    // rating for a finished game; called only after the game row was saved with rated=true (so it runs once)
    const rate = async (st: any, gid: string) => {
      const vsBot = C.isBotId(st.p2), gh = vsBot && st.ghost != null ? await ghostRow(st.ghost) : null;
      const [a, b] = await Promise.all([prof(st.p1), vsBot ? Promise.resolve(null) : prof(st.p2)]);
      const oppR = vsBot ? (gh ? gh.rating : st.ratings.p2) : (b?.rating ?? 1000);
      const d = C.ratingChanges(st, a?.rating ?? 1000, oppR);
      const dGhost = d.p2;
      if (vsBot) { const f = (C.BOTS[st.p2.split(':')[1]] || C.BOTS.ghost).factor; d.p1 = Math.round(d.p1 * f); }
      const fresh: any = {};
      for (const [s, p] of (vsBot ? [['p1', a]] : [['p1', a], ['p2', b]]) as any) {
        const id = st[s]; const won = st.result.winner === s; const myR = p?.rating ?? 1000, opR = s === 'p1' ? oppR : (a?.rating ?? 1000);
        const ach = C.achUpdate(p?.ach, st, s, myR, opR); fresh[s] = ach.fresh;
        // calibration: the first CALIB rated games keep the rating hidden; after the last one it is set by how many were won
        const rg = p?.rgames ?? 0;
        if (rg < CALIB) { const cal = { g: 0, w: 0, ...(ach.A.cal || {}) }; cal.g++; if (won) cal.w++; ach.A.cal = cal;
          d[s] = rg + 1 >= CALIB ? CALIB_PLACE[Math.min(cal.w, CALIB)] - myR : 0; }
        await db.from('profiles').update({ rating: Math.max(100, myR + d[s]), rgames: (p?.rgames ?? 0) + 1, played: (p?.played ?? 0) + 1, won: (p?.won ?? 0) + (won ? 1 : 0), ach: ach.A, updated_at: new Date().toISOString() }).eq('id', id);
      }
      if (gh) { const gw = st.result.winner === 'p2'; await db.from('ghosts').update({ rating: Math.max(100, gh.rating + dGhost), played: gh.played + 1, won: gh.won + (gw ? 1 : 0), updated_at: new Date().toISOString() }).eq('id', gh.id); }
      // coins and pass XP for players on the server wallet
      const full = !vsBot || st.ghost != null || !!st.mbot, paid: any = {};
      for (const s of (vsBot ? ['p1'] : ['p1', 'p2'])) { const r = await payWallet(st[s], gid + ':' + (st.seq || 0), st.result.winner === s, full, !!st.result.mars).catch(() => null); if (r) paid[s] = r; }
      st.paid = paid;
      st.ratingDelta = d; st.achNew = fresh;
    };
    // save with an optimistic lock; if this save finishes the game, apply the rating once and store the result
    const commit = async (id: string, prevAt: string, st: any) => {
      const finishing = st.phase === 'over' && !st.rated; if (finishing) st.rated = true;
      const { data: upd, error } = await db.from('games').update({ p2: st.p2 && !C.isBotId(st.p2) ? st.p2 : null, state: st, updated_at: new Date().toISOString() }).eq('id', id).eq('updated_at', prevAt).select('id');
      if (error) return 'error'; if (!upd || !upd.length) return 'conflict';
      if (finishing) { await rate(st, id); await db.from('games').update({ state: st }).eq('id', id); }
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
      st.ratings = { p1: myR, p2: botR }; if (gh) st.ghost = gh.id; if (bot && !gh && args?.mb) st.mbot = true;
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
