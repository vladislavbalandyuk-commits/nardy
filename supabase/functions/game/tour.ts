// @ts-nocheck
// Weekend tournament, run by the server: one shared bracket for everyone.
// 16 players (the signed-up players first, free places filled by tournament bots), 4 groups of 4,
// one game against each group opponent, the top two go to the play-off (quarter-finals, semi-finals, final, 3rd place).
// Pure functions only: the edge function stores the draw and the results and calls tourCompute to see what is due.

export const MIN = 60e3;
const KYIV = 2 * 3600e3;
const RR = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];   // round robin of 4: three rounds of two pairs
export const G_ROUND = 35 * MIN, G_LEN = 120 * MIN, PO_STAGE = 35 * MIN, NOSHOW = 10 * MIN, GRACE = 10 * MIN;
export const PRIZE = (pl: number) => pl === 1 ? 4000 : pl === 2 ? 2500 : pl === 3 ? 1500 : pl === 4 ? 1000 : pl <= 8 ? 250 : 0;
// CS format: a 25 000 pool
export const PRIZE_CS = (pl: number) => pl === 1 ? 9500 : pl === 2 ? 5600 : pl === 3 ? 3350 : pl === 4 ? 2400 : pl <= 6 ? 900 : pl <= 8 ? 500 : pl <= 11 ? 300 : pl <= 14 ? 150 : 0;   // 25 000; 9–11 = 2–3, 12–14 = 1–3 in the Swiss stage
// season points in the CS format (like a ranking: every stage reached is worth something) + 5 per match won
export const TPTS_CS = (pl: number, wins: number) => (pl === 1 ? 300 : pl === 2 ? 220 : pl === 3 ? 160 : pl === 4 ? 130 : pl <= 6 ? 100 : pl <= 8 ? 80 : pl <= 11 ? 50 : pl <= 14 ? 30 : 15) + 5 * Math.min(20, wins);
export const TPTS = (pl: number, wins: number) => 10 + Math.min(15, wins) * 5 + (pl === 1 ? 100 : pl === 2 ? 60 : pl <= 4 ? 40 : pl <= 8 ? 20 : 0);

// ---- schedule: groups on Saturday 18:00, play-off on Sunday 18:00 (Kyiv); single weekends can be moved ----
// key: the Saturday of that weekend (Kyiv date) → { g: groups start, p: play-off start } as Kyiv "YYYY-MM-DDTHH:MM"
export const TOUR_MOVED: any = { '2026-11-07': { g: '2026-11-08T14:00', p: '2026-11-08T16:00', moved: 1 } };
const kyivTs = (s: string) => Date.parse(s + ':00Z') - KYIV;
// from this weekend on: the CS format — Saturday 14:00 a Swiss stage, Sunday 14:00 a double-elimination play-off
export const CS_FROM = '2026-11-14';
// the weekend whose tournament is next or still running at `now`
export function tourEvent(now: number) {
  for (let w = -1; w <= 1; w++) {
    const k = new Date(now + KYIV + w * 7 * 864e5); const dow = k.getUTCDay();
    const sat = new Date(Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() + ((6 - dow + 7) % 7) - (dow === 0 ? 7 : 0)));
    const key = sat.toISOString().slice(0, 10); const mv = TOUR_MOVED[key], cs = key >= CS_FROM;
    const gAt = mv ? kyivTs(mv.g) : Date.UTC(sat.getUTCFullYear(), sat.getUTCMonth(), sat.getUTCDate(), cs ? 14 : 18) - KYIV;
    const pAt = mv ? kyivTs(mv.p) : gAt + 864e5;
    const end = pAt + (cs ? 11 * 60 : 150) * MIN;
    if (now < end) return { id: key.replace(/-/g, '').slice(2), sat: key, gAt, pAt, end, moved: !!(mv && mv.moved), fmt: cs ? 'cs' : 'g' };
  }
  return null;
}

// ---- small seeded random ----
export function hash(s: string) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
export function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const botRating = (id: string) => 2550 + (hash(id) % 1100);

// ---- the draw: signed-up players by sign-up time (up to 16), then bots tb<season>_0, _1, … ----
export function tourDraw(ev: any, season: number, reals: any[]) {
  if (ev.fmt === 'cs') return csDraw(ev, season, reals);
  const R = reals.slice().sort((x, y) => (x.at || 0) - (y.at || 0)).slice(0, 16)
    .map((p) => ({ id: p.id, bot: false, name: p.nick || p.name || '', full: p.full || '', av: p.av || '', r: p.r || 1000 }));
  const bots: any[] = []; for (let i = 0; R.length + bots.length < 16; i++) { const id = 'tb' + season + '_' + i; bots.push({ id, bot: true, name: '', full: '', av: '', r: botRating(id) }); }
  const all = R.concat(bots).sort((x, y) => y.r - x.r || (x.id < y.id ? -1 : 1));
  const rn = rng(hash('draw' + ev.id)); const groups: any[][] = [[], [], [], []];
  for (let pot = 0; pot < 4; pot++) { const P = all.slice(pot * 4, pot * 4 + 4); for (let i = P.length - 1; i > 0; i--) { const j = Math.floor(rn() * (i + 1)); [P[i], P[j]] = [P[j], P[i]]; } P.forEach((p, G) => groups[G].push(p)); }
  return { ev: ev.id, season, gAt: ev.gAt, pAt: ev.pAt, at: Date.now(), players: [].concat(...groups) };
}

// ---- matches of the bracket (indices into draw.players) ----
export function tourMatches(draw: any) {
  const gm = []; for (let G = 0; G < 4; G++) RR.forEach(([x, y], k) => gm.push({ id: 'g' + G + k, st: 'g', G, k, rd: Math.floor(k / 2), a: G * 4 + x, b: G * 4 + y }));
  const po = [0, 1, 2, 3].map((k) => ({ id: 'qf' + k, st: 'qf', k })).concat([0, 1].map((k) => ({ id: 'sf' + k, st: 'sf', k })), [{ id: 'f0', st: 'f', k: 0 }, { id: 'th0', st: '3', k: 0 }]);
  return { gm, po };
}
const isBot = (draw: any, i: number) => i == null || draw.players[i].bot;
export const gameIdOf = (draw: any, mid: string) => ('t' + draw.ev + mid).toLowerCase();

// group table: points = wins; ties by mars wins, head-to-head, rating
export function groupTable(draw: any, gm: any[], res: any, G: number) {
  const ids = [0, 1, 2, 3].map((x) => G * 4 + x); const M = gm.filter((m) => m.G === G);
  const row = (i: number) => { let pts = 0, mars = 0, gp = 0; M.forEach((m) => { const r = res[m.id]; if (!r || (m.a !== i && m.b !== i)) return; gp++; const mine = (r.w === 'a') === (m.a === i); if (mine) { pts++; if (r.mars) mars++; } }); return { i, pts, mars, gp }; };
  const h2h = (x: number, y: number) => { const m = M.find((m) => (m.a === x && m.b === y) || (m.a === y && m.b === x)); const r = m && res[m.id]; if (!r) return 0; return ((r.w === 'a') === (m.a === x)) ? 1 : -1; };
  return ids.map(row).sort((p, q) => q.pts - p.pts || q.mars - p.mars || h2h(q.i, p.i) || draw.players[q.i].r - draw.players[p.i].r);
}

// Everything about the bracket at `now`: who plays whom, when each match is open, and what the server should resolve.
// res: { [matchId]: { w:'a'|'b', mars, at, how } }
export function tourCompute(draw: any, res: any, now: number) {
  if (draw.fmt === 'cs') return csCompute(draw, res, now);
  const C = tourComputeV1(draw, res, now); const all = [...C.gm, ...C.po]; C.wins = draw.players.map((_: any, i: number) => winsOf(all, res, i)); return C; }
function tourComputeV1(draw: any, res: any, now: number) {
  const { gm, po } = tourMatches(draw); const gAt = draw.gAt, pAt = draw.pAt, gHard = gAt + G_LEN;
  const due: any[] = []; const doneAt = (m: any) => res[m.id] ? res[m.id].at : Infinity;
  // group stage: a round opens at its time, or earlier as soon as both players have finished their previous game
  for (const m of gm) {
    const open = gAt + m.rd * G_ROUND; let av = open;
    if (m.rd > 0) { const prev = (i: number) => doneAt(gm.find((x) => x.rd === m.rd - 1 && (x.a === i || x.b === i))); const e = Math.max(prev(m.a), prev(m.b), gAt); if (e < open) av = e; }
    m.av = av; m.hard = gHard;
  }
  const groupsDone = gm.every((m) => res[m.id]); const gDoneAt = groupsDone ? Math.max(...gm.map(doneAt)) : Infinity;
  const tables = [0, 1, 2, 3].map((G) => groupTable(draw, gm, res, G));
  const q = (G: number, pl: number) => groupsDone ? tables[G][pl].i : null;
  const W = (m: any) => res[m.id] ? (res[m.id].w === 'a' ? m.a : m.b) : null, L = (m: any) => res[m.id] ? (res[m.id].w === 'a' ? m.b : m.a) : null;
  const QF = [[q(0, 0), q(1, 1)], [q(1, 0), q(0, 1)], [q(2, 0), q(3, 1)], [q(3, 0), q(2, 1)]];
  po.forEach((m) => { if (m.st === 'qf') { [m.a, m.b] = QF[m.k]; m.feed = gDoneAt; } });
  const qf = po.filter((m) => m.st === 'qf'), sf = po.filter((m) => m.st === 'sf');
  const fdone = (L2: any[]) => L2.every((x) => res[x.id]) ? Math.max(...L2.map(doneAt)) : Infinity;
  sf[0].a = W(qf[0]); sf[0].b = W(qf[2]); sf[0].feed = fdone([qf[0], qf[2]]);
  sf[1].a = W(qf[1]); sf[1].b = W(qf[3]); sf[1].feed = fdone([qf[1], qf[3]]);
  const f = po.find((m) => m.st === 'f'), th = po.find((m) => m.st === '3');
  f.a = W(sf[0]); f.b = W(sf[1]); th.a = L(sf[0]); th.b = L(sf[1]); f.feed = th.feed = fdone(sf);
  po.forEach((m) => { m.av = m.feed === Infinity ? Infinity : Math.max(pAt, m.feed); m.hard = m.av + PO_STAGE; });
  // what is due now
  for (const m of [...gm, ...po]) {
    if (res[m.id] || m.a == null || m.b == null || !(now >= m.av)) continue;
    const ba = isBot(draw, m.a), bb = isBot(draw, m.b);
    if (ba && bb) { const at = m.av + (4 + (hash(draw.ev + m.id) % 24)) * MIN; if (now >= Math.min(at, m.hard)) due.push({ mid: m.id, kind: 'sim', at: Math.min(at, m.hard) }); }
    else if (!ba && !bb) due.push({ mid: m.id, kind: 'hvh', noshow: now >= m.av + NOSHOW, hard: now >= m.hard, late: now >= m.hard + GRACE });
    else if (now >= m.hard) due.push({ mid: m.id, kind: 'botwin', w: ba ? 'a' : 'b' });
  }
  const all = [...gm, ...po]; const done = all.every((m) => res[m.id]);
  let places = null;
  if (done) {
    places = new Array(16).fill(0); places[W(f)] = 1; places[L(f)] = 2; places[W(th)] = 3; places[L(th)] = 4;
    const ptsOf = (i: number) => { const G = Math.floor(i / 4); const r = tables[G].find((x) => x.i === i); return r ? r.pts : 0; };
    qf.map(L).sort((x, y) => ptsOf(y) - ptsOf(x) || draw.players[y].r - draw.players[x].r).forEach((i, k) => places[i] = 5 + k);
    tables.flatMap((tb) => tb.slice(2).map((r) => r.i)).sort((x, y) => ptsOf(y) - ptsOf(x) || draw.players[y].r - draw.players[x].r).forEach((i, k) => places[i] = 9 + k);
  }
  const phase = now < gAt ? 'pre' : !groupsDone ? 'groups' : !done ? 'po' : 'done';
  return { gm, po, tables, due, phase, places, done };
}

// a simulated result (bots, or two players who both did not come): the higher rating wins more often
export function simResult(draw: any, m: any, at: number) {
  const A = draw.players[m.a], B = draw.players[m.b]; const pa = 1 / (1 + Math.pow(10, (B.r - A.r) / 400));
  const rn = rng(hash('sim' + draw.ev + m.id)); return { w: rn() < pa ? 'a' : 'b', mars: rn() < 0.15, at, how: 'sim' };
}
export function winsOf(all: any[], res: any, i: number) { return all.filter((m) => res[m.id] && (m.a === i || m.b === i) && ((res[m.id].w === 'a') === (m.a === i))).length; }


// =====================================================================================================================
// CS format (from CS_FROM). 16 players.
// Saturday — Swiss stage: every round pairs players with the same record (wins–losses); 3 wins → play-off, 3 losses → out.
//   Bo1, but matches for going through or going out (a player on 2 wins or 2 losses) are Bo3. At most 5 rounds, 8 go through.
// Sunday — double-elimination play-off of 8: upper bracket (quarter-finals, semi-finals, final), a loss drops you to the
//   lower bracket; one more loss and you are out. All Bo3, the grand final Bo5.
// Results are kept per game (key = match id + 'n' + game number), a series is decided by them.
// =====================================================================================================================
export const SW1 = 35 * MIN, SW3 = 80 * MIN, PO3 = 80 * MIN, PO5 = 130 * MIN;
export const gameKey = (mid: string, n: number) => mid + 'n' + n;
function csDraw(ev: any, season: number, reals: any[]) {
  const R = reals.slice().sort((x, y) => (x.at || 0) - (y.at || 0)).slice(0, 16)
    .map((p) => ({ id: p.id, bot: false, name: p.nick || p.name || '', full: p.full || '', av: p.av || '', r: p.r || 1000 }));
  const bots: any[] = []; for (let i = 0; R.length + bots.length < 16; i++) { const id = 'tb' + season + '_' + i; bots.push({ id, bot: true, name: '', full: '', av: '', r: botRating(id) }); }
  // seeds by rating (ties broken by a seeded shuffle so equal ratings are not ordered by id)
  const rn = rng(hash('draw' + ev.id)); const all = R.concat(bots).map((p) => ({ p, k: rn() })).sort((x, y) => y.p.r - x.p.r || x.k - y.k).map((x) => x.p);
  return { fmt: 'cs', ev: ev.id, season, gAt: ev.gAt, pAt: ev.pAt, at: Date.now(), players: all };
}
// a series: games one after another; game n opens when game n-1 is over
function csSeries(m: any, res: any) {
  const need = (m.bo + 1) / 2; let wa = 0, wb = 0, last: any = null; m.g = []; m.cur = null;
  for (let n = 1; n <= m.bo && wa < need && wb < need; n++) {
    const key = gameKey(m.id, n), r = res[key], av = n === 1 ? m.av : (last ? last.at : Infinity);
    m.g.push({ n, key, r: r || null, av });
    if (!r) { if (m.a != null && m.b != null && av !== Infinity) m.cur = { n, key, av }; break; }
    if (r.w === 'a') wa++; else wb++; last = r;
  }
  m.sa = wa; m.sb = wb;
  m.r = (wa >= need || wb >= need) ? { w: wa >= need ? 'a' : 'b', sa: wa, sb: wb, at: last.at, how: last.how, mars: !!last.mars } : null;
  return m;
}
export function csCompute(draw: any, res: any, now: number) {
  const P = draw.players, N = P.length, gAt = draw.gAt, pAt = draw.pAt;
  const rec = P.map(() => ({ w: 0, l: 0, opp: [] as number[] }));
  const sw: any[] = []; let prevDone = gAt, swDone = false;
  const doneAt = (m: any) => m.r ? m.r.at : Infinity;
  for (let rd = 1; rd <= 5; rd++) {
    const act = P.map((_: any, i: number) => i).filter((i: number) => rec[i].w < 3 && rec[i].l < 3);
    if (!act.length) { swDone = true; break; }
    const buckets: any = {}; act.forEach((i: number) => { const k = rec[i].w + '-' + rec[i].l; (buckets[k] ||= []).push(i); });
    const keys = Object.keys(buckets).sort((x, y) => (+y[0] - +x[0]) || (+x[2] - +y[2]));
    const pairs: number[][] = [];
    for (const k of keys) {
      const L = buckets[k].slice().sort((x: number, y: number) => x - y);
      if (rd === 1) { const h = L.length / 2; for (let i = 0; i < h; i++) pairs.push([L[i], L[i + h]]); continue; }
      while (L.length > 1) { const x = L.shift(); let j = L.length - 1; while (j >= 0 && rec[x].opp.includes(L[j])) j--; if (j < 0) j = L.length - 1; const y = L.splice(j, 1)[0]; pairs.push([x, y]); }
    }
    const ms = pairs.map(([a, b], k) => { const bo = (rec[a].w === 2 || rec[a].l === 2) ? 3 : 1; const av = Math.max(gAt, prevDone);
      return csSeries({ id: 's' + rd + k, st: 'sw', rd, k, a, b, bo, av, hard: av + (bo === 1 ? SW1 : SW3), rec: rec[a].w + '-' + rec[a].l }, res); });
    sw.push(...ms);
    if (!ms.every((m) => m.r)) break;
    ms.forEach((m) => { const W = m.r.w === 'a' ? m.a : m.b, L2 = m.r.w === 'a' ? m.b : m.a; rec[W].w++; rec[L2].l++; rec[m.a].opp.push(m.b); rec[m.b].opp.push(m.a); });
    prevDone = Math.max(prevDone, ...ms.map(doneAt));
    if (P.every((_: any, i: number) => rec[i].w >= 3 || rec[i].l >= 3)) { swDone = true; break; }
  }
  // play-off seeds: 3–0 first, then 3–1, then 3–2; within a record by the starting seed
  const q = swDone ? P.map((_: any, i: number) => i).filter((i: number) => rec[i].w >= 3).sort((x: number, y: number) => rec[x].l - rec[y].l || x - y) : null;
  const po: any[] = [];
  const mk = (id: string, st: string, k: number, bo: number) => { const m = { id, st, k, bo, a: null as any, b: null as any, av: Infinity, hard: Infinity }; po.push(m); return m; };
  const uq = [0, 1, 2, 3].map((k) => mk('uq' + k, 'uq', k, 3)), us = [0, 1].map((k) => mk('us' + k, 'us', k, 3)), l1 = [0, 1].map((k) => mk('l1' + k, 'l1', k, 3)), l2 = [0, 1].map((k) => mk('l2' + k, 'l2', k, 3));
  const uf = mk('uf0', 'uf', 0, 3), ls = mk('ls0', 'ls', 0, 3), lf = mk('lf0', 'lf', 0, 3), gf = mk('gf0', 'gf', 0, 5);
  const W = (m: any) => m.r ? (m.r.w === 'a' ? m.a : m.b) : null, L = (m: any) => m.r ? (m.r.w === 'a' ? m.b : m.a) : null;
  const feed = (m: any, a: any, b: any, from: any[]) => { m.a = a; m.b = b; if (a != null && b != null) { const t = Math.max(pAt, ...from.map(doneAt)); m.av = t; m.hard = t + (m.bo === 5 ? PO5 : PO3); } csSeries(m, res); };
  const swEnd = swDone ? Math.max(gAt, ...sw.map(doneAt)) : Infinity;
  [[0, 7], [3, 4], [1, 6], [2, 5]].forEach(([x, y], k) => { const m = uq[k]; if (q) { m.a = q[x]; m.b = q[y]; m.av = Math.max(pAt, swEnd); m.hard = m.av + PO3; } csSeries(m, res); });
  feed(us[0], W(uq[0]), W(uq[1]), [uq[0], uq[1]]); feed(us[1], W(uq[2]), W(uq[3]), [uq[2], uq[3]]);
  feed(l1[0], L(uq[0]), L(uq[1]), [uq[0], uq[1]]); feed(l1[1], L(uq[2]), L(uq[3]), [uq[2], uq[3]]);
  feed(l2[0], W(l1[0]), L(us[1]), [l1[0], us[1]]); feed(l2[1], W(l1[1]), L(us[0]), [l1[1], us[0]]);   // crossed, so nobody meets the same player again at once
  feed(uf, W(us[0]), W(us[1]), [us[0], us[1]]); feed(ls, W(l2[0]), W(l2[1]), [l2[0], l2[1]]);
  feed(lf, W(ls), L(uf), [ls, uf]); feed(gf, W(uf), W(lf), [uf, lf]);
  // what is due now, game by game
  const due: any[] = [];
  for (const m of [...sw, ...po]) {
    const c = m.cur; if (!c || m.a == null || m.b == null || !(now >= c.av)) continue;
    const ba = P[m.a].bot, bb = P[m.b].bot;
    if (ba && bb) { const at = Math.min(c.av + (3 + (hash(draw.ev + c.key) % 12)) * MIN, m.hard); if (now >= at) due.push({ mid: m.id, key: c.key, kind: 'sim', at }); }
    else if (!ba && !bb) due.push({ mid: m.id, key: c.key, kind: 'hvh', noshow: now >= c.av + NOSHOW, hard: now >= m.hard, late: now >= m.hard + GRACE });
    else if (now >= m.hard) due.push({ mid: m.id, key: c.key, kind: 'botwin', w: ba ? 'a' : 'b' });
  }
  const done = !!gf.r;
  const wins = P.map((_: any, i: number) => [...sw, ...po].filter((m) => m.r && W(m) === i).length);
  let places: any = null;
  if (done) {
    places = new Array(N).fill(0); const by = (x: number, y: number) => rec[y].w - rec[x].w || rec[x].l - rec[y].l || x - y;
    places[W(gf)] = 1; places[L(gf)] = 2; places[L(lf)] = 3; places[L(ls)] = 4;
    [L(l2[0]), L(l2[1])].sort(by).forEach((i, k) => places[i] = 5 + k); [L(l1[0]), L(l1[1])].sort(by).forEach((i, k) => places[i] = 7 + k);
    P.map((_: any, i: number) => i).filter((i: number) => !places[i]).sort(by).forEach((i: number, k: number) => places[i] = 9 + k);
  }
  const phase = now < gAt ? 'pre' : !swDone ? 'groups' : !done ? 'po' : 'done';
  return { fmt: 'cs', gm: sw, po, rec: rec.map((r: any) => ({ w: r.w, l: r.l })), due, phase, places, done, wins, tables: [] };
}
// one simulated game of a series (bots, or two players who both did not come)
export function simGameCS(draw: any, m: any, key: string, at: number) {
  const A = draw.players[m.a], B = draw.players[m.b]; const pa = 1 / (1 + Math.pow(10, (B.r - A.r) / 400));
  const rn = rng(hash('sim' + draw.ev + key)); return { w: rn() < pa ? 'a' : 'b', mars: rn() < 0.15, at, how: 'sim' };
}
