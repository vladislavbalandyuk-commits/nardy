# Beta changelog — nardy-nine.vercel.app/beta

Beta versions are `<next main-site version>-beta.<build>`: the beta is heading for 0.14.0, and every deploy to /beta adds one to the build number (0.14.0-beta.2, -beta.3 …).
When features move to the main site they get a normal version there (see CHANGELOG.md), and the beta moves on to the next one.

## 0.14.0-beta.5 — 6 Nov 2026
- Shop cards are tighter: wide preview, name and price right under it, rarity as a small line and a coloured edge at the bottom.
- The Winter case is gone, together with everything that only dropped from it (Waves, Art Deco and Aurora boards, Crystal orbs, the Surprise effect and 7 voice emoji). Boards and checkers that are also sold in the shop stay. The Druzi case is now the only case.

## 0.14.0-beta.4 — 6 Nov 2026
- New shop: a full page instead of a popup. Shop and “My table” are one page with a switch at the top; sections sit in a side menu (a scrolling row on phones), so the page no longer jumps between tabs.
- Item lists get rarity filters, a “not mine yet / only mine” switch and sorting (recommended, cheapest, most expensive, rarest); every card has the same size.
- Back button, the phone’s back gesture and Esc close the shop.

## 0.14.0-beta.3 — 5 Nov 2026
- Weekend tournament (local test version): 16 players, 4 groups of 4 with two games per pair, top two to the play-off; quarter- and semi-finals best of 3, final best of 5, 3rd-place match. Prize pool 10,000 coins (4000 / 2500 / 1500 / 1000 / 4×250), titles, badges and the “Weekend Cup” frame for the winner.
- Grandmaster bot for tournaments: plays each candidate move out to the end of the game and picks the one that wins most; beats the strongest regular bot ~70 % of the time.
- Server wallet accepts the tournament prize (once a day, up to 4000).

## 0.14.0-beta.2 — 5 Nov 2026
- Invite a friend: the link button opens a window with a QR code — copy the link, share it (phone share sheet, with the QR picture) or save the QR as a picture.

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
