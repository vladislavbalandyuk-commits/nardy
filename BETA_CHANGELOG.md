# Beta changelog — nardy-nine.vercel.app/beta

Beta versions are `<next main-site version>-beta.<build>`: the beta is heading for 0.14.0, and every deploy to /beta adds one to the build number (0.14.0-beta.2, -beta.3 …).
When features move to the main site they get a normal version there (see CHANGELOG.md), and the beta moves on to the next one.

## 0.14.0-beta.1 — 5 Nov 2026 (everything in the beta so far)
**Speed and look**
- Faster loading (FCP ~1.0 s → ~0.4 s on a slow phone), lazy previews, no idle animations, lighter effects on phones.
- Modern boards, checkers and dice with photo textures; canvas effects (snow, fireworks, confetti, bats, screamer, gift).
- Fluent 3D emoji in chat; compact phone header.
- Win chances refit on 40,000 simulated games.

**Online**
- Online counter: people + players-bots (5–100 over the day) + 10–25 % labelled bots.
- “Players playing now” card; after 30 s of search a labelled bot opponent.
- Leaderboard: Global and Season tabs, top 100 in pages of 20, ratings move with recent games.
- Player cards with status and last 5 games.

**Economy (local wallet until the server wallet is deployed)**
- Shop with rarity, sets, try-on; “My table” inventory; new-item badges.
- Coins for games, 7-day daily bonus, daily quests.
- Winter pass (30 levels): New Year avatar looks, garland frame, voice emoji.
- Cases: Winter case and Druzi Case (cocktail checkers, bar dice, staff avatars, bar board and table, neon Druzi board, bar sounds).
- Puzzle of the day with streak.
- Monthly seasons with prizes (laurel frame, “Champion” voice, season checkers) and season badges.
- Server wallet code ready (supabase/v6_wallet.sql + game function) — not deployed yet.

**Fixes**
- Keyboard hint hidden on touch devices.
