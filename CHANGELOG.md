# Changelog — нарди (nardy-nine.vercel.app)

Versions: **patch** (0.13.1) — small fixes; **minor** (0.14.0) — new features; **1.0** — the big redesign.
The beta at `/beta` is not versioned until its features reach the main site.

## 0.28.0 — 11.11.2026
- Home on a computer (≥861×560): `#homeStage` replaces the idle board — hero (avatar, tier, rating, bar and points to the next tier, Find / Bot), «Form» (rating line from `ach.rh` since the 0.27 rescale + last 5 games), «Online near you» (5 online ghosts closest to your rating; tap = play that ghost).
- One-time «A new rating» note (was → now from the last pre-rescale `rh` entry, the three rules, points to the next tier); store key `rr27`.
- After a game (`#winRate`): the delta, before → after, why (equal / stronger / weaker by N, practice bot 40%, mars ×1.2, calibration game N of 10) and an animated tier bar; re-renders when `ratingDelta` arrives.
- Search: the rating range we look in (±150 widening 20/s up to ±800) and 4 online ghosts near you.
- Connection errors in a game: «The connection dropped — the game was restored · code».
- Coin pill badge: «🎁 +90» / «+150» (gift + finished quests), with a title.
- Collection: «Put it on in the Collection» opens the item highlighted (pulse + scroll), portraits too; «Your sets» row puts on a whole owned set.
- Leaderboard: top 100 of everyone (players + ghosts, no Legend filter), your row pinned at the bottom with points to the next place (tap → scroll to it).
- Phones (≤860): bottom nav (Play, Tournament, Shop, Rating, Profile); landscape hint on the home screen.
- «Fewer animations» setting (default from prefers-reduced-motion): no animations/transitions, no confetti.
- Lighter first load: English texts → `en.js` (written in synchronously only for English; loaded on switching), old «What's new» → `news.js` (on opening). index.html gzip 205 → ~178 KB.

## 0.27.0 — 11.11.2026
- **Rating:** Elo on a wide scale — K 60, 1500 per «10×» (server `eloDelta`, the client preview the same): equal opponent ±30, an upset up to ±60, a mars ×1.2, never 0. Calibration uses the same scale (K 200). Practice bots still count 40%.
- **Soft reset** (supabase/run/v7_rating.sql): every rating → 1000 + (rating − 1000) / 2; the order stays.
- **Ghost players:** 100 (ids 0–99, the old 84 kept their names, avatars fixed to match names; 16 new top players, some with portraits). Strength 550 … 6400: 13 above 5000, 14 at 4000–5000. `ghost_round` (pg_cron every 5 min) plays 6–30 games a round with the new Elo and pulls each ghost back to its skill. Engine by skill: random noise below 2200, then `botPathPro` — level 1 (≥2700) scores both sides (≈59% vs the old best bot), level 2 (≥4000) and 3 (≥5000) add short Monte-Carlo rollouts over the top candidates (≤ ~220 ms a move).
- **Showcase:** «Free today» is a full-width strip under the deal (gift with a 7-dot streak, quests with progress bars and claim buttons). Fixed: after loading, the rewards stayed on «Loading…» (the re-render looked for the old tab name).
- **«Server did not accept the action»:** every function call made with an expired session is repeated once after `refreshSession()`; game calls also repeat «busy», network errors and 5xx once; a 409 rule error (the screen was a step behind) reloads the game silently; the toast now shows the error code. The season table and sign-up list are public (guests got 401 on every poll). The server logs why a call was unauthorized.

## 0.26.0 — 11.11.2026
- The shop has three tabs: **Showcase** (deal of the day, today's picks, free daily rewards, what's new, portrait packs, sets), **Shop** (a catalog like the beta personalizer: categories on the left with owned/total counts — Game: board, checkers, dice, table; Profile: portraits; the chosen thing on top with a live try-on, price and «Buy»; «All / Mine / Not mine» filter and sorting; tap a card to put it in the top panel) and **Collection**. Nothing is put on in the shop any more: after buying — «Put it on in the Collection».
- From the beta: boards Carrara (epic), Terrazzo (rare), Noir (epic) — new keys carrara/terrazzo/noir, the beta CSS and the «slim» point shape; checkers Frost (rare), Ghosts & pumpkins (epic), Royal (epic), Immortal (legendary). Same rarities on the server (the deal of the day pool changes with them).
- Portrait packs: 35 beta portraits (yellow backgrounds recoloured) in 7 packs of 5 — Sketchbook, Ink & quill (1000), Neighbours, Party (1200), Travellers, Collage (1500), 8-bit (1800). Owned portraits are taken off a pack's price. Server op «pack» (PT_PACKS). Portraits are in Collection → Avatar («Portraits» group; locked ones open their pack); bots never get portraits, the old avatar picker shows only owned ones.

## 0.25.0 — 11.11.2026
- The Shop and the Collection are separate pages (a switch in the top bar). Shop = buying only: the deal of the day (one epic/legendary thing −25%, same pick on the site and the server, a countdown to Kyiv midnight), today's picks, free rewards (daily gift and quests), sets (4 themed looks, −20% on what you don't own; server op «bundle»), the catalog with type / rarity filters, sorting and «hide mine».
- A product sheet for every item: a live try-on on a real board with checkers and dice on your table, rarity, kind, price (strike-through for the deal), «N coins short» with how to earn; after buying — «Wear it now / Later» (buying no longer auto-equips).
- The «Personalizer» is now the «Collection»: what you wear now (live board + your avatar), «N of M collected» progress, save as a look, categories (looks, avatar, frame, card background, board, checkers, dice, table); your things on top, one tap to wear; missing ones greyed with a lock and their price (tap → the product sheet).
- Phones: one-row top bar, horizontal swipe rows for picks and sets, bottom-sheet product card, sticky filters and categories.

## 0.24.5 — 11.11.2026
- Season table: no 5 s cut-off — the table re-renders when tour_table answers, and the last table is kept in localStorage and shown at once. tour_table only looks for unpaid bot points after the play-off day starts (faster call).
- Tournament window before the start (CS format): the Swiss / play-off tabs show the order of events (draw Fri 19:00, round 1 Sat 14:00, 3 wins → play-off, 3 losses → out; play-off start, upper / lower bracket, grand final Bo5) with a «More about the system» button; short dates (сб 14.11) in the info cards, 2×2 on phones.
- CI: probe.yml (calls the live function from CI) and safari.yml (live site in WebKit: page errors, course bear-off lessons by mouse and touch).

## 0.24.4 — 8.11.2026
- Course on a phone in landscape (also the Telegram mini app): Vlad’s and Pasha’s bubble sits in the side panel next to the board (compact), so the head checkers and highlighted points are never covered.

## 0.24.3 — 8.11.2026
- Phone in landscape during a game (body.ingame): no site header, the board fits the full height (iPhone 14: 343 → 406 px), a narrow side panel (27vw, 200–260 px) with compact player rows, no win-chance bar, no rules block, no share label; the chat button sits in the bottom-right corner. Portrait and desktop unchanged.

## 0.24.2 — 8.11.2026
- CS format: sign-up Monday 00:00 – Friday 18:00 (server: reg_closed outside); the draw is made at Friday 19:00 and shown before the start (round 1: people against each other first by seed, a person left over meets a bot, then bots); push «The draw is out».
- The tournament banner disappears an hour after the final and returns with the sign-up on Monday; «Sign-up closed · first pairs at 19:00» on Friday evening; live points only after the start.

## 0.24.1 — 8.11.2026
- Tournament window: an «Info» tab with everything (format, Swiss, play-off, time and no-shows, prizes, season points, a «Druzi International» teaser); the long notes on the other tabs are gone. Season table: «More about the system» opens the same rules.

## 0.24.0 — 8.11.2026
- Weekend tournament in the CS format from 14 Nov (draw.fmt = 'cs'; older events keep the old rules):
  - Saturday 14:00 — Swiss stage: rounds pair equal records; 3 wins → play-off, 3 losses → out; Bo1, matches to go through / go out Bo3; up to 5 rounds; 8 go through, seeded 3–0, 3–1, 3–2.
  - Sunday 14:00 — double elimination: upper bracket (QF, SF, final), lower bracket (round 1, round 2 crossed, semi-final, final), grand final Bo5; all other matches Bo3.
  - Results per game (key: match + 'n' + game number); series decided from them; bots simulated game by game; no-show per game; a match has a hard deadline (Bo1 35 min, Bo3 80, Bo5 130).
  - Prize pool 25 000: 9 500 / 5 600 / 3 350 / 2 400 / 900 (5–6) / 500 (7–8) / 300 (2–3) / 150 (1–3) / 0 (0–3).
  - Season points: 300 / 220 / 160 / 130 / 100 / 80 / 50 / 30 / 15 by place + 5 per match won.
- Site: Swiss tab (records, rounds with series scores), play-off tab (upper / lower brackets, grand final), series games («Play vs X · game 2»), live list and broadcasts per game, banner with live points, CS texts and push texts.

## 0.23.8 — 8.11.2026
- The season table on the rating page (Tournaments tab) had no table styles (container without .lb) — fixed.
- Tournament bots get season points too: at payout the server writes tour/botpts.json (place, points per event; the already paid event is filled in on the first tour_table call); tour_table returns them, the site names them like in the bracket.

## 0.23.7 — 8.11.2026
- Coins per game by mode: rated games 120–180 a win / 40–60 a loss (halved after 10 games a day, none after 20); practice bots 30–50 / 5–15; tournament games 50–150 whatever the result (online tournament games through rate(), games against tournament bots through tour_report), mars win ×1.5, lucky game ×2.

## 0.23.4 – 0.23.6 — 8.11.2026
- Tournament games are shown like games with an opponent (no «bot» labels; human-like pauses).
- Tournament bots leave two seats free before the draw (no «16/16» with an active «Sign up»).
- Fix: a duplicate myMatch() (the old practice-tournament one, declared later) won, so the server tournament waited for the whole round; now the server's m.av is used. The banner no longer says «you are out» between matches — it shows the next match; tournament points are counted live (10 + 5 per win) until the final.
- «Live now»: people's matches only when the game exists and is not over; tournament-bot matches can be watched as a broadcast that ends exactly as the server decides (seeded bot game, same timing).

## 0.23.3 — 8.11.2026
- Personalizer → Avatar is grouped: Special (Vlad and Pasha — course rewards, locked ones shown with the condition), Men (14), Women (10), No avatar.

## 0.23.2 — 8.11.2026
- Personalizer → Card background: a live preview of the player card on top (hover/tap shows any background, locked ones too) and big tiles with names and unlock conditions. The text no longer claims others see the card background (it is kept in this browser).
- Matchmaking: a matchmaking opponent comes at a random 5–25 s (was 6–15 s); if nobody came by 30 s, a labelled practice bot starts (does not count for calibration); the search screen says so.

## 0.23.1 — 8.11.2026
- Calibration like Dota/CS: 10 games with opponents (people, matchmaking opponents); practice bots no longer count (they used to: 10 wins over the weakest bot gave 1760). A hidden rating ach.cal.m (Elo, K = 160, mars ×1.2, 1000–2000) depends a lot on whom you beat; matchmaking uses it; after game 10 it becomes the rating. The result window shows wins, mars and the strongest player beaten.
- One online counter: only in the «Find an opponent» card (online · bots waiting); the header and the line under the title are hidden.

## 0.23.0 — 8.11.2026
- Profile rebuilt: hero (rank pill opens «Ranks»), Form (rating sparkline from the server history + last 10 results + current streak / best rating), Numbers (best streak, mars, comebacks, wins over stronger players, best rating, tournaments), Activity (8 weeks from ach.gd), Last games (server history, falls back to this device), Achievements, one «Looks» row → Personalizer, Invite friends.
- Server keeps the last 20 games in ach.rh (opponent, avatar, win, mars, rating change and new rating after calibration, bot flag).
- Settings: an «Account» block (nickname, Telegram, sign out). Guests keep the nickname in the profile.
- Personalizer: «Card background» category; «Ranks» window (8 frames with thresholds, how the rating works), also in the footer.
- Pasha's profile and settings lines updated.

## 0.22.0 — 8.11.2026
- Rank frames to choose: the server keeps the best rating reached (ach.peak, after calibration) and the chosen frame (ach.fr, action «frame», 0 = Auto); any rank up to the best one can be worn. A lower rank's frame shows the full die (6).
- Shown everywhere: the header button, the home rank card, the profile, the rating table, friends, the player card, the game chips (state.frs from create/join, kept on rematch).
- The profile's small rank strip is replaced by the frame picker (Auto + 8 ranks, locked ones greyed with the rating needed); the same picker is in Shop → Personalizer → Frame; «Frame» link in the looks bar.

## 0.21.0 — 8.11.2026
- Password recovery: «Forgot password?» under the login form → nickname → the Telegram bot sends a «Set a new password» button (link #pw-<token>, 20 min, one use, 90 s cooldown) → new password → signed in. Accounts without Telegram: a message to write to the admin; the admin panel has «Reset a password» (temporary password). The profile asks to link Telegram for recovery.
- Ghosts: 16 weaker ghosts (650–990, ids 68–83); ghost-vs-ghost games every 5 min, up to 14 per round (was every 10 min, up to 6), so the rating table moves; matchmaking ghosts play at their skill (noise by skill: <800 → 6 … ≥1900 → 0), on the server and offline.
- New workflow db-sql: SQL files in supabase/run/ run against the database through the Management API.
- The «Today» block is a single list card (icon, title, subtitle, ✓ or ›), no truncation, no extra bottom margin; subtitles: «Find the best move · +60», «Chapter N: …».

## 0.20.2 — 8.11.2026
- Weekly leagues switched off (LG_ON=false on the site and the server): no League tab, no home line, no points collected; the code stays for a possible return.
- Online counter: 10–120 by the time of day (Kyiv), drifting smoothly hour to hour with ±3 jitter; bots waiting are always 10–25% of the shown online.
- Pasha's tour: the league step and the League mention are removed.

## 0.20.1 — 8.11.2026
- Pasha's tour now covers the new features: the weekly league line, friends online with «Call», the Friends tile once the course is done, and live watching in the tournament step; the League tab is mentioned in the rating step.
- Guests get their own lines for the daily gift (needs an account) and for the sign-in button.

## 0.20.0 — 8 Nov 2026
- Weekly leagues (Rating → League; a line under the rank card on the home page): Bronze / Silver / Gold / Diamond, groups of 20 with league bots in free places, points for full games (1, win 3, mars 4), Sunday night: top 5 up, bottom 5 down, prizes 500/300/200/100/100; the result is shown on the first visit of the new week. Server: `lgAdd` in the rating step, action `league`, group files in storage `srv/league/<week>/`.
- Home: «Today» row (daily puzzle, daily gift, course — or Friends after the course); friends online above Find an opponent with «Call».
- Tournament: «Live now» list of player-vs-player matches with «Watch» (spectators do not join the game).
- Unique nicknames for new names (action `name_ok`; profile name change and new Telegram accounts get a free variant).
- Guests: a reminder after a game and a card on the home page (every 3 days) to sign in so coins and progress are kept.
- CI: the edge function is deployed through the Supabase Management API (GitHub release downloads returned 504).

## 0.19.3 — 8 Nov 2026
- The Telegram bot writes first: «your turn» (the waiting player's app asks after a minute; one message per game per 10 minutes — action `nudge`), tournament reminders to signed-up players with a Telegram account (with the push reminders), and the place and prize after the tournament.

## 0.19.2 — 8 Nov 2026
- The season banner said «weekend 2 of 4» during the first weekend: a weekend was counted as done 4 hours after Saturday 18:00. It now counts as done after the play-off (Sunday ~22:00 Kyiv).
- Settings: the «App on your screen» row stayed visible where installing is not possible.

## 0.19.1 — 7 Nov 2026
- Lessons on phones: the story bubble was placed on stale board coordinates and could cover the bear-off tray (e.g. the 6 and 2 lesson). It is now placed again as the board settles (scroll, layout), and goes below the tray if it fits, otherwise over the top half of the board.

## 0.19.0 — 7 Nov 2026
- Friends (Rating → Friends): find and add by nickname, online now / last seen, "Call" creates a game and invites the friend (in-app invite if online, push, Telegram message via the bot); add / remove / call from a player's card. Server action `friends` (find, add, remove, invite, list; one invite per friend per minute).
- The daily puzzle on prod (from the beta): a card on the home page; the server pays once per Kyiv day (best 60, good 20) and keeps the streak (action `puzzle`).
- Quick reactions under the board in online and bot games (👍, Nice move, Oops, Cold dice, Hookah's on me); new hookah phrases in the chat wheel. Same 15-second limit.
- After an online game: "Find a new opponent" (if yours does not want a rematch).
- Install as an app: the browser prompt on Android/desktop, a how-to on iPhone; a row in Settings and a card on the home page after the first game (phones). Not shown in Telegram or when already installed.

## 0.18.1 — 7 Nov 2026
- Home: the big «How to play» button is gone (it duplicated the footer link and the course card); «Play on one device» is full width.
- «What's new» in the game has entries again for 0.16.1–0.18.1; the build now fails if a release has no «What's new» entry.

## 0.18.0 — 7 Nov 2026
- «Вечори в кальянній»: the story course after the first lesson — 6 chapters with Vlad and Pasha (the head rule and the first-roll exception, the fence and why six in a row is not allowed, bearing off, mars, tactics, and a final game against Pasha). Moves are checked; a wrong one gets a line from Vlad and the lesson again.
- Course rewards, once each (the server pays accounts and keeps the order; guests keep them in the browser): the Apprentice badge on your avatar, Hookah dice, 300 coins, Coal checkers, and for beating Pasha 500 coins + the Hookah lounge table. The course items are not sold; the shop says where they come from.
- «Екскурсія з Пашею»: Pasha shows the platform with a spotlight on the real buttons and a joke at each; once by itself for brand-new players, any time from Settings; +100 coins at the end, once. Works in the Telegram Mini App too (Telegram's Back closes it).
- Home card «Вечори в кальянній · N з 6» (glows until chapter 2), the chapter list, "Hide from the home page".
- Phone: more room between the coins and the avatar; compact empty slots in "My looks".

## 0.17.0 — 7 Nov 2026
- The weekend tournament is now one shared bracket on the server: at the start the server draws 4 groups of 4 from the signed-up players (in sign-up order), free places go to tournament bots. Everyone sees the same groups, tables and play-off.
- Player vs player matches are real online games (the first to come creates the game, the other joins; no-show after 10 minutes = a win for the one who came). Player vs bot matches are played against the tournament bot and reported to the server. Bot vs bot matches are resolved by the server.
- One game per match; group rounds open every 35 minutes (earlier once both players are free), the play-off opens when the groups end. The server pays the prizes and tournament points once.
- This weekend's tournament is moved: groups on Sunday 14:00–16:00, play-off from 16:00 (Kyiv). Signed-up players keep their place; reminders say so.
- Phone header: more space between the coins and your avatar.

## 0.16.7 — 7 Nov 2026
- Fix: the weekend tournament did not start at 18:00 for signed-up players — the groups are now drawn automatically at the start, and the first match is ready to play.

## 0.16.6 — 7 Nov 2026
- Weekend tournament: the field always fills up to 16 players by the start.

## 0.16.5 — 7 Nov 2026
- Telegram bot: after Start it greets the player with buttons Play / Weekend tournament / Invite a friend; bot description, short description, /start command and the Play menu button. Set up from Admin → Tools → Telegram bot (needs TG_BOT_TOKEN in Supabase secrets).

## 0.16.4 — 7 Nov 2026
- Phone header order: rating, settings, coins, then your nickname.

## 0.16.3 — 7 Nov 2026
- Admin → Statistics → "Where people play": Telegram accounts (and nickname accounts that linked Telegram), players today and in 7 days in Telegram / the browser / the installed app, and a 30-day chart by platform. Players search shows each player's platform.
- Admin: the Refresh button sits next to the title; the stat cards are two per row on phones.

## 0.16.2 — 7 Nov 2026
- Telegram Mini App: the game opens inside Telegram (@dovgi_nardy_bot) — Telegram's colours, its Back button, vibration on dice and moves, sign-in with the Telegram account, invites that open straight in Telegram.
- "Log in with Telegram" on the website (the same account as in the bot) and "Link Telegram" in the profile for nickname accounts.
- Telegram bonus, once per account: +500 coins and the Telegram badge on your avatar.

## 0.16.1 — 7 Nov 2026
- Settings → «Сповіщення». While the site is open (even in a background tab): "your turn" in an online game, and the weekend tournament an hour and 5 minutes before the start if you are signed up.
- When the site is closed (signed-in players): web push — Saturday 12:00 "the tournament is today" (everyone), and 17:00 / 17:50 Saturday and 17:50 Sunday for the players who signed up. Tapping one opens the tournament. On iPhone it works after "Add to Home Screen".

## 0.16.0 — 7 Nov 2026
- Rating is a page of its own (the trophy button, the rating card on the home page): tabs Rating (top 100 by rating, everyone past calibration), Friends (you, the friends you invited and whoever invited you) and Tournament (the weekend tournament season table); a podium for the top 3, the list from #4 in pages of 20, and your own row pinned at the bottom with your place and how much rating is left to the place above (or to the top 100). The phone's back gesture closes it.
- Player card: tap anyone in the table — avatar with the rank frame, rank, rating and place, games, wins, win rate, and "Play by link" (makes a game link to send).
- Faster loading: the Supabase library loads without blocking the page; the site is now built from src/index.html by tools/build.js — CSS, JS and HTML are minified, avatars moved to av.js (loaded in parallel), item skins to skins.css (applied right after the first paint). index.html went from 672 KB to 427 KB (189 → 125 KB compressed).
- Source of the site: src/index.html (edit there, then `node tools/build.js src/index.html .`).

## 0.15.4 — 7 Nov 2026
- Weekend tournament field: when there are not enough sign-ups, the places are taken by computer players with a first name, a nickname and a last name (fixed for the season, the same on every device). They appear in "Participants" gradually during the week (up to 14, so there are always free places for real people) and are the opponents in your groups and play-off. They are not marked as bots.
- The tournament texts no longer mention bots.
- Coins in the tournament (prize pool, prizes, the home card) use the site's gold coin instead of the 🪙 emoji, which is silver on some systems.
- Tournament opponents play stronger: 6 candidate moves and 20 rollouts each (was 5 and 16), about 1 s per move.

## 0.15.3 — 7 Nov 2026
- The coin button opens the Shop with three tabs: **Showcase** (the daily gift and quests of the day, plus four picks of the day — one common, rare, epic and legendary thing, the same for everyone during a Kyiv day, preferring things you do not own), **Catalog** (everything for sale with the try-on, by board / checkers / dice / table) and **Personalizer** (outfits, avatar and your own things — tap to put on, “More in the catalog” to buy).
- The gift and bag icons are gone from the header; a green dot on the coin button (and on the Showcase tab) shows when a gift or a quest reward can be collected. The brand name is back on phones.
- Settings → “Change the look” and Profile → outfits open the Personalizer.

## 0.15.2 — 7 Nov 2026
- Rewards (gift button in the header, also the coin button): a daily gift with a 7-day streak (50, 70, 90, 110, 130, 150, 150 coins; missing a day starts the streak again) and three quests of the day (play 2 or 4 games, win 1 or 3, play an online game, win with a mars) for 40–100 coins each. Progress is counted and coins are paid by the server; a green dot on the gift shows when something can be collected. Guests see the rewards and are asked to sign in.
- The Collection has its own bag button in the header; the coin button no longer opens it.
- Settings are compact: one narrow window with the switches, the language and “Change the look — Collection”; the big skin grids are gone (looks are chosen in the Collection). On phones the board preview is hidden.
- Header fits on 360 px phones: the brand name hides below 480 px and the icon buttons are tighter.

## 0.15.1 — 7 Nov 2026
- The shop “Collection” (coin button in the header, or “More in the shop” in Settings): boards, checkers, dice and tables for coins, each with a try-on — the selected thing on your board with your checkers and dice — filters All / Mine / Not mine, and rarity (common, rare, epic, legendary). Buying and the prices are checked on the server; your things are kept with your profile.
- The base set (Felt board, Classic checkers, Ivory dice, “To match the board” table) is free for everyone; the Friends board and checkers stay earned by inviting friends; card backgrounds stay earned by rank. Everything else is now in the shop.
- Players whose accounts existed before the shop opened get 3000 coins once, with a welcome window. Anyone playing on an item that is now paid goes back to the base set and can buy it again.
- My outfits: up to 5 saved outfits (avatar, board, checkers, dice, table). They are in the profile instead of the big avatar grid and switch with one tap; not during a game. Avatars moved to the Collection (Profile → Avatar).
- Settings show only your things, plus “More in the shop”.
- Coins per game against matched bots: full for the first 10 games a day, half up to 20, then like practice games.

## 0.14.13 — 7 Nov 2026
- Admin panel, visible only to the admin account and checked by the server on every call: Settings → Admin panel. Statistics (online now, registered and guests, new and active players, games between people and with bots, return next day / within a week, funnel, coins in circulation) with 30-day charts; find a player by nickname and give or take coins with a reason (every action is logged); all skins for testing.
- The site tells the server once a day that the player was here, and finished games are counted per day, for the statistics.

## 0.14.12 — 6 Nov 2026
- Tournament window is compact: a lower photo header, sign-up (or “You are signed up”) and “Share” side by side, the four info cards in one slim row, and the tab content takes only the space it needs — no empty area under short tabs. The window stays pinned at the top, so the tabs do not jump.

## 0.14.11 — 6 Nov 2026
- Tournament window before the start: four cards (Groups — Saturday 18:00, Play-off — Sunday, Players signed up of 16, Prize pool) and a countdown instead of the long text. The Groups / Play-off / Players tabs now work before the start: how the draw works with empty group slots, the play-off stages, and who signed up plus the free places that bots will take.

## 0.14.10 — 6 Nov 2026
- Fix: “Sign up for the tournament” did nothing for guests and for visitors who were not signed in — the sign-in window opened under the tournament window and the hint was hidden too. Now guests can sign up as well; a visitor without a session gets the sign-in window on top, and after signing in the sign-up form opens by itself.

## 0.14.9 — 6 Nov 2026
- The weekend tournament is real only: the play-any-time tournament against bots is removed (and any one in progress is cleared). Groups start on Saturday at 18:00, the play-off is on Sunday; free places go to grandmaster bots.
- Sign up for the tournament (banner button or the tournament window): first name, nickname and last name with a live preview — Влад «Ka1p3r» Баландюк. Fixed until the season ends; only accounts can sign up. The banner and window show how many are signed up.
- “Share the tournament”: a link and QR code that open the tournament window; when you are signed in it also counts as your friend invite.

## 0.14.8 — 6 Nov 2026
- Tournaments table shows only real players who finished a weekend tournament this season (read by the server from their profiles), no simulated players. With nobody yet it says so.
- A tournament season is 4 weekends; the first one starts on Saturday, 7 November.
- The home banner shows “Tournament season · weekend 1 of 4” until you have points, then your place and points.

## 0.14.7 — 6 Nov 2026
- Weekend tournament: 16 players — you and 15 grandmaster bots (a stronger bot that plays the best moves out to the end before choosing). Groups of 4 with two games against each opponent, the top two go to the play-off; quarter- and semi-finals best of 3, the final best of 5. The window has a photo header, tabs Groups / Play-off / Prizes / Players and keeps one height when you switch tabs.
- Prizes: 1st 4000, 2nd 2500, 3rd 1500, 4th 1000, 5th–8th 250 coins. Tournament points: 10 for taking part, 5 for every game won and a bonus for the place (1st +100, 2nd +60, 3rd–4th +40, 5th–8th +20). The prize and points count once a week — for your first finished tournament; for accounts the server checks and keeps them, guests keep them in the browser.
- Home: a slim banner on top — “Weekend tournament · Saturday 18:00 · in 1 d 2 h” with Open / Play / Collect prize, and your tournament points and place.
- Leaderboard: tabs Rating / Tournaments. Tournaments shows the tournament season (7 weekends), points rules and the points table.
- Tournament games do not change the rating and do not pay coins per game.

## 0.14.6 — 6 Nov 2026
- Invite friends. The profile has an “Invite friends” line and button; the invite window shows what your friend gets (300 coins and the Druzi checkers), what you get (200 coins per friend, up to 50) and the Friends board in four levels — Friends (1 friend), Neon (3), Wave (5) and Legend (10) — with ✓ on the ones you have. Tap a board to see it up close on the table with the Druzi checkers and switch levels. Then the QR code and the link.
- A friend who opens the link sees “Vlad invites you to Nardy”; after signing up they get the reward and a welcome window. The server checks every invite: only a new registered account (up to 14 days old), not your own link, once per account and once per device. The inviter gets a note and the coins at the next profile refresh.
- The Friends boards and checkers are in Settings with a lock until earned; tapping a locked one shows it and how to get it.
- Game invites (“Invite” / link button) now open a window with a QR code, the link and Copy / Share / Save QR, as in the beta.
- Chat wheel: the ring radius and button size depend on how many items are on it, so buttons never overlap each other or the centre.
- Profile ranks: one tight row of frames; the name and rating of your rank (or the one you tap) is in the block title.

## 0.14.5 — 6 Nov 2026
- Fix: if the tutorial was finished on this device but the account never got its 200 coins (it was finished before signing in, or before the server update of 6 Nov), the account gets them on the next sign-in, together with the Vlad and Pasha avatars. The server pays this only once per account.

## 0.14.4 — 6 Nov 2026
- The EN / UA switch moved from the footer to Settings (“Мова · Language”, under Dark theme).

## 0.14.3 — 6 Nov 2026
- Footer at the bottom of the home page (desktop and phone): the version (tap it for “What’s new” — the last versions in short), the EN / UA switch, “How to play”, a link to the beta and “What’s new”.
- The version and language switch moved out of the header, so on phones the header fits again: coins, leaderboard, settings and the profile button are all on screen (in 0.14.1–0.14.2 they ran off the right edge and the profile could not be opened on a phone).

## 0.14.2 — 6 Nov 2026
- Chat wheel instead of the emoji strip: a round button on the right of the board (bottom right on a phone) opens a wheel of up to 10 emoji and phrases; on a phone it is a sheet with two rows of five. One message every 15 seconds, the button shows the wait. “Set up the wheel” lets you choose what is on it (kept in this browser).
- Rated games need a nickname: without one “Find opponent” opens the profile first.
- Profile: the rank ladder is one compact row — only your rank is labelled, tap another to see its name and rating.
- Profile: achievements as a row of 10 badges (earned in colour, the rest grey with progress) and your last 6 games on this device with the result, mars, rating change and when.

## 0.14.1 — 6 Nov 2026
- New tutorial “An evening at Druzi”: Vlad and Pasha teach you to play at the Druzi hookah bar. Their lines appear on the board in speech bubbles, the points they talk about light up or get crossed out, and each of your moves gets a reaction. During the tutorial the board is “Neon Druzi”.
- Coins: a counter next to the site name’s right-hand icons. Every game pays coins — a win against a person 120–180, a loss 40–60, against the practice bot 30–50 / 5–15; a mars win +50 %, and now and then a “Lucky game” pays double. New players start with 1000. There is nothing to spend them on yet — the shop opens soon.
- Registered players’ coins are kept on the server with the profile, the same on every device, and are paid by the server after each game. Guests’ coins stay in their browser.
- Finishing the tutorial gives 200 coins once and Vlad and Pasha as avatars in the profile.

## 0.13.1 — 6 Nov 2026
- Calibration: your first 10 rated games place you. Until then the rating is hidden and the home card shows “Calibration 3 of 10 · 2 won”; after the 10th game you get a rating by how many of them you won (0–5 wins Rookie, 6–7 Regular, 8–9 Expert, 10 Master) and a window shows your new rank. Players who already had a few rated games finish the calibration on the games left.
- The leaderboard shows only players who finished calibration.
- Needs the updated `game` function on the server.

## 0.13.0 — 5 Nov 2026
- Profile card backgrounds are real photos (pine forest, ocean, night dunes, neon city, mountains, tropics, smoke, nebula, lava, aurora, liquid gold, Milky Way, thunderstorm, hologram); the better ones unlock by rank, with a hint on hover or tap.
- Settings: rarity labels on boards, checkers and dice (base / common / rare); table backgrounds removed.
- The keyboard hint (Space / Backspace) is hidden on phones and tablets.
- Version number next to the site name.

## 0.12.0 — 4 Nov 2026
- Table backgrounds from photos; card backgrounds in different styles that unlock by rank.
- Voice chat fixes (early ICE candidates, audio unlock on iOS, retry).

## 0.11.0 — 4 Nov 2026
- Modern look: dark theme by default, bento home with live players, rank card; calmer monochrome buttons; mobile fixes.

## 0.10.0 — 4 Nov 2026
- Leaving a started game counts as a loss; claim the win when the opponent leaves; online players with nicknames; bots react with emoji.

## 0.9.0 — 4 Nov 2026
- New boards (arch, dots, inlay, spear, line), 5 checkers, 5 dice; real preview in settings.

## 0.8.0 — 3 Nov 2026
- Server-authoritative games and ratings, turn timer, voice chat, emoji, rematch, game review, achievements.

## 0.7.0 — 3 Nov 2026
- Rank system: 8 ranks × 5 stars, rank frames, rank-up jingles; Hall of Legends leaderboard.

## 0.6.0 — 3 Nov 2026
- Druzi board with the neon logo; new logo and favicon; bigger board on desktop and mobile.

## 0.5.0 — 3 Nov 2026
- Settings redesign with live preview; win-chance bar; resign after move 10; card backgrounds; Lorelei avatars.

## 0.4.0 — 3 Nov 2026
- Move history, undo on the board, turn banner, player-card profile.

## 0.3.0 — 3 Nov 2026
- Online counter and matchmaking, bot opponent, tutorial.

## 0.2.0 — 2 Nov 2026
- Avatars, new boards and checkers, Elo rating with rank frames, leaderboard; sign-up with a nickname and password.

## 0.1.0 — 2 Nov 2026
- Long backgammon for two: play by link, realtime sync, guest and email sign-in.
