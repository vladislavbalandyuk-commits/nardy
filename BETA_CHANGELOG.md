# Beta changelog — nardy-nine.vercel.app/beta

Beta versions are `<next main-site version>-beta.<build>`: every deploy to /beta adds one to the build number. Up to 0.14.0-beta.14 the beta was heading for 0.14.0; the main site took 0.14.1 (tutorial and coins), so from 0.15.0-beta.1 the beta heads for 0.15.0 (the shop).
When features move to the main site they get a normal version there (see CHANGELOG.md), and the beta moves on to the next one.



## 7 Nov 2026 — Druzi International battle pass
- The winter pass is put away (its things stay with whoever has them and are hidden from the catalog). In its place: the **International Compendium** — 100 levels.
- The pass costs 2000 coins; a level costs 250. Half of every pass and level purchase goes to the Druzi International prize pool (shown on the pass page with your share).
- XP comes from games (win +30, loss +15), quests (+40 each) and the daily gift (+20), 100 XP per level. Levels count before you buy the pass; buying it gives all the rewards for the levels already passed.
- 100 rewards, from chat phrases at the start to animated things at the end: 24 portraits; 12 checkers (Bronze, Silver, Radiant, Dire, Emerald, Sapphire, Ruby, Gold, Obsidian, Platinum, Aurora, Immortal — the last two animated); 8 dice; 5 boards (Arena, Obsidian, Aurora, Gold hall, Immortal with a moving shine); 3 tables (International arena, Trophy room, Night stadium); 8 avatar frames up to the animated Immortal and the International crown; 6 card backgrounds; 7 phrases; 3 emoji packs; 4 sounds (gong, war drums, crowd chant, stadium horn); 3 avatar looks (caster headset, champion crown, laurel wreath); 12 effects — 8 big animated wins from LottieFiles (trophy, crown, twinkle crown, gold status, rocket, two fireworks, confetti burst) and coin rain, meteor shower, golden wave and lightning; coins at levels 25, 45, 75, 94 and 99.
- Pass page: a fourth tab “Pass” in the Collection — the International hero with the prize pool and your level, the ten big rewards (every 10th level), and all 100 levels in rows of ten (locked rewards show a lock until the pass is bought). The rewards window links to it.
- Portraits are a new catalog category (Profile → Portraits): 24 from the pass and 12 sold for 300–900 coins. A portrait replaces your avatar; avatar looks stay for the classic avatars.

## 7 Nov 2026 — NIKOW case (demo)
- New case “NIKOW · demo” (450 coins, same odds as the Druzi cases): 34 things in the mood of NIKOW — night city, the ocean, the stage and a stadium of phone lights. Checkers Balm, Philophobia, Son are you asleep?, Open ocean, Heartbeat (pulses), Seductive, Not for real (holographic), Moon; dice Whisper, City windows, Concert ticket, Spotlight, Vinyl, Stage neon; boards “Talks with the city” and “Deep” (slow waves); the Stadium table; phrases; frames Spotlight beam, Sound wave and NIKOW Live (animated, with a LIVE badge); the “Sold out” card; avatar look “Hood and mic”; concert emoji; effects “Stadium lights” (win) and “Heartbeat” (roll); five voices — heartbeat, stadium roar, night chord, rain in the city, bass drop.
- All pictures and sounds are our own (sounds are synthesized in the browser); no recordings, lyrics, covers or likeness of the artist. Licensed snippets can be dropped in later through VO_SRC for the nk* voices.
- The case opens with its own sounds (heartbeat, night chord, stadium roar + lights for the top tiers). The showcase hero now shows this case.
## 0.16.0-beta.1 — 7 Nov 2026
- Version renumbered: the main site is on 0.15.1 (shop with the catalog, outfits), the beta now heads for 0.16.0. Server code is the same as on the main site.

## 0.15.0-beta.20 — 7 Nov 2026
- Profile: the big avatar grid is replaced by “My outfits” — 5 outfits to switch with one tap, plus links “Avatar” and “Set up”. The outfits row is no longer on the home page.
- Avatars moved to Collection → Catalog → Profile → Avatar.

## 0.15.0-beta.19 — 7 Nov 2026
- Outfits: up to 5 saved outfits (avatar, avatar skin and frame, card background, board, checkers, dice, table, both effects). Home page has a “My outfits” row — one tap puts an outfit on; the row is not shown during a game. “Save” on an empty slot keeps what you wear now. Outfits are named, re-saved and deleted in Collection → Catalog → My outfits.
- Catalog categories are split into groups: Outfits · Game (board, checkers, dice, table) · Profile (avatar skins, avatar frames, card backgrounds) · Effects (dice roll, victory) · Chat (chat wheel, emoji, phrases, voice).

## 0.15.0-beta.18 — 7 Nov 2026
- Admin panel for the admin account (Settings → Admin panel): statistics with charts, find a player and give or take coins with a log, all skins for testing.

## 0.15.0-beta.17 — 7 Nov 2026
- Showcase is fuller: the bundle of the week shows its board large with the checkers and dice on two tiles below (no tilted table); “Today for you” always shows four items (if you own them all they say “Yours” and “Put it on”); new blocks “Your collection” (how many of all items you have, opens what you are missing) and “Your goal” (your “Want this” item and how many coins are left); “New arrivals” as a row; both cases side by side.

## 0.15.0-beta.16 — 6 Nov 2026
- The shop is redesigned as one page, “Collection”, with three tabs:
  - Showcase: the bundle of the week (changes weekly, with what it includes, the price and the saving, “Try on”), “Today for you” — four offers, one of each rarity (common, rare, epic, legendary) and of different kinds, refreshed at midnight — and the case.
  - Catalog: categories on the left (on a phone as a row of chips), a try-on on top that shows the selected thing on your board, and your things and the shop's in one list with the filter All / Mine / Not mine and sorting. Buy, put on, “Want this”; case, pass and invite items say where they come from.
  - Cases: as before.
- The four shop look variants and the separate inventory / “My table” are gone — the Catalog with “Mine” does that.
- Daily gift, quests and the battle pass moved to a gift button in the header (green dot when the gift is ready).
- Legendary rarity colour is coral instead of yellow.

## 0.15.0-beta.15 — 6 Nov 2026
- Tournament window is compact: a lower photo header, sign-up (or “You are signed up”) and “Share” side by side, the four info cards in one slim row, and the tab content takes only the space it needs — no empty area under short tabs. The window stays pinned at the top, so the tabs do not jump.

## 0.15.0-beta.14 — 6 Nov 2026
- Tournament window before the start: four cards (Groups — Saturday 18:00, Play-off — Sunday, Players signed up of 16, Prize pool) and a countdown instead of the long text. The Groups / Play-off / Players tabs work before the start: how the draw works with empty group slots, the play-off stages, and who signed up plus the free places that bots will take.

## 0.15.0-beta.13 — 6 Nov 2026
- Fix: tournament sign-up did nothing for guests and visitors who were not signed in — the sign-in window opened under the tournament window. Now guests can sign up too, and a visitor without a session gets the sign-in window on top and the sign-up form right after signing in.

## 0.15.0-beta.12 — 6 Nov 2026
- “Share the tournament” button in the weekend tournament window: a link and QR code that open the tournament window for friends; when you are signed in it also counts as your friend invite.

## 0.15.0-beta.11 — 6 Nov 2026
- The test tournament (“Start a test tournament now” against bots) is removed, and any test tournament in progress is cleared. The weekend tournament window now only offers signing up; groups start on Saturday at 18:00, the play-off on Sunday, free places go to grandmaster bots.

## 0.15.0-beta.10 — 6 Nov 2026
- Sign up for the weekend tournaments: a “Sign up” button on the tournament banner and in the tournament window opens a form with first name, nickname and last name and a live preview of how you will be shown — like a pro player: Влад «Ka1p3r» Баландюк. The server checks and keeps it; it cannot be changed until the season ends. Only accounts can sign up.
- After signing up the tournament window shows “You are signed up as …” and how many players are signed up; the banner shows the count too.
- Player cards show the tournament name under the nickname for players who signed up.

## 0.15.0-beta.9 — 6 Nov 2026
- Weekend tournament window no longer jumps when you switch Groups / Play-off / Prizes / Players: the content area has one fixed height (it scrolls inside), the window stays pinned at the top, and the scroll position is kept.

## 0.15.0-beta.8 — 6 Nov 2026
- Tournament points now come from three parts: 10 for taking part (finishing a weekend tournament), 5 for every game won, and a bonus for the place (1st +100, 2nd +60, 3rd–4th +40, 5th–8th +20). Shown in the Tournaments tab and in the tournament rules; after a tournament the note says how the points add up.

## 0.15.0-beta.7 — 6 Nov 2026
- Fix: with the tournament banner on top, the “Long nardy” title on the home page was squeezed into half the width; it spans the full width again.
- Druzi International is switched off for now (it needs the shop and cases for its prize pool) and will come back with them. The Tournaments tab is now a “Tournament season”: 7 weekend tournaments, points for your place add up, the table resets with a new season; your pinned row shows how many points you need for the place above. The home banner shows your tournament points and place.
- Weekend tournament window: a photo header — people playing nardy at a tournament (Unsplash), with the Druzi table photo underneath if it does not load.

## 0.15.0-beta.6 — 6 Nov 2026
- Druzi International, like The International in Dota: weekend tournaments give points (1st 100, 2nd 60, 3–4 40, 5–8 20, 9–16 5); after 7 qualifying weekends the top 8 by points are invited to the Druzi International on the 8th weekend. The prize pool grows with every case — 25 % of each opened case — and is split 40 / 20 / 12 / 8 % and 5 % each for 5th–8th. Coins only.
- Rating page: a fourth tab “Tournaments” — the International card (date, prize pool, split), the qualification progress by weekends, the points table with the invite zone line under #8, and your row pinned at the bottom (“#12 · 40 pts to the invite zone”).
- Home: a slim banner on top instead of the tournament card — “Weekend tournament · Saturday 18:00 · in 1 d 2 h” with Open / Play, and a line with the International prize pool and your place; tap it to open the Tournaments tab.
- In the beta the other players’ tournament results and their share of the pool are simulated; your own points come from the weekend tournaments you finish.

## 0.15.0-beta.5 — 6 Nov 2026
- Rating is a page of its own (opened by the trophy button or the Hall of Legends card) instead of a window: tabs Season / All time / Friends, a podium for the top 3, the list from #4 in pages of 20, and your own row pinned at the bottom with your place and how much is left to the place above (or to the top 100). Back button or the phone’s back gesture closes it.
- Season tab: the month, time left and the prizes for 1st, top 3, top 10 and top 100.
- Friends tab: you, the friends you invited and the one who invited you; with nobody yet it offers “Invite friends”.
- Player card: “Invite to a game” for real players — creates a game and opens the invite window with the QR code.

## 0.15.0-beta.4 — 6 Nov 2026
- Profile: “Invite friends” is now one short line (what friends and you get) and an “Invite friends” button. Everything else is in the invite window: what your friend gets, what you get, the four Friends boards with ✓ on the ones you have (tap one to see it up close), then the QR code and the link.
- Profile ranks: one tight row of frames without the empty space under it; the name and rating of your rank (or of the one you tap) is shown in the block title.

## 0.15.0-beta.3 — 6 Nov 2026
- The Friends board can be seen before you invite anyone: tap any of the four boards in the profile’s “Invite friends” block to open it up close (on the table, with the Druzi checkers), and switch between the levels 1 / 3 / 5 / 10 friends right there.
- The Friends boards and the Druzi checkers are listed in the shop too, marked “For 3 invited friends” and so on, with an “Invite a friend” button instead of a price.

## 0.15.0-beta.2 — 6 Nov 2026
- Invite friends: the profile has an “Invite friends” block with a personal link and QR code. A new player who signs up by the link gets 300 coins and the Druzi checkers (a welcome window greets them by the inviter’s name). The inviter gets 200 coins per friend (up to 50 friends) and the Friends board at 1, 3, 5 and 10 friends: Friends, Friends · Neon, Friends · Wave (a colour wave runs round the frame) and Friends · Legend (iridescent frame, starry field). The four steps show as badges in the block.
- The server checks every invite: only a new registered account (no older than 14 days), not your own link, once per account and once per device.
- Chat wheel: voice emoji no longer fall off the ring; the ring radius and button size now depend on how many items are on the wheel, so they never overlap each other or the centre.

## 0.15.0-beta.1 — 6 Nov 2026
- Version renumbered: the main site is on 0.14.1 (the tutorial and coins went there), the beta now heads for 0.15.0.
- Server code: registered players’ coins per game and the tutorial reward are kept in the profile, the same as on the main site (takes effect when the game function is deployed).

## 0.14.0-beta.14 — 6 Nov 2026
- New tutorial “An evening at Druzi”: Vlad and Pasha (drawn in the same style as the game’s avatars) teach you at the Druzi hookah bar. Their lines appear right on the board in speech bubbles, the points they talk about light up or get crossed out, and the bear-off tray glows when it matters. The six lessons stay the same, now with a story, jokes and a reaction after each of your moves. During the tutorial the board is “Neon Druzi” on the Druzi bar table.
- On a computer the bubble sits on the side of the board away from the points it talks about; on a phone it sits under the board. Tap to continue.
- Finishing the tutorial gives 200 coins once, the achievement “Druzi graduate”, and Vlad and Pasha as avatars in your profile. The final window offers a game with Pasha (the bot) or a real opponent.

## 0.14.0-beta.13 — 6 Nov 2026
- Profile: achievements are back as one row of 10 badges — earned ones in colour, the rest grey with a progress line (e.g. mars 3 / 5); hover or tap a badge for its name and goal. The heading shows how many you have.
- Profile: last games — a strip of wins and losses and your last 6 games with the opponent, mars or bot, how long ago, and the rating change. Kept on this device.

## 0.14.0-beta.12 — 6 Nov 2026
- Profile: the rank ladder is one compact row of 8 small frames instead of two rows of big cards. Your rank is labelled; tap or hover any other rank to see its name and rating threshold.

## 0.14.0-beta.11 — 6 Nov 2026
- Shop looks to try: a switch at the top of the shop (beta only) between the current look and three new ones:
  1. Clean — one big card on the shop home, three small tiles (bonus, pass, quests), today’s items and the cases; daily bonus and quests move to a new Rewards page; the catalogue is grouped by rarity with bigger cards.
  2. Fitting room — the shop home in two columns (rewards on the left, the shop on the right); the catalogue shows your table with the chosen item on the left and a compact list on the right, with Buy / Put on and “I want this” under the preview.
  3. Market — like 1 on the home page; the catalogue is a list with a picture, name, rarity, price and a Buy button in every row.
- My table opens on a new page: your whole set-up at a glance (the table with your board, checkers and dice, your avatar and rank), slots for board, checkers, dice, table, win and dice effects, frame, look and chat wheel — tap a slot to change it — and what you got most recently.
- Rated games need a nickname.
- Calibration: the first 10 rated games keep your rating hidden (the home card shows “Calibration 3 of 10 · 2 won”); after the 10th you get a rating by your wins — 0–5 Rookie (1000–1180), 6–7 Regular (1230–1320), 8–9 Expert (1470–1600), 10 Master (1760) — with a reveal window. The leaderboard shows only placed players. Needs the updated game function on the server.

## 0.14.0-beta.10 — 6 Nov 2026
- Chat wheel, like in Dota: you choose up to 10 emoji, phrases and voice emoji for your wheel in My table → Chat (tap to add, tap a slot to remove). Everything you own stays in your collection, but only the wheel shows up in a game.
- In a game a round chat button sits on the right of the board. On a computer it opens a round wheel in the middle of the screen; on a phone a panel with two rows of five big buttons slides up from the bottom.
- One message every 15 seconds; the button shows the countdown around it.

## 0.14.0-beta.9 — 6 Nov 2026
- Economy: coins per game are now a random amount — win vs a person 120–180, loss 40–60, vs the practice bot 30–50 / 5–15. A mars win pays +50 %, and 5 % of games vs people are a “Lucky game” that pays double (with a coin rain).
- New players start with 1000 coins instead of 500.
- Both Druzi cases cost 400. Epic items: boards 800, checkers 650, dice 500; legendary: boards 1500, checkers 1200, dice 900. Common and rare prices unchanged.
- “I want this” goal: in any item or set card you can mark it as your goal. The shop home shows a progress bar, and after every game you see how much is left.
- Server wallet (when deployed) pays the same way.

## 0.14.0-beta.8 — 6 Nov 2026
- New **Druzi Case 2 · Night**, 300 coins, same odds as the first one (40 / 30 / 20 / 6 / 3 / 1 %). The Cases page now has a switch between the two cases, and the shop home shows both.
  - Common: pizza dice Margherita, Salami, Four cheese, Hawaiian; checkers Cappuccino, Latte, Raspberry tea, Eastern tea.
  - Rare: roll checkers seen from the top (Philadelphia, California, Bonito, Golden samurai); burger dice BBQ, Spicy (glowing pips), Chicken.
  - Epic: chat phrases “One more round? 🍹”, “Hookah’s on us! 💨”, “Separate bills, please 🧾”; avatar frames Druzi neon and Smoke ring; card background “Night at Druzi”.
  - Mythic: Sushi set board (bamboo mat, rice and nori points), Bar counter board (dark wood, neon strip), Hookah embers dice (pips glow), Black violet checkers, Evening hall table.
  - Legendary: win effect “Druzi delivery” (a scooter rides across throwing pizza, burgers, sushi and cocktails), dice effect “Smoke rings”, animated frame “Druzi Live”.
  - Secret: sounds Sizzling grill, Ice in a glass, Can opening, Cheers!, Scooter horn (Freesound, CC0).

## 0.14.0-beta.7 — 6 Nov 2026
- “Mega Aperol 3 L” win effect redone: a real animated spritz glass (“cocktail mix” by Xavier Ledieu on LottieFiles, Lottie Simple License) recoloured to Aperol orange, played big over the board with a warm glow, the clink of glasses and confetti. The animation and its player load only when the effect is used.

## 0.14.0-beta.6 — 6 Nov 2026
- Two new rarities: Mythic (between Epic and Legendary) and Secret (above Legendary).
- Druzi Case rebuilt from the bar’s real menu, 300 coins, odds 40 / 30 / 20 / 6 / 3 / 1 %:
  - Common: dice B-52, BMW, Medusa, Audi; checkers Citrus lemonade, Raspberry lemonade, Mojito lemonade, Sea-buckthorn tea.
  - Rare: dice Green Mexican, Hiroshima, Espresso; checkers Aperol Spritz, Cosmopolitan, Piña Colada, Paloma.
  - Epic: checkers Negroni, Naked Lady, Purple French; avatars hookah master, waiter, admin.
  - Mythic: Druzi bar board and table, Yin-Yang roll checkers, Golden roll dice, Druzi menu emoji for chat.
  - Legendary: neon Druzi board (the sign now flickers), win effect “Mega Aperol 3 L”, dice effect “Hookah smoke”.
  - Secret: the five bar sounds.
- Guaranteed epic or better every 10 cases; duplicates give 40 / 90 / 200 / 500 / 1200 / 3000 coins.
- Items that left the case are swapped for their new versions (Hot coals → Espresso, Blue Lagoon → Piña Colada, Mojito → Paloma).

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
