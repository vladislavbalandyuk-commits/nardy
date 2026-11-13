# Changelog — нарди (nardy-nine.vercel.app)

Versions: **patch** (0.13.1) — small fixes; **minor** (0.14.0) — new features; **1.0** — the big redesign.
The beta at `/beta` is not versioned until its features reach the main site.

## 0.65.0 — 13.11.2026
- Evening prime time 21:00–22:00 Kyiv (shown in local time): full games pay coins ×2 (`gc.hh`), and each counts for the arena (`ach.ar`: win 3, mars 4, loss 1).
- Server action `arena`: the evening table (top 20 + your place) and `claim` — top 3 get 500/300/200, 3+ games +100, once per evening (claimable until the next prime time).
- Home «Today» tile with countdown / live points / prize, the arena sheet, a bell item for an unclaimed prize; the 19:00 reminder mentions prime time and now has Russian text; push language can be `ru`.
- Pasha's tour: g35. Test flag: `nardy_primeTest`.

## 0.64.0 — 13.11.2026
- Static pages for search engines (`tools/seo.py`): “long nardy online”, rules (+ terms, FAQ with FAQPage JSON-LD) and the daily puzzle in uk / ru / en / ka / hy — 15 pages with hreflang, canonical, Open Graph; `sitemap.xml`, `robots.txt`.
- `?lang=uk|ru|en` sets the site language (used by the pages' buttons).
- Settings → Help → Rules page (follows the site language). Pasha's tour: g34.
- Georgian and Armenian UI translation moved later; for now those pages lead into the English/Russian site.

## 0.63.0 — 13.11.2026
- Russian language (2385 strings): `src/ru.json` → `ru.js`, loaded only for Russian; missing keys fall back to Ukrainian.
- Browser language ru/be/kk/ky opens Russian by default; new Telegram users with a Russian client get Russian.
- Locale helper `LOC()` for dates/times; the Telegram login widget follows the language; «What's new» shows `ru` entries (falls back to English).
- Pasha's tour: step g33.

## 0.62.0 — 13.11.2026
- App manifest for installing / Google Play: id, dark splash and theme (#0d0e11), categories, launch handler, shortcuts (Play a bot `?go=bot`, Daily puzzle `?go=pz`, Daily gift `?gift=1`), four screenshots (`/shots/*.webp`, narrow + wide).
- The browser/window colour follows the site background.
- Landscape phones: Pasha's tip moves to the side panel during a game.
- The Android (TWA) build itself waits for the Google Play account.

## 0.61.0 — 13.11.2026
- Evening reminder at 19:00 Kyiv, once a day, to players with a live streak (≥2) whose gift is not claimed: by the Telegram bot (button opens the gift) or web push. `push-tick` workflow runs at 17:03/17:33 UTC; the server keeps `rem_sent.json`.
- Off/on: the bot's /stop and /remind, or the «Evening reminder» switch in Settings (server action `rem`, `ach.noRem`).
- Telegram: haptics through `Telegram.WebApp.HapticFeedback`; an «Add to home screen» card after the 3rd visit (`addToHomeScreen`, skipped if already added); `#gift` / `?gift=1` opens the daily gift.
- The Telegram Mini App itself (bot, sign-in, invites) was already live from earlier versions.

## 0.60.0 — 13.11.2026
- Bring a friend: besides the sign-up rewards (300 / 200), when the invited friend finishes 5 games both get +300 (×2 in December) — paid by the server in `rate()` (`ach.ref5`, inviter `refAct`, `refGot`); a «Bring a friend» card on the Friends tab; the bell tells the inviter.
- Share a game: a 1080×1080 picture (result, score, avatars, mars, site link with the invite) from the summary — native share with the file, Telegram share, or download + copied text.

## 0.59.0 — 13.11.2026 — 🎁 big content drop 1
- New case «Show» (300): six chat sounds synthesised on the device (Zap, Boing, Drumroll, Wow, Siren, Ta-da!) and two big full-screen win shows.
- «Hookah master» (legendary): a giant hookah drawn in SVG rises over a dimmed screen, coals glow, smoke rings and the Fibonacci cloud drift up.
- «Nardy taxi» (epic): a taxi (Microsoft Fluent Emoji 3D, MIT, recoloured violet) drives in, honks, and dice and checkers fly out.
- Three new sets (−20%): «Mint morning», «Ruby evening», «Lavender dream».
- Phrase pack «Songs of 3 кента» (titles of Vlad's band's tracks).
- Pasha's tour: shop step. (Radio, planned for this drop, shipped early in 0.54.)

## 0.58.0 — 13.11.2026
- «With a bot» opens a picker: Marta (easy), Ostap (medium), Taras (strong), Hryts (master) with a line about each; the winter guest Snowman (December–14 January) plays on the «Іней» board.
- Practice (default on): no rating change (server `st.unrated` from `create` arg `pr`); the «Coach's hint» button highlights the best first move (blue — from, pink — to), computed with zero noise.
- Content: Snowman bot persona with its own SVG avatar and table.
- Onboarding still starts a game at once; Pasha's tour: picker step.

## 0.57.0 — 13.11.2026
- Player level 1–50 (XP: games ×10, wins ×15, achievements ×40, puzzles ×8, chapters ×30, course ×20, best daily streak ×10; step 100+20·(L−1)); level card on the achievements page; prizes every 5 levels (level × 20 coins) via server action `lvl`.
- Quests of the week: 3 per Kyiv week (distinct kinds), up to +500, one swap a day (`rewards` ops `wquest`, `wrr`); winter header in December.
- Titles: any collected achievement can be the title under the nickname (server action `title`, `ach.tt`); shown in game strips to opponents (`st.tts`, kept on rematch).
- The bell in the header: daily gift, finished daily/weekly quests, ready achievements, level prizes, new version; on phones the Learn icon leaves the header (it is in the bottom bar).
- Pasha's tour: bell step.

## 0.56.0 — 12.11.2026
- Challenge of the day: a 4th, harder daily task with a bigger prize (c_mars 200, c_human2 150, c_win3 150, c_game6 120), picked per Kyiv day on the server, never the same kind as the regular quests; highlighted in every quest list.
- Daily gift: day 7 is now 300 coins; «freeze» — one missed day a week keeps the streak (server `dfz`); the best streak is kept (`dmax`).
- Content: achievement «Hoarfrost week» (7 days in a row) gives the new winter board «Іней» (icy lanes with frost specks).
- Desktop: the footer is gone; «How to play», «Ranks» and the credit moved into «Events».
- Pasha's tour: challenge/streak step.

## 0.55.0 — 12.11.2026
- Home: «While you were away…» card (shown once a visit after 6+ hours): new puzzle, ready gift, new version, tournament, radio.
- Desktop right column: «Events» block — tournament, Nardy radio on/off, what's new.
- Rank card shows «N to <next rank>» on phones too.
- «With a friend» is active for guests and explains that signing in is needed.
- +200 coins once for every registered account (server flag `g200`); the guest summary says so.
- New Year countdown tile in «Today» from 1 December to 7 January (Kyiv); new «tree» line icon.
- Pasha's tour: New Year tile step.

## 0.54.0 — 12.11.2026
- Nardy radio: six tracks by «3 кента» (Кальян в друзях, Дві по п’ятдесят, Дим не йде, Густий туман, Торт, Вдих-Вдих), loudness-matched, 128 kbps, streamed only when turned on. Settings toggle + volume, a mini player (cover, next, pause, off), «…» menu items at the table; ducks under voice phrases; resumes on the first tap after a reload.
- After an online/ghost game: «New opponent» button starts a new search.
- Search screen: rotating nardy tips.
- Winter: light snow on the home screen from 1 December to 14 January (Kyiv), with a settings toggle.
- Admin: real online — now, today's peak and time, 7-day peak chart, by-hour chart (one lobby client reports every 5 minutes to the new `online_log` table); economy — cases opened, items owned, coins-in-hand buckets.
- Pasha's tour: radio step.

## 0.53.0 — 12.11.2026
- Phone table: the «your turn» panel and the dice button move under the board when there is room, so nothing covers the checkers; the button is full-width for the thumb.
- The opening roll happens by itself in games with a bot and online.
- After a game «+N coins» shows once (in the summary), not as an extra toast.
- Pages slide in softly; a light buzz on tab taps (respects «calm» and reduced motion).
- Content: two new self-made effects in the «Night city» case — «Starfall» (win, rare-epic) and «Lightning» (roll).
- Pasha's tour: step about the new table layout.

## 0.52.1 — 12.11.2026
- «Today» tiles: the icon and the arrow are centred vertically (they sat at the top of taller tiles such as the tournament).

## 0.52.0 — 12.11.2026
- Reconnect: when the live game channel fails, a quiet line «reconnecting…» shows and the channel is reopened with growing pauses (2 s → 30 s), each time re-reading the game; on success the line goes and «Back in the game» shows.
- The game is re-read at once when the network returns (`online`) or the page becomes visible again (phone back from the background), and every 15 s during an online game as a safety net against missed moves.
- Fix: the 0.51 tap-area rule replaced the toggles' knob (it is their ::after) and the switches in Settings looked broken — fixed; now a tap anywhere on a settings row switches its toggle. The other enlarged hit areas use ::before.
- Resume after closing: the online game you are in is kept on the device (cleared when it ends or you leave); opening the site again without a link shows «You have an unfinished game · Back to the game» (checked on the server: still running, you are a player, under 6 h old); × forgets it.

## 0.51.0 — 12.11.2026
- Readability: captions under 12 px raised (tab bar 11 → 12, chips and badges 11–11.5 → 12), small descriptions 12–12.5 → 13 (Today tiles, rank card, achievements, Learn cards, phone table strip, online line).
- Tap targets: toggles, the coin pill, footer links and the shop back button get an invisible 40 px+ hit area; settings buttons, shop tabs and the settings menu at least 40 px tall.
- Settings → «Large text»: built once from the site's own CSS (every px font-size × 1.15 under body.bigfont, media queries kept, the board and avatars untouched); in «Reset settings».
- Line icons (one stroke set; the puzzle piece from Lucide, ISC licence) instead of emoji in Today tiles, Learn cards and empty/error states.
- Content: «Contrast» board (200) and checkers (300) — black/white, high contrast. Pasha's tour: a step about large text.

## 0.50.0 — 12.11.2026
- Traffic sources: an early head script reads the source once per device (?src=, utm_source + utm_campaign, Telegram start_param `src_…`, friend/invite links, else the referring site mapped to google/telegram/facebook/instagram/threads/tiktok/reddit/x/youtube/crazygames, else «direct»), keeps it in localStorage and removes the marks from the address (so the newcomer steps are not skipped by a ?src link). Sent once to the server for any player with a profile, guests included (`src` action, never overwritten).
- Admin → Stats: «Where new players come from (30 days)» — per source: new players (with an account), played a game, back the next day, back within 7 days (with how many were old enough); «Links for posts» — ready ?src= links (Telegram chats, Threads, Facebook, TikTok, Instagram, QR) with Copy, plus a custom mark.

## 0.49.0 — 12.11.2026
- Speed: Google font no longer blocks the first paint (variable Jost 300–800, one file per alphabet, loaded non-blocking); preconnect to jsDelivr and Supabase.
- The page gets the network first: avatars (av.js) and item skins (skins.css) start after the page itself instead of competing with it (slow 4G, 4× slower CPU: home ready 2.2 s → 1.9 s).
- Tried moving rare screens' CSS to the late stylesheet — it changed the cascade (shop layout on phones), so it was rolled back.
- Portraits (pt.js) load 3.5 s after the page has loaded, or at once when a portrait is needed.
- Service worker cache: versioned files (?v=), sounds, effects, fonts and fixed-version libraries come from the cache; the page is network-first (cache only when offline or >4 s). Hashed files get a one-year immutable cache header.
- Content: phrase pack «Between friends» (6 phrases, 300 coins, client + server). Pasha's tour: a step about achievements.

## 0.48.0 — 12.11.2026
- Achievements 2.0 (plan item 0.63 brought forward): 30 goals in 6 groups — game (wins 1/10/50/100, games 50/200, mars 1/5, streaks 3/5, comeback, beat +300), ranks (Regular, rank 4), learning (lesson, whole course, daily puzzle, 7-day puzzle streak), campaign (1/4/8 chapters), contests & friends (a tournament, top 3, first friend, 7 visit days, a phrase online), collection (first item, a case, 20 items, a replay).
- Rewards: coins 50–500 or 9 achievement-only things (not sold, not in cases): boards Triumph, Yard; checkers Veteran, Champion; dice Laurel, Scholar; voice phrases Gong, Harp, Bell (synthesised on the device, in Collection → Phrases → «For achievements»).
- Server action `ach`: `claim` re-checks the goal against the profile (counters, peak, tut, stc, pz, camp, tp, friends, days, owned, cases) before paying, once per goal (`ach2`); `flag` stores the two goals only the site sees (chat, replay) — those pay coins only. Puzzle: the server now keeps the solved count and best streak.
- Guests: the same list with local progress and local coins/items.
- UI: profile tab «Achievements» and a page from «Learn» — progress ring, «Take all», cards with progress bar, reward chip, «Take» / ✓; one hint per newly done goal and a purple dot on the Profile tab.

## 0.47.1 — 12.11.2026
- Shop showcase: «New» shows at most 4 items (ones you do not own first, one per kind where possible); the link reads «All new (11) →» and opens the shop with the «New» filter.

## 0.47.0 — 12.11.2026
- One set of states: `skel(n)` shimmering placeholder rows (still with «fewer animations»), `emptyEl` (icon, title, text, one action), `errEl` («Something went wrong» + «Try again»).
- Loading: leaderboard, rank page (rating / tournaments), league — skeleton rows instead of «Loading…».
- Empty: leaderboard (Play), friends (Invite friends), my games in the profile (Play), shop filter (Show everything), move history.
- Error: leaderboard load failure with «Try again».
- Offline: a line at the bottom («No connection — games with the bot and on one device still work»), a toast when the connection is back.

## 0.46.0 — 12.11.2026
- Profile (signed-in) in three tabs under the player card, sticky while scrolling: Overview (showcase, campaign, fun numbers, looks, invite friends / nick for guests), Games (form, activity, recent games; count on the tab), Achievements (n / total on the tab). The last tab is remembered; switching keeps the tab bar in view. The player card on the left and the footer (sign out / close) stay as they were.

## 0.45.0 — 12.11.2026
- Settings search (sticky field at the top): filters rows by their label and description, a section title match shows the whole section, «nothing found» note, × and Esc clear; the section menu dims while searching.
- «Reset settings» (Help section) with a confirm window: odds on, auto-roll off, undo hold on, sound / campaign sounds / hookah bubbles / vibration on, dark theme on, fewer animations as the system asks, board not flipped. Items, coins, rating, language and notifications are not touched; the toast says how many switches went back.
- Descriptions added to «Dark theme» and «Language» — every switch now has one.

## 0.44.0 — 12.11.2026
- 11 new shop items (client + server prices by rarity): boards mint (c), slate (r), rosewood (r), lavender (e); checkers ruby (r), copper (r), obsidian (e), opal (e); dice sapphire (r), jade (r), pearl (e). All CSS, no outside images; no gold/amber.
- Shop: «New» filter (in categories that have new items), a purple dot in the category menu while something new is not yours, «New» badge on store cards; the hero follows the filter (first item of the filtered list).
- Test drive: «Play the bot with it» on items you do not own — the look goes on for one bot game and comes off when you leave the table (nothing saved or bought).
- Phones: smaller try-on board in the hero, filter row wraps.
- Already in place from earlier versions (0.44 audit items): one card template, owned/not-owned filter, try-on on a real board.

## 0.43.0 — 12.11.2026
- Resign visible: phones — a flag button in the top strip next to «…»; desktop — the flag button gets the «Resign» label (icon only on landscape phones). Too early (before move 10) → a toast with the reason and moves left instead of a dead button; the «…» menu item does the same.
- Turn clock: the next player's time starts 3 s after the turn passes (server and client), so the opponent's move animation is not eaten from your time; the ring never shows more than the full time.
- The seconds counter on the board banner shows only on your own turn.
- Draw offer: not added — long nardy has no draws by the rules, and a draw would change rating, matches and tournaments; left for a decision.

## 0.42.0 — 12.11.2026
- Game summary (win window rebuilt, its buttons keep their logic): hero with both avatars (winner ringed green), result and big score coloured by win/loss; the game in numbers (your turns, doubles, game time, borne off); a chart of your winning chances through the game (lowest/highest marked); coins for the game (caught from the coin reward, also when the server pays later) next to the rating change; Rematch / Next as the main buttons, Review · Replay · Close as a row below.
- Phones: the summary is a bottom sheet.

## 0.41.0 — 12.11.2026
- Phone table (portrait ≤600 px, body.pg41): no site header; the opponent's card moves into a strip above the board (#gTop) with a «…» button; your card and the dice controls stay below; the board takes the whole width (checker size up to (width−10)/12.95, ~+7%) and is centred in the free height; nothing scrolls.
- «…» menu (bottom sheet): link, voice chat, opponent sound, emoji (online only where they apply), move history and rules (in a sheet), Resign, Leave the table — each calls the existing button, so the logic is unchanged.
- Odds bar, history and rules blocks hidden on the phone table; the phrase wheel moves to the top right; the tab bar is hidden in a game.
- Desktop, tablets and landscape phones unchanged; rotating/resizing moves the card back.

## 0.40.0 — 12.11.2026
- First visit in 3 steps (store `ob40`: q · tut · game · done): 1) «Do you know the rules?» — Yes → a game with the bot, No → the interactive lesson; 2) after the lesson — «Now a real game» with the bot; 3) after the first game — «Keep your progress» (create an account / later → Pasha's tour).
- New guests no longer get the sign-in popup at load, and Pasha's tour waits until the onboarding is over; «Skip» ends both.
- Only for guests who have not played, finished the lesson or seen the tour; signed-in players and Telegram skip it; invite links are never interrupted.

## 0.39.1 — 12.11.2026
- Pasha's tour: the «other ways to play» step works on phones again (it looked at the hidden desktop chips).

## 0.39.0 — 12.11.2026
- Phone tab bar: Play · Learn · Shop · Friends · Profile (Tournament and Rating tabs replaced). The bar stays visible on the shop, the friends/rating page, the Learn page and the profile, marks the current tab, and switching closes the other page.
- New «Learn» page (#learnPg): the campaign as the big card (current chapter, progress, Play), the course with Vlad and Pasha, the daily puzzle, How to play, Rules and ranks, Pasha's tour. Desktop: a book button in the header; Esc closes.
- Friends tab opens the rank page on «Friends» (Rating / League / Tournaments tabs are there).
- Pasha's tour: new step for «Learn», tab-bar text updated.

## 0.38.0 — 12.11.2026
- New home page: one big «Play» (quick game vs an opponent of your level, falls back to a bot) with three chips under it — Vs bot / Friend (lobby) / Local; the separate bot, lobby and local cards are gone.
- «Today»: a heading and exactly three tiles — puzzle, gift and a third one: the tournament on its weekend (the big banner left the home page; it lives in the Tournament tab), otherwise the campaign / course / friends.
- Open lobbies show only when there are some; the top-3 card and the leaderboard button left the phone home (Rating tab).
- Desktop hero: the same big «Play» + chips.
- Phrases case: new epic voice phrase «Ho-ho-ho!» (Freesound CC0).

## 0.37.2 — 12.11.2026
- Collection → Phrases: the chat wheel (10 slots, tap to take off) and every phrase grouped by Basic / each pack / the case; tap to put on or take off, ▶ to listen; locked ones lead to the shop or the case.
- «What's inside» of the Phrases case: ▶ on every voice phrase, bubbles no longer cut off.

## 0.37.1 — 12.11.2026
- Cases open to everyone (client and server gates removed).
- Phrases: shop category with 3 text packs (Yard, Manners, Hookah lounge — 300/300/400) and 2 voice packs (Bar, Show — 1000 each; listen before buying); bought phrases go onto the chat wheel.
- New «Phrases» case (250): 7 text phrases and 6 voice phrases not sold in packs; legendary «Champion!» and fanfare.
- Fix: phrases in online games arrived as 👋 (the filter compared 4 characters to «ch»).

## 0.37.0 — 12.11.2026
- Avatar collection regrouped: filter chips (All / Mine / Story / From cases / Basic / Packs), a card per group with owned count, each portrait pack its own group with a «Pack · price» button.
- Phone pass: shop tabs scroll and keep the active one in view; deal-of-the-day board no longer collapses; neon sign fits narrow screens; avatars 5 per row.

## 0.36.3 — 12.11.2026
- Case cards: buttons aligned at the bottom; Night city hover is a soft blip instead of the neon buzz.

## 0.36.2 — 12.11.2026
- Fix: with a photo table the home page cards were painted under the table photo (positioned ::before over static cards) — home stage now sits above it, photo dimmed.
- Fix: card-background preview name used the campaign class .cpn (absolute, glass) and covered the rank — renamed .cdpn.
- Night city case: dice Skyscraper, Disco ball (legendary), Metro; avatar «DJ» (Notionists CC0 n9 + neon headphones, glasses, skyline); win effect «Neon sign» with buzz and hum; vinyl scratch when the DJ drops.
- Hookah case: dice «Hookah coals» and «Mint ice».
- Hookah bubbles while moving on the Fibonacci board (setting «Бульбашки кальяну»).
- Campaign page shows the current exclusive table and when the next one comes.

## 0.36.1 — 12.11.2026
- Hookah case rebuilt around the hookah: board «Fibonacci hookah» (golden-ratio spiral), checkers Fibonacci, Forest mix, Double apple, Glowing coals; Druzi menu nods — Aperol Spritz and Mojito lemonade checkers; avatar «Hookah master» (from Notionists CC0 n4: fez, hose, smoke); win effect «Fibonacci cloud».
- Night city case: win effect «Lanterns».
- New synthesized sounds: hookah bubbling, neon buzz, lantern chime. Cases still admin/testers only.

## 0.36.0 — 12.11.2026
- Campaign chapters are played at their own tables (Unsplash photos): bench in the snow, autumn park, café, «The Cloud», dining car, tavern candle, basement, black marble, red curtain.
- These tables are not won in the campaign: the showcase sells one of them as an exclusive for 3 days (900 coins), then the next (server checks the window).
- Cases: photo backgrounds instead of gradients; synthesized sounds (whoosh, swell, stop thud, shimmer, legendary fanfare, hover blip), the reel marker pulses on each tick.

## 0.35.2 — 12.11.2026
- Cases (admin & testers only): «What's inside» sheet rebuilt — header, odds bar, rarity sections with uniform tiles; sounds for opening, reel ticks, every rarity and refunds.
- Case-only prizes: boards Stained glass, Azulejo, Synthwave, Hologram; checkers Lava, Galaxy, Holo, Stained glass; win effects «Mega Aperol 3 L» (the original beta Lottie) and «Delivery» (scooter throwing food).

## 0.35.1 — 12.11.2026
- Cases hidden from players while they are being reworked: the tab shows only for the admin and testers, the server op refuses others.

## 0.35.0 — 12.11.2026
- Showcase: «Set of the week» hero first (from the beta's showcase): one of the sets in weekly rotation, the things it includes as chips (owned ones crossed out), «Buy the set · price», «Try on», «separately … · you save …», time left; the deal of the day follows, a bit smaller.
- Cases (a new shop tab): «Hookah bar» and «Night city», 350 coins. Server op `case`: rarity rolled (c 55 / r 30 / e 12 / l 3 %, normalised to the tiers present), then a thing of that rarity you do not own yet; if none — a fixed refund (60 / 120 / 300 / 700); every 10th case without an epic gives an epic or legendary (`ach.cpity`). The page shows the odds, «What's inside» by rarity with refunds, the pity progress and how much of the case you own. Opening: a reel that slows down on the prize, then the prize card (wear in collection / again / close); reduced motion skips the reel.

## 0.34.4 — 12.11.2026
- Hooded avatars (vladM, mask) redrawn in tools/avgen.js: a symmetric cowl centred on the face (the face of the base drawing sits right of the head's middle), the ear covered, no straight hanging rim.

## 0.34.3 — 12.11.2026
- The beta is closed: the footer link is gone and /beta/* redirects to the main site (vercel.json, temporary redirect; the files stay in the repo).

## 0.34.2 — 12.11.2026
- Take back the last move: when a move would end your turn, it is held for 2.6 s with a bar «Move done · Undo · Done» (and the board's undo button works); after that it is sent and the turn passes. For server games the held move is only sent on commit; undo sends `undo` only if earlier moves of the turn were sent. Not used in tournaments, the tutorial or with ≤20 s per move; setting «Take back your move».
- Phone shop: compact try-on (smaller board, price and button tighter), picking a card scrolls back to the try-on.

## 0.34.1 — 12.11.2026
- Home «Form» card: until there is a rating chart, a faint sample curve with the hint and «Play a rated game» fills the space. The phone play card title is «Play online» (the button stays «Find an opponent»).

## 0.34.0 — 12.11.2026
- Effects preview inside the tapped card (`runFx(..., host)` draws in an element; `previewFx(k, host)`), ▶ button on each effect card; the old preview always drew in the first card.
- Settings rebuilt as a full page: sticky header, section menu (side on desktop, chips on phones) following the scroll, cards per section (Game / Sound and vibration / Look / Notifications / Help / Account), the account form and admin/test buttons inside «Account»; light theme styles.
- Own profile as a full page (hero column + scrolling body); replay ▶ aligned in the recent-games rows.
- Film grain over the dark theme, tabular digits in stats, balanced headings. Phone home: the «Long nardy» heading block hidden.

## 0.33.2 — 12.11.2026
- Tester role: the admin toggles it in «Players» (`admin` op `tester`, logged); `seen` returns `tester`. Testers get «🧪 Test mode» in settings (no admin panel): all skins on the device, the campaign testing tool (`test` action, op `camp_set`, own profile), show Pasha's tips / tour / news again. A «Tester» chip on the profile (own and others') and a `badge:tester` showcase item. The campaign tool is shared by the admin and testers (`campTestTool`).

## 0.33.1 — 12.11.2026
- Admin «Campaign (testing)» tool: open the whole campaign, stand before the Master / the secret chapter, set any progress, start again, show the scenes again (server admin op `camp_set`, own profile only).
- Admin «all skins» now also opens campaign card backgrounds and the locked avatars (Vlad, Pasha, hooded Vlad, festive Pasha).
- Finished chapters list all three scenes to watch again.

## 0.33.0 — 12.11.2026
- Lobby setup redesigned: quick rule sets (Classic / Blitz / No doubles / Long evening), groups «Rules» (to, time, doubles; «More rules»: head, mars, hints, first move), «Table», «Who can join»; a sticky footer with the rules summary and «Create the lobby».
- «My table for both» (on by default): the host's board, checkers, dice and table go into `rules.sty` (server keeps only safe names); both players' screens use them during the lobby game (`hostLookSync`, own look restored after; shop enforcement paused meanwhile).
- New rule `first`: 'roll' | 'host' | 'alt' (host in odd games, guest in even) — applied by the server at join / next / rematch (`lobbyStart`).
- Settings: «Auto-roll the dice» (off by default). Puzzles (daily and campaign) put their dice on the board at once. Phone home: the subtitle under «Long nardy» is hidden.

## 0.32.0 — 12.11.2026
- Game replay: the server keeps a compact replay of your last 8 games in `ach.rp` (start position found by undoing the recorded moves from the final board; base-32 board + per-turn colour/dice/moves). Profile «Recent games» rows get a ▶ button; the game-over sheet has «Replay the game» (encoded from the game in memory). A small SVG board viewer with step/play/scrub.
- Head-to-head: `ach.h2h[opponentId] = {w,l,t,n}` for games against people (the 60 most recent); shown on a player's profile («Your score with …») and as a chip in the friends list.
- Profile showcase: `show` action stores up to 3 owned items (or the campaign badge) in `ach.show`; shown on your profile (with a picker) and on other players' profiles. The campaign progress card on the profile.
- Pasha's tips in the first 5 games (roll / move / head rule / no moves / bearing off), each once. Vibration on phones that support it (dice, your turn, win), with a setting.
- rh entries now keep the game id (`g`).

## 0.31.5 — 12.11.2026
- Pasha's tour (GUIDE) brought up to date: steps for open lobbies, the campaign, the «Form» card, the phone bottom menu; new texts for bot/lobby, coins (shop tabs), rating, friends, settings (campaign sounds, less motion); the course-friends step removed. Alternatives in a step highlight only the first visible element (`one`); fixed elements (the bottom menu) count as visible.

## 0.31.4 — 12.11.2026
- Campaign ambient sound (`CP_AMB`, `ambPlay`/`ambStop`/`ambSync`, WebAudio looped buffers, lazy-loaded from /snd, ~1.9 MB total, immutable cache): CC0/public-domain recordings from the Blanket library (yard, fountain, cafe, fire, wind, port) + sounds synthesized for the site (hookah bubbles, rails, basement, hall, midnight). Plays on the map (phone: follows the scrolled chapter; desktop: the selected one), in the chapter's scenes and games/puzzle. Setting «Campaign sounds» (also off with the main sound). snd/LICENSES.md.

## 0.31.3 — 12.11.2026
- Story rewritten: the Master (chapter 8) is the one who put obstacles in your way — to stop the man behind you; after his defeat Vlad walks in. Secret chapter 9 (Vlad, `vladM`, lvl 3; warm-up «Vlad's right hand», blockade, 20 s) is hidden from the map, counters and home cards (`campVis()`) until chapter 8 is won. Chapter 8 prizes no longer include avatars; chapter 9 gives fx:confetti, av:vladM, av:pasha2. vlad2 removed from the collection. New scene speakers: k (the Master unmasked, pt23), V (Vlad as the villain).

## 0.31.2 — 12.11.2026
- Campaign: removed «The Master's case» board, the clue chips and the suspect pick; the story stays in the scenes.

## 0.31.1 — 11.11.2026
- Campaign map redesign: the background is the chapter's own photo (blurred, cross-faded by an IntersectionObserver as you scroll), a glowing gradient road with flowing light on the walked part, twinkling stars, glass chapter cards (photo, place, opponent, 3 step bars, «Continue» on the current one), a progress ring in the header.
- Story rewritten with a mystery thread and cliffhangers; «The Master's case» board: one clue per chapter won (shown on the prize sheet too), a suspect pick before chapter 8 (`cpGuess` in local storage) and a different Pasha line at the reveal if you guessed Vlad. Scene progress bar.

## 0.31.0 — 11.11.2026
- Campaign rebuilt as a night-city map (SVG road, seeded skyline, fog past the next chapter; Vlad + Pasha ride along at the current chapter, only Pasha from chapter 5). Desktop: map + chapter panel; phone: map + bottom sheet.
- Every chapter = 3 steps: puzzle (pzMake('camp-n-31'), best or near-best passes, +30, server `campstep`), warm-up (server game from a set position — race / blitz / blockade / behind / no doubles — with lobby rules, +50, `camp` claim with `st.campStep=2`), boss (as before). `ach.cs` = steps done in the current chapter; the server refuses a step out of order (`camp_step`).
- Story scenes (`campScene`): arrival, before the boss, after the win; Vlad leaves a note after chapter 4; the chapter 8 boss is the hooded Master (`mask`) who turns out to be Vlad (`vladM`). New avatars vladM / vlad2 / pasha2 (remixes of the CC0 Notionists Vlad and Pasha, tools/avgen.js) given for chapter 8 and hidden as «???» until then.

## 0.30.6 — 11.11.2026
- Bug sweep (all pages × 1440/390 × uk/en): home hero spans both grid columns again on phones (`.sec:first-child` no longer matched after the tournament banner moved above it — now also `.sec:has(>h1)`); in-game header on ≤430px shows the gift as a dot instead of «+70» so the avatar isn't clipped; collection preview avatar scaled to 60% in the corner on ≤600px.

## 0.30.5 — 11.11.2026
- Desktop dashboard: cards in a row stretch to the same height; «Form» gets four numbers (games, win %, streak, best rating) and the chart grows to fill the card; the campaign card goes right under them with a «Play →» button; «Quests of the day» ends with the daily gift (claim right there).

## 0.30.4 — 11.11.2026
- Rating: a mars is ×2 (was ×1.2) — server `eloDelta`, calibration, the client preview, texts; ghost games the same (supabase/run/v8_mars.sql).
- Campaign page: prize chips are spans, so the gold coin inside them is drawn (the chip style hid it).

## 0.30.3 — 11.11.2026
- The daily gift streak (+50 … +150) and the quest rewards (claim buttons, pending and claimed amounts) show the gold coin icon, on the showcase strip and the home «Quests of the day» card.

## 0.30.2 — 11.11.2026
- Campaign: the 🪙 emoji (silver on some systems) is replaced with the site's gold coin (`coinify`) on the campaign page, chapter and prize windows and the home card.

## 0.30.1 — 11.11.2026
- Campaign: each chapter also unlocks a card background of its place (`CARDS` cp1–cp8, Unsplash photos, unlocked by `ach.camp`, «Prize of chapter N» while locked); prizes show it. Prize chips on the campaign page sit under the opponent's name in even rows.

## 0.30.0 — 11.11.2026
- Custom lobbies: «Create a lobby» opens a setup (points to win 1/3/5/7, time per move 10/20/30/60 s or none, doubles normal / none (re-rolled) / penalty (double N → this and N−1 more turns skipped, `st.skip`, `st.note`), head one/free (headLimit 15), no mars, no win-chance hints, open/by link). Server: `st.rules` (sanitized at create), `turnMs`, penalty in `roll`/`passTurn`, `finish` without mars, action `next` (match to N keeps the score), rematch of a match starts 0:0; custom games change no rating and count as practice for coins. Action `lobbies` (public): open lobbies waiting ≤30 min.
- Home: «Open lobbies» card (up to 4, «Join», refresh 20 s). Wait screen and game show the rules; the timer and claims follow the time setting; odds hidden when the lobby says so; «Next game» in a match, «Match won / lost».

## 0.29.0 — 11.11.2026
- Story campaign «The way of a nardy player» (`#campPg`): 8 chapters (yard bench → park → café → hookah bar → night train → port tavern → basement → Marble Hall), each a server bot game (`create` with `bot:'camp', camp:n`, noise / engine level per chapter, no rating change), intro + character line, prizes; a win is claimed with the new server action `camp` (checks the finished game, the order, gives coins + items once, `ach.camp`). Prize window, «Chapter N+1 →», the character's last word in the result window, «Back to the campaign». Entry: dashboard card, «Today» tile.
- Campaign-only skins (rarity x, «From the campaign»): boards Coupe, Shadow (slim, violet glow), Marble hall (emerald frame); checkers Sailor (rope ring), Crown (emblem); dice Park, Emerald.
- Effects from the beta: roll — hookah smoke, smoke rings, sparkles (next to your dice on your roll); win — fireworks, confetti. Collection → «Effects» (one per slot, preview on tap). Off with «Fewer animations». Images fx/smoke_07, snowflake, star_06, flare_01.

## 0.28.2 — 11.11.2026
- Friends tab redone: head card (friends count, online now, «Invite»), search with an icon and results in a box (✓ for those already friends), «Online» / «Offline» sections, rows with rank + rating, «mutual» chip, «Call» (primary when online); proper empty states. The rating page title follows the tab.
- Home side «Friends» card: online friends (up to 3) with a «Call» button, «all ›» link, «+ Invite»; loads the friends list if needed.

## 0.28.1 — 11.11.2026
- Home on a computer: the side panel hides what the dashboard already has (title, «Find opponent», «Play the bot», rank card, top card) and gets a «Friends» card (online count and avatars, «Friends», «Invite»). The dashboard gets a second row: «Top players» (top 5 + your place, points to the next; tap → leaderboard) and «Quests of the day» (progress, claim).

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
