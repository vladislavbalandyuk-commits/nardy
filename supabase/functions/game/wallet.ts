// Server-side wallet for the beta: coins, items, winter pass, cases, daily bonus.
// The client only asks; prices, odds and rewards come from catalog.json (exported from the client so they match).
// Pure functions — no database here — so they can be tested on their own.

// deno-lint-ignore-file no-explicit-any
export type Wallet = {
  coins: number; owned: string[]; pass: number; xp: number; streak: number; daily: string;
  casePity: number; pity: Record<string, number>; cases: number; claims: { day: string; n: number }; seasons: string[]; paid: string[];
};

export class WalletError extends Error { code: string; constructor(code: string) { super(code); this.code = code; } }
const fail = (code: string): never => { throw new WalletError(code); };

export function kyivDay(now: number): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
}

export function freshWallet(cat: any): Wallet {
  return { coins: cat.econ.start, owned: [], pass: 0, xp: 0, streak: 0, daily: '', casePity: 0, pity: {}, cases: 0, claims: { day: '', n: 0 }, seasons: [], paid: [] };
}

export function normalize(w: any, cat: any): Wallet {
  const f = freshWallet(cat), x = { ...f, ...(w || {}) };
  x.owned = Array.isArray(x.owned) ? x.owned.filter((s: any) => typeof s === 'string') : [];
  x.claims = x.claims && typeof x.claims === 'object' ? x.claims : f.claims;
  x.seasons = Array.isArray(x.seasons) ? x.seasons : []; x.pity = x.pity && typeof x.pity === 'object' ? x.pity : {}; x.paid = Array.isArray(x.paid) ? x.paid : [];
  return x;
}

const item = (cat: any, id: string) => cat.shop.find((x: any) => x.id === id);

function grantLevel(w: Wallet, cat: any, got: string[]) {
  const p = cat.pass[w.pass]; if (!p) return;
  if (p.coins) w.coins += p.coins; else if (!w.owned.includes(p.id)) { w.owned.push(p.id); got.push(p.id); }
  w.pass++; if (w.pass === cat.pass.length) w.xp = 0;
}

// largest single claim the client may report for each kind (quests and the daily puzzle are counted on the client)
const CLAIM_MAX: Record<string, number> = { quest: 200, pz: 60 };
const CLAIMS_PER_DAY = 700;

export function walletOp(w0: Wallet, op: string, args: any, cat: any, now: number, rnd: () => number) {
  const w: Wallet = structuredClone(w0), today = kyivDay(now), got: string[] = []; let res: any = {};
  switch (op) {
    case 'get': break;
    case 'buy': {
      const it = item(cat, String(args?.id)); if (!it) fail('bad_item'); if (it.pass || it.caseOnly || !(it.price > 0)) fail('not_for_sale');
      if (w.owned.includes(it.id)) break; if (w.coins < it.price) fail('no_coins');
      w.coins -= it.price; w.owned.push(it.id); got.push(it.id); break;
    }
    case 'set': {
      const s = cat.sets.find((x: any) => x.k === args?.k); if (!s) fail('bad_set');
      const full = s.items.reduce((a: number, i: string) => a + (item(cat, i)?.price || 0), 0);
      const left = s.items.filter((i: string) => !w.owned.includes(i)); if (!left.length) break;
      const rest = left.reduce((a: number, i: string) => a + (item(cat, i)?.price || 0), 0);
      const price = full ? Math.round(rest * s.base / full / 10) * 10 : 0; if (w.coins < price) fail('no_coins');
      w.coins -= price; left.forEach((i: string) => { w.owned.push(i); got.push(i); }); res.price = price; break;
    }
    case 'pass': {
      const n = Math.max(0, Math.min(Number(args?.n) | 0, cat.pass.length - w.pass)); if (!n) fail('pass_done');
      const cost = n * cat.passPrice; if (w.coins < cost) fail('no_coins');
      w.coins -= cost; for (let i = 0; i < n; i++) grantLevel(w, cat, got); break;
    }
    case 'case': {
      const kind = cat.cases && cat.cases[args?.kind] ? String(args.kind) : 'main', C = cat.cases ? cat.cases[kind] : cat.case; if (w.coins < C.price) fail('no_coins');
      const pity = kind === 'main' ? w.casePity : (w.pity[kind] || 0);
      const x = rnd(); let acc = 0, r = 'c'; for (const k of ['l', 'e', 'r', 'c']) { acc += C.odds[k]; if (x < acc) { r = k; break; } }
      if (pity >= C.pity - 1 && (r === 'c' || r === 'r')) r = 'e';
      const list = C.pool[r]; const id = list[Math.floor(rnd() * list.length)];
      const dup = w.owned.includes(id), refund = dup ? C.dupe[r] : 0;
      const np = (r === 'e' || r === 'l') ? 0 : pity + 1; if (kind === 'main') w.casePity = np; else w.pity = { ...w.pity, [kind]: np }; w.cases++;
      w.coins -= C.price;
      if (dup) w.coins += refund; else { w.owned.push(id); got.push(id); }
      res = { id, r, refund, kind }; break;
    }
    case 'daily': {
      if (w.daily === today) fail('daily_done');
      const y = kyivDay(now - 864e5); w.streak = w.daily === y ? (w.streak % 7) + 1 : 1; w.daily = today;
      const n = cat.streak[w.streak - 1]; w.coins += n; res = { n, streak: w.streak }; break;
    }
    case 'claim': {
      const kind = String(args?.kind), n = Math.floor(Number(args?.n) || 0);
      if (kind === 'season') {
        const id = String(args?.season || ''); const max = cat.season[0][1];
        if (!/^\d{4}-\d{2}$/.test(id) || id >= today.slice(0, 7) || w.seasons.includes(id) || n <= 0 || n > max) fail('bad_claim');
        w.seasons.push(id); w.coins += n;
        const prize = cat.season.find((p: any) => p[1] === n); if (prize && Array.isArray(prize[3])) for (const it of prize[3]) if (!w.owned.includes(it)) { w.owned.push(it); got.push(it); }
        res = { n }; break;
      }
      const cap = CLAIM_MAX[kind]; if (!cap || n <= 0 || n > cap) fail('bad_claim');
      if (w.claims.day !== today) w.claims = { day: today, n: 0 };
      const give = Math.min(n, CLAIMS_PER_DAY - w.claims.n); if (give <= 0) fail('claim_cap');
      w.claims.n += give; w.coins += give; res = { n: give }; break;
    }
    case 'reset': return { w: freshWallet(cat), res: {}, got: [] };
    default: fail('bad_op');
  }
  return { w, res, got };
}

// coins and pass XP for a finished game; `full` = against a person, a disguised bot or a matchmaking bot
export function gameReward(w0: Wallet, cat: any, key: string, won: boolean, full: boolean) {
  const w: Wallet = structuredClone(w0), got: string[] = [];
  if (w.paid.includes(key)) return { w, coins: 0, xp: 0, got };
  w.paid = w.paid.concat(key).slice(-80);
  const E = cat.econ, X = cat.xp;
  const coins = won ? (full ? E.win : E.botWin) : (full ? E.loss : E.botLoss); w.coins += coins;
  let xp = 0;
  if (w.pass < cat.pass.length) {
    xp = won ? (full ? X.win : X.botWin) : (full ? X.loss : X.botLoss); w.xp += xp;
    while (w.xp >= X.level && w.pass < cat.pass.length) { w.xp -= X.level; grantLevel(w, cat, got); }
  }
  return { w, coins, xp, got };
}
