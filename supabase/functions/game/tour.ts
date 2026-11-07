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
export const TPTS = (pl: number, wins: number) => 10 + Math.min(15, wins) * 5 + (pl === 1 ? 100 : pl === 2 ? 60 : pl <= 4 ? 40 : pl <= 8 ? 20 : 0);

// ---- schedule: groups on Saturday 18:00, play-off on Sunday 18:00 (Kyiv); single weekends can be moved ----
// key: the Saturday of that weekend (Kyiv date) → { g: groups start, p: play-off start } as Kyiv "YYYY-MM-DDTHH:MM"
export const TOUR_MOVED: any = { '2026-11-07': { g: '2026-11-08T14:00', p: '2026-11-08T16:00', moved: 1 } };
const kyivTs = (s: string) => Date.parse(s + ':00Z') - KYIV;
// the weekend whose tournament is next or still running at `now`
export function tourEvent(now: number) {
  for (let w = -1; w <= 1; w++) {
    const k = new Date(now + KYIV + w * 7 * 864e5); const dow = k.getUTCDay();
    const sat = new Date(Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() + ((6 - dow + 7) % 7) - (dow === 0 ? 7 : 0)));
    const key = sat.toISOString().slice(0, 10); const mv = TOUR_MOVED[key];
    const gAt = mv ? kyivTs(mv.g) : Date.UTC(sat.getUTCFullYear(), sat.getUTCMonth(), sat.getUTCDate(), 18) - KYIV;
    const pAt = mv ? kyivTs(mv.p) : gAt + 864e5;
    const end = pAt + 120 * MIN + 30 * MIN;
    if (now < end) return { id: key.replace(/-/g, '').slice(2), sat: key, gAt, pAt, end, moved: !!(mv && mv.moved) };
  }
  return null;
}

// ---- small seeded random ----
export function hash(s: string) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
export function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const botRating = (id: string) => 2550 + (hash(id) % 1100);

// ---- the draw: signed-up players by sign-up time (up to 16), then bots tb<season>_0, _1, … ----
export function tourDraw(ev: any, season: number, reals: any[]) {
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
