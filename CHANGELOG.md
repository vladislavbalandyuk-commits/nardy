# Changelog — нарди (nardy-nine.vercel.app)

Versions: **patch** (0.13.1) — small fixes; **minor** (0.14.0) — new features; **1.0** — the big redesign.
The beta at `/beta` is not versioned until its features reach the main site.

## 0.146.0 — 2026-11-28
- Таверна: обрав героя в руці — між героями на столі з'являються «+», тиснеш, куди поставити (позиції 1…n+1).
- Таверна: екран пошуку гравців перед грою (8 місць заповнюються, звук пошуку, «Скасувати»).
- Без кнопки «До бою»: бій стартує, коли спливає таймер; таймер більший, останні 10 с червоний і пульсує.
- Спільний пул копій (★1 16, ★2 15, ★3 13, ★4 11, ★5 9) для гравця й ботів; продаж і скидання повертають у пул; «У пулі ще: N» в інфопанелі.
- Монети за місце 120/90/70/50/30/20/10/0, ліміт 600 на день; серверна дія `tav` (start/end, перевірка тривалості).
- Більші суперники зліва (до 64 px), ім'я при наведенні, тряска при втраті серць; політ купленого героя в руку; удар по твоєму герою з цифрою.
- Баланс: Шулер (1): +1/+2/+3 золота; Сомельє — кожен 2-й хід; Хан (1): +3 ♥. Стіна 1/4, Туз 5/4, Круп'є 7/5, Капітан 5/8, Тінь 3/3, Лавочник 4/4, Чайник 1/3. Чарка коштує 2, Удача шулера 1, заклинання 35%. Боти з 6-го раунду купують gold/3, ріст 25%.

## 0.145.1 — 2026-11-28
- Турнір тимчасово зачинено: картка сіра з «🔒 Зачинено», вхід, реєстрація й сповіщення вимкнені (openTour/tregOpen/tourFindMatch/ntfTourCheck), тост пояснює.
- Таверна: стіл-килим (текстури mahog/fcarpet/fwood), прилавок з махагону.
- Герої в овальних портретах; атака — сталевий синій щит, здоров'я — червона крапля; ім'я на стрічці (на телефоні приховане).
- Суперники зліва — круглі портрети з кільцем здоров'я, наступний світиться ⚔; на телефоні дві колонки.
- Бій: прилавок від'їжджає, обидва загони на одному килимі.
- Вільні місця з «+», при перетягуванні світяться зеленим.
- Зірки таверни — окрема табличка, по центру.

## 0.145.0
- Таверна: стіл «Сцена» на весь екран (прилавок + сукно), перерозкладка лобі, руки, героя, таймера для ПК / горизонталі / вертикалі.

## 0.144.3
- Таверна: портрети героїв з аватарів магазину (TV_AV), корчмар pt42, боти — серія n/m.

## 0.144.2
- Таверна: горизонтальна розкладка для телефона (landscape, висота ≤540), прохання повернути телефон у вертикальному положенні (fullscreen + orientation.lock, Telegram requestFullscreen), можна грати вертикально.

## 0.144.1
- Таверна: рівень ★5 (вітрина 6), 5 героїв рівня 5; SVG-іконки — медальйони (кнопки, сила) і самоцвіти (значки).

## 0.144.0
- Таверна v3: вибір героя з силою, drag&drop, інфо-панель з діями, заклинання, відкриття, боти з власними столами, наступний суперник/перегляд столу, анімації й звуки на кожен ефект, навчання й довідник, отрута/друге дихання, швидкість ×2.

## 0.143.0
- Таверна v2: розкладка Battlegrounds (вітрина зверху, рука знизу, лобі ліворуч, таймер праворуч), 19 героїв з власними ефектами, пасивки фракцій, велика картка-підказка біля героя.

## 0.142.1
- Таверна: анімації бою (випад, удар-меч, цифри), таймер найму 40–80 с, шухляда корчмаря (⟳ ❄ ★), картка героя, музика 120/121, нагорода за золотого, ліміт шкоди 5/10/15, баланс ботів. Картка в меню — фото Freepik (кредит у licenses).

## 0.142.0
- Режим «Таверна» (бета, клієнтський прототип проти 7 ботів): найм/продаж/оновлення/рівень таверни, 16 героїв з 8 здібностями, автобій з анімацією, злиття трьох у золотого, кінець гри з місцем. П’ята картка в головному меню.

## 0.141.3
- Відкат капсули радіо 0.141.2: повернуто старий плеєр з кнопкою ⇄ станцій.

## 0.141.2
- Радіо: #radPill — капсула з платівкою (крутиться під час відтворення), ⏯ ⏭ гучність ×.

## 0.141.1
- Частина II: випробування blitz замінено на «Прорив крізь варту» (c2Breach): позиція зі стіною ≥4 пунктів, правильні ходи — ті, що зменшують кількість шашок за стіною.

## 0.141.0
- Турнір: етапи sw/po/f зі своїми дошкою, шашками, столом (TR_ST) — застосовуються лише на час турнірної партії, вибір гравця не змінюється.
- Звук етапів (CP_AMB 120–122 + синтез trPad), прев'ю на сторінці.
- Сторінка турніру: фон етапу, «Три етапи — три столи».

## 0.140.5
- Виправлено: старі стилі .hsMode.main:hover робили картку онлайн білою.

## 0.140.4
- Телефон: нижня панель-капсула (tv6) без підписів, кругла «Грати» по центру.
- Логотип у меню: кубики 6+5.

## 0.140.3
- Головне меню «B · карти режимів»: фото-картки, сталий фон fcabin (з 15.12 по 14.01 — nysnow).
- Телефон: cover-flow карток зі свайпом, нижня панель-плитки замість кутових кнопок.
- Хрестик у «Що нового» по центру.

## 0.140.2
- Номери пунктів сховані за замовчуванням (body.pnums), перемикач «Номери пунктів» у налаштуваннях; у навчанні завжди видно.
- Кнопка радіо в головному меню (.hsRad) з еквалайзером, коли грає; бейдж «0» на дзвіночку прибрано.
- «Що нового» на телефоні без опису поверх картинки.

## 0.140.1
- Сторінка «Подарунки» (#giftPg, варіант A «Календар»): 7 днів, кнопка «Забрати», завдання дня, тижневі завдання; openRewards веде сюди; Escape/назад працює.
- Колекція за макетом «Твій набір»: зліва прев'ю, 8 слотів, образи, прогрес; справа сітка вибраного виду з фільтрами.
- rwStrip більше не показується на вітрині.

## 0.140.0
- Новий магазин: вкладки Вітрина і Кейси в одній оболонці однакової ширини; Колекція — окреме вікно з кнопкою «До магазину».
- Вітрина: набір тижня, панель кейсів, «Сьогодні на вітрині», список бажань, каталог з фільтрами і «Показати ще».
- Нова картка речі: примірка/зблизька/гра з ботом, звуки в грі, купівля, список бажань.
- Виправлено: кнопка «Кинути кубики» лишалась видимою після кидка (display:flex!important перебивав .hidden).
- Виправлено: після знайденого суперника на мить видно було екран під пошуком — картка тримається до старту партії.
- Пошук суперника: тихий фон (нічний шум, теплі акорди, м'який пульс), вимикається з налаштуванням фонових звуків.

## 0.139.7
- Нові іконки «назад» і «закрити» по всьому сайту: тонка стрілка й хрестик замість квадратика й червоної стрілки.

## 0.139.6 — 27.11.2026
- «What's new» as stories (variant B): the last eight x.y.0 releases are full cards (photo, title from NW_META or the first line, up to four lines, «Try it» to the feature when there is one), 8 s auto-advance with progress bars (paused on hover, off in calm mode), tap left/right to move; a side list of stories, small fixes folded, «All updates» shows every version as cards.

## 0.139.5 — 27.11.2026
- Home menu icons: a site-drawn set (HSI: shop, tasks, collection, friends, bell, gift, gear, exit, dice, book, swords, trophy, bot, link, phone) — filled, copper gradient (#hsg) with cream details.
- Top bar avatar: drawn with avatarInto(selfAv()) at 32 px with its frame (was a clone of another button, cropped); the nickname comes from the profile.

## 0.139.4 — 27.11.2026
- Part II map soundscape (ambient slot 101): wind, a quiet night and a distant train (CC0 recordings already in snd/) plus a slow synthesized chord pad (Am–F–C–G, 8 s per chord, low-passed, quiet bell notes). Starts when the Part II page opens, stops when it closes or a game starts; follows the «Campaign sounds» switch; a speaker button on the map toggles it.

## 0.139.3 — 27.11.2026
- Search: the new home layer stays (with its own photo background) while searching and is shown right on cancel; the search screen is opened at once — the legacy screen showed for a moment.
- «What's new»: a wide window (up to 1120 px) — the latest update as a big copper card, earlier ones as cards in a grid; full screen on phones.
- Adventures: the «New» chip and the chapter counter are gone from the books.
- Start screen (#boot, inline CSS in the head): covers the page until app.js has drawn the new home, then fades out (body.booted) and is removed; a 12 s CSS fallback hides it if the script fails. The static markup of the old interface was visible for 1–2 s while the 1.2 MB script loaded.

## 0.139.2 — 27.11.2026
- The old home, side menu and bottom bar are hidden by CSS from the first frame (no longer waiting for the 300 ms check); the new home layer shows by default on the home screen and is re-checked on every route() and on page open/close — the old interface flashed on load and after leaving a game.

## 0.139.1 — 27.11.2026
- New menu: pages are full width again (--sbw forced to 0 under body.hs) and the home layer shows only while home is open (body.hsOn) — the shop showed the menu's corner buttons on its left.
- Campaign steps (Part I and II) and the ending card use drawn icons (play, target, crown, fork, puzzle, swords, check) instead of ✦ ♚ ⑂ and emoji; the Part II chapter prize thumbnail is scaled to fit (dice side by side); the «Dawn» win effect has an SVG icon (fxIc/FX_SVG) everywhere effect icons are drawn.

## 0.139.0 — 27.11.2026
- Home in the Hearthstone manner (#hsHome, shown while home is open and no other page is): a console with the four modes (Play online → the old Play button; Adventures → new #hsAdvPg with both books; Arena → openArena; Tournament → openTour with a countdown tag), quick games (bot / friend / two players → the old buttons), corner buttons (Shop, Tasks → events page, Collection → shop «mine», Friends), and the account bar (coins, notifications, daily gift, settings, profile; exit only in Telegram). The old home stays underneath, hidden; the side/bottom menu is hidden.
- Pages that relied on the side menu (events, learning, rating, shop) get a back button in their top bar when they have none; the site-wide back knows the Adventures page.

## 0.138.0 — 27.11.2026
Speed pass (measured with Chrome traces, desktop 1440×900):
- Shop: `content-visibility:auto` on sections and cards — main-thread render work 2376 → 206 ms per 5 s (layerize was re-run for ~7.5k nodes every frame).
- Game: the board's `filter: drop-shadow` became a box-shadow — compositor time 1878 → 1046 ms per 2.5 s; dice and the last-move ring are on their own layers (ring animates transform/opacity) — board re-raster during play 2.8 s → ~0.25 s per 5 s; the «your move» ping animates transform/opacity.
- Campaign: chapter glow animates opacity on a pseudo-element; SVG star twinkle off; Part II candle without blur — raster 324 → 57, layerize 119 → 21 ms per 4 s.
- Search: the drifting photo is on its own layer; the home photo too.

## 0.137.2 — 27.11.2026
- Home hall tiles: the tile is a size container and the big number scales with it (clamp 16–30px, 9cqi), so long countdowns no longer run past the edge.

## 0.137.1 — 27.11.2026
- Game (computers): the board banner is just the roll button; the old dice hide while waiting for the roll; «Your move» + turn clock live in a chip in #gm2Top (gmTurnSync).
- Turn clock: the game function adds `_now` to every reply; the client keeps SRV_OFF (server minus device clock) and counts turn time with gNow(). A device clock behind the server froze the clock at 60 s.
- Player cards: name/details shrink and clamp to 2 lines; the score and odds chip keep their size.
- One back for the site (uiTop/uiBack): Telegram BackButton and Esc close Pasha's tour, case result, game menu, search, the top window, then pages (admin, achievements, arena, Part II, campaign, learning, events, shop, rating), then the game. News window got a close button; the campaign header is sticky.
- Home: the chosen table photo fills the screen behind the page (#h1Full), the hero card is transparent.
- Profile: the rank badge opens the rating page instead of the ranks info.
- QA sweep (34 screens × phone/desktop) and an Esc walk-through of 20 screens: every one returns home.

## 0.137.0 — 27.11.2026
- Icon style B «Duotone» (dark theme): the duotone layer of the Phosphor icons is stronger (.34) and icons are copper (#e0896f) in the nav and sidebar (inactive tabs; the green Play pill and the current tab keep their look), header icon buttons and pills (streak, gift unless lit/ready), the game bar, back buttons, ghost/secondary buttons. Disabled buttons keep their own colour.

## 0.136.6 — 27.11.2026
- Search screen: the chosen table (prefs.table, full-size TABLE_SW image) as a dimmed, slowly drifting backdrop with a vignette; the plain scene stays for «auto». Player cards get a frosted panel over the photo.

## 0.136.5 — 27.11.2026
- Search screen (mm119): opaque full-screen scene over the sidebar too (z 2600), copper/cream board points at the top and bottom, three pulse rings centred on the timer ring (--cx/--cy set in mmTick), nine checkers drifting up; still under calm / reduced motion.
- Case opening (u3Open): .u3obox is full width so the 1100px reel and the chest share one centre. On reveal the chest and reel are hidden (.rv) and the result card hops out in the chest's place with slow rarity-tinted rays behind it.

## 0.136.4 — 27.11.2026
- Phones: the roll button sits inside the player card (#plBot); redrawing the card (plCard → innerHTML='') destroyed it, so the game could not be continued. plCard now keeps #turnBanner, and renderBanner recreates it if it is ever missing.

## 0.136.3 — 25.11.2026
- Light buttons (h1play, s2main and the like): the cream glow under them is now a dark drop shadow.

## 0.136.2 — 25.11.2026
- Case reel: a full-width band (up to 1100px) with copper hairlines and faded edges, 120px tiles (88px on a phone) that show the whole item.

## 0.136.1 — 25.11.2026
- Icon audit (every button with a lone icon, 11 pages × 2 sizes): the dock logo and the game's back chevron were off-centre — fixed. Pasha's game tips are removed when the game ends. Mobile player cards: smaller percentage and score.

## 0.136.0 — 25.11.2026
- «Стіл у залі» is the default game look (`?gm2=0` brings back the old one).
- Win chances: a 9-input / 16-hidden tanh net replaces the 5-term logistic fit (same function on client and server). Trained on 1.83M on-roll positions from 50,000 bot-vs-bot games (5 noise levels, the game's own rules and bot); holdout (5,000 games, 182k positions): log-loss 0.547 → 0.503, Brier 0.189 → 0.173, accuracy 69.4% → 72.1%; last quarter of the game 81.8% → 89.4%; calibration within ±1 pt in every decile. Sim/fit scripts in tools/odds/.
- Odds UI: percentage chip on each player card, bigger bar and a chart of the chances through the game. Case phrase/voice tiles: a big emoji/quote mark and a waveform instead of a clipped bubble.

## 0.135.0 — 25.11.2026
- Amber removed for good: --hl/--hlSoft, last-move rings, legal-move glows, the old v7 CTA gradient and the voice-wait button are copper (#e0896f).
- Test look «Стіл у залі» for the game screen behind `?gm2` (off: `?gm2=0`): back chevron + mode in the header, the board lifted with a copper rim, player cards with a «Хід» tag, a one-line turn prompt, tile actions, 15-slot trays.

## 0.134.0 — 24.11.2026
- Case opening (ui2): a reel of the case's items spins under the shaking chest and lands on the prize, then the lid pops and the prize hops out.
- Part II rewards: the server grants the chapter's road item on the first boss win (`case` in the c2 response, shown with the same chest + reel), the endings' items (board:reborn, frm:mmask, dice:cheat, ck:oneway) and, for the secret epilogue, av:vdawn (animated SVG) and fx:dawn (win effect). New case «road» (400) with the nine road items. The map panel shows each chapter's item.

## 0.133.1 — 24.11.2026
- Removed every `text-transform:uppercase` (and the wide letter-spacing that went with it). Back buttons (part II, admin) and shop row arrows use a drawn chevron instead of a text glyph. Phone radio pill shows «next» again and hides the station-swap glyph (the cover/title open the station list).

## 0.133.0 — 24.11.2026
- Part II page: a map of Ukraine (Natural Earth outline via world-atlas, public domain; Crimea drawn as part of Ukraine) with the route between the nine chapters; a side panel on a computer, a sheet on a phone. The finale and the secret epilogue stay as cards below.

## 0.132.0 — 24.11.2026
- Part II rewritten around the new scenario and completed: chapter 1 is the Druzi hookah bar in Mohyliv-Podilskyi (boss: the Grey courier, he moves first), chapters 2–9 Vinnytsia → the Marble Hall auction, scenes in uk/en/ru with choice-dependent lines.
- New challenges: blitz race (timed quiz), call check, stake (all-in = ×2 coins, 10 s a move), interrogation (a clean one lifts the fog for the Shadow and the Baron). The mirror scene flips one scale; the Baron keeps the twists your choices did not remove.
- Four endings (final battles 10–13) with titles c2e1–c2e4, the secret epilogue (14) with c2all, achievements c2druzi / c2voice; `fork` replays any finished chapter, keeping collected endings. Server state v2 (old 4-chapter progress is migrated as already-paid rewards).

## 0.131.1 — 24.11.2026
- Home header: z-index above the ui2 cards, solid background once scrolled (`body.h1scl`). Phone radio pill moved up to clear the raised Play button.

## 0.131.0 — 24.11.2026
- Part II of the story, «Спадок Майстра», chapters 1–4: a scene player (portraits with moods, typed text with synthesized voices per speaker, effect sounds, chapter ambience, choices), challenges (cipher quiz, detective in a simulated record, rescue puzzle, tandem quiz) and boss games with arena twists on the chapter's table.
- Server: action `c2` (state / step / win / choice / reset for testers), bot `c2` games with `st.c2` and arena flags; the ch.3 talisman rerolls one bad player roll in later chapters. Unlocked after part one (A.camp ≥ 8), for testers and the admin. Entry card on the campaign page, `?c2` opens it.

## 0.130.0 — 24.11.2026
- Cases (new look): a shelf of CSS chests, the selected case with its contents by rarity beside it (no separate «inside» sheet); the opening is a shaking chest whose seam light climbs c→r→e→l up to the prize, then the lid flies off (tap skips). Old reel kept for `?ui2=0`.

## 0.129.1 — 24.11.2026
- `#arnPg`, `#campPg`, `#achPg` start at `--sbw` on wide screens (the side menu covered their left part, the arena title read «на»).

## 0.129.0 — 24.11.2026
- Materials for 13 plain boards (modern, midnight, sage, ocean, mint, slate, lavender, contrast, linen, pistachio, sultan, khan, carbon): textured fields, bevelled frames with an inner line, shaded points; midnight points silver instead of amber.

## 0.128.0 — 24.11.2026
- The new look is the default (`?ui2=0` keeps the old one); the test pill is gone.
- Performance: no backdrop blur, a static PNG noise instead of SVG turbulence, no fixed backgrounds or photo filters; shop scroll frame p50 76 → 29 ms at 4× CPU throttle.
- Shop showcase: each category one scrolling row of up to 10 with ‹ › and «All» by the title, an «All →» tile at the end.
- Rewards moved into a profile tab; the menu has five tabs, the counter is on «Profile».
- Radio pill and the dock radio button restyled as records; mode chips sit under the board.

## 0.127.1 — 24.11.2026
- `?ui2`: the «Collapse» button is hidden in the narrow dock.

## 0.127.0 — 24.11.2026
- `?ui2`: the shop showcase — the week set on its table photo, the exclusive table as one photo, a red offer stamp, sticky shelves (scroll-spy), display-case cards with a rarity edge and a pedestal.

## 0.126.0 — 24.11.2026
- A test look behind `?ui2` (remembered; `?ui2=0` turns it off): the table photo as the home stage with checker-chips for modes, four halls, a HUD (level ring, streak, rewards; gear and bell in the avatar menu), a dock (104 px strip / bottom dock with a raised Play), ring and path progress, Unbounded headings (OFL), felt and wood materials.

## 0.125.0 — 24.11.2026
- «Rewards» tab (`mnGo('rw')`, page in `#evPg[data-pg=rw]`): gift + quests strip, streak, achievements, «Take all»; a counter on the tab and on the coin pill; the shop showcase links there instead of the strip.

## 0.124.0 — 24.11.2026
- The final (`gf`/`f`) live: banner on home and in `#tourBox`; spectators get a viewer count (realtime presence on `watch-<gid>`) and reactions (broadcast), the bots' broadcast gets ambient reactions on doubles and bear-offs.

## 0.123.0 — 24.11.2026
- Review: move-by-move analysis with `pzOutcomes` (accuracy ring, up to 3 turns with a better play, yours/better on `rpBoardSvg`), computed in 24 ms slices.

## 0.122.0 — 24.11.2026
- Bot styles on the server (`BOTS.sty`): Ostap `run`, Taras `wall`, new Lida `safe`; new Professor plays `botPathPro` level 1. Each bot has its own lines (BV) for hello, doubles, no moves, ahead/behind, the end.

## 0.121.0 — 24.11.2026
- Day streak: a chip next to «Today» and a sheet with the last 7 days and rewards for 3/7/14/30/60 days (server action `streak`, paid once per streak).
- «The year in nardy»: a story of cards from 1 December to 15 January (or `?recap`), with a 1080×1350 picture to share.

## 0.120.0 — 24.11.2026
- Christmas in the shop: tables xm1 «Holiday shop window» (e), xm2 «Blue window» (e), xm3 «Gingerbread cabin» (c) from Freepik photos (credited); each table also unlocks the card background of the same photo (CARDS own:).
- Checkers xorn (e), xsnow (r), xholly (r); dice xfrost (r), xribbon (c), xpine (e) — CSS only.
- Avatar pack «xmas» pt62–pt66 (1500) and voice pack «xmas» (1000): xbells, xmbox (an original tune), xcrack, xfire, xgift — synthesised in syn120. Server SHOP_R, PT_PACKS, PH_PACKS updated.

## 0.119.0 — 24.11.2026
- Search as a duel screen (#mm119): full screen over a blurred home; your card vs an opponent card shuffling players of your level (160 ms), a ring timer with the online count, the widening rating range, one rotating tip, Cancel / Play a bot while I wait, Esc cancels. A found ghost is shown on the card for 1.2 s («Opponent found!») before the game. The old side panel stays underneath as the engine.

## 0.118.1 — 24.11.2026
- Server bot / matched-opponent games are remembered (activeBot) and offered back after a reload; with nothing remembered, the newest unfinished bot game of the player (≤ 6 h) is looked up in «games». Leaving on purpose forgets it; × hides it.

## 0.118.0 — 24.11.2026 (with 0.117)
- Build: the app script (~920 KB) and its main stylesheet (~320 KB) go to app.js / app.css with ?v=hash (cached for a year by Vercel and the service worker); index.html 1.29 MB → 56 KB; <meta name="nardy-version">; portal zips and livecheck include them.
- One clock: every setInterval ≥ 200 ms joins a single scheduler (4 Hz, 1 Hz when hidden); ~46 timers / ~50 wake-ups a second → 4.
- The «online» dot pulses by opacity (compositor) instead of box-shadow: phone idle style recalcs 60/s → 4/s.

## 0.116.0 — 24.11.2026
- Server: the handler is a named function; a new public wrapper action «boot» runs up to 6 whitelisted reads (season, arn/state, rewards/get, friends/list) one after another with the player's token and returns them in one response.
- Client: one «boot» call right after sign-in; for 8 s the old loaders read its answers (sb.functions.invoke hook), then the season, arena, rewards and friends are painted at once. Falls back to the old calls if boot fails.

## 0.115.1 — 24.11.2026
- Shown online: 10…200; hourly bands scaled by the day of the week (weekdays ~0.6–0.68, Friday evening 0.93, Saturday 1, Sunday 0.92 / 0.74 late) and a ±9% mood of the day.

## 0.115.0 — 23.11.2026
- Tournament hall (tov115): full screen; hero with one ticking clock (to draw / start / play-off) and a 5-stage stepper; prize pool and seats in the hero; the crowded stat strip removed; labelled share/calendar; prize podium; seats grid (16, free ones dashed); opens on Participants before the draw.

## 0.114.5 — 23.11.2026
- Neon masks: a MutationObserver gives every <mask id> on the page a unique id (neonAll), so no copied board ever points at a hidden board's mask.

## 0.114.4 — 23.11.2026
- Back (browser/Android) and Escape close Events and the profile (history states like shop/friends); mnCloseAll drops those states so switching tabs never bounces.
- The logo (.h1brand/.mn-brand) goes home from any page on phones.

## 0.114.3 — 23.11.2026
- Profile showcase: a board item is the real board preview (livePv) fitted by width and height (shwFit), point numbers hidden.
- «Interesting numbers»: tournaments count reads an array or {n}.

## 0.114.2 — 23.11.2026
- Fix: board copies (home, shop, showcase) lost their neon mask ids, so the «Druzi» sign pointed at the hidden board and did not render (neonIds).
- Floating radio: the title opens the stations; a station icon instead of «⇄».
- tools/portal_zip.py --lite: assets from jsDelivr pinned to the commit, ~1 MB zips.

## 0.114.1 — 23.11.2026
- The result window fills the screen; two columns at ≥1000px (w114Lay).
- Fix: the last chances point when the side to move has borne off was computed for white, so a black win ended at 0%.

## 0.114.0 — 23.11.2026
- The profile fills the screen (side menu to edge; above the bottom bar on phones).
- Portals: Playgama Bridge (game_ready, gameplay events, audio/pause, interstitials between games), GameDistribution SDK (pause/mute, interstitials), itch.io; guests sign in anonymously on every portal; portal-neutral texts.
- tools/portal_zip.py builds playgama / gd / itch / crazygames zips with all assets.

## 0.113.0 — 23.11.2026
- Light home (h1RenderNow replaced): banner + greeting, hero, onboarding steps for new players, and «Today» — four tiles (h1Tile: tournament status, daily puzzle, path with progress, quests with a «Claim» badge). The right rail, learn row, weekly set, last games, top players and old-home extras are no longer on the home (each lives in its section).

## 0.112.6 — 23.11.2026
- mnCloseAll also closes #arnPg (z 12, sat above the shop), #campPg, #achPg, #admPg; the coins pill goes through mnCloseAll('shop'). Fixes «logo does nothing» and «coins do nothing» from the Arena.

## 0.112.5 — 23.11.2026
- Vercel Deployment Storage was at 75% of 10 GB (~93 MB per deploy). .vercelignore drops dist/ (CrazyGames zip), src/, tools/, supabase/, shots/, snd/radio/, notes; radio tracks stream from jsDelivr (GitHub fallback) via RAD_CDN.

## 0.112.4 — 23.11.2026
- Admin: «Who is online» tab (admOnlineView) built from lobby.presenceState(): counts by status, rows sorted playing → searching → idle, click opens the player in «Players»; refreshes every 5 s while open.

## 0.112.3 — 23.11.2026
- History header shows only the player count (thPl; the ru string was Ukrainian, fixed).
- #radPill cover: the old .art rule made the icon absolute and pinned it top-left; c111 drops .art and the svg is static, 20px.

## 0.112.2 — 23.11.2026
- Tournament history podium: bot entries (tb<season>_<i>, empty name/av) are filled from tourBots(season) via thBot().

## 0.112.1 — 22.11.2026
- p110 also runs from a MutationObserver on #profBox: btnMe etc. were bound to the original openProfile at start-up, so the menu opened the old layout.

## 0.112.0 — 22.11.2026
- Home banner: .h1ban (card photo 1600px, gradient into the page) behind the header and the top cards; greeting .h1greet (time of day + nick, tier · rating · games; guests get a welcome line); hero and the first two rail cards become frosted glass; light theme variant.
- rad111: icon viewBox measured with getBBox and centred.

## 0.111.1 — 22.11.2026
- Nikow station: n7–n9 added (128 kbps, 48 kHz, tags stripped), with the artist's permission.

## 0.111.0 — 22.11.2026
- Radio: rad111(k) takes the Phosphor icon and tint out of RAD_ART; wheel tiles are dark glass with the tinted icon, ring track behind (.ring111), labels only on hover, centre shows the name + eq bars; blurred dim backdrop for the ring and the phone sheet; side-menu player rebuilt (icon = play/pause, eq bars); #radPill cover uses the same icon and moves right of the sidebar.
- Profile banner: the striped ::before overlay is hidden.

## 0.110.1 — 22.11.2026
- h1Tour: the tag was the first part of the status sentence (e.g. «Ви вибули. Подивіться, хто переможе») and covered the photo and title; now a short status key (h1Tag*), the full sentence goes into the subtitle.

## 0.110.0 — 22.11.2026
- Profile redesign (p110 after openProfile): the left card column becomes a full-width banner (card background + gradient), avatar/name/tier left, rating + bar right; .hstats is a strip of tiles + the last-10 form dots; overview tab is a 2-column grid (.p110m main / .p110s sticky side: path, daily gift, looks, name form, invites). Showcase items larger; #1 tournament badge mint. Phone: centred banner, 3 stat tiles, close button hidden (the bottom bar is there).

## 0.109.0 — 22.11.2026
- Tournament window: width min(100vw-32, max(640, 74vw), 1180); ≥1100px two columns (.t109L status/info, .t109R tabs+tbody, each scrolls); ≤560px full-screen sheet with sticky tabs; tabs fade when scrollable.
- tov109(): .trrow + .tpath + .tnext merged into one .tst109 line (chip with nick, compact stepper, message, share/calendar). Header shows «running» when the weekend has started but the bracket is not loaded.

## 0.108.1 — 22.11.2026
- SEO after a Search Console notice: robots.txt blocks app-state URLs (?go=, ?fr=, ?club=, ?portal=, ?lang=); landing-page play links are nofollow; sitemap has lastmod and /licenses/; settings link to all five landing pages in static HTML.

## 0.108.0 — 20.11.2026
- Case «fair» (500): 3 boards, 3 checkers, 2 dice, 3 avatars, frm:garland, med:xstar, fx:tree, ph:vo:sleigh/crunch/shchedryk (syn108), new item kind atm:snow (#atm108 canvas, store 'atm', shown under effects). Server CASES/CASE_R updated.

## 0.107.0 — 20.11.2026
- End-of-game window (ws42) reordered: hero → result → actions → coins/rating → foldable «Game details» (stats + chances chart) → links; neutral coins block.

## 0.106.0 — 20.11.2026
- Compact game: the turn banner with a button moves into #plBot (thumb zone, class tbin); auto first roll also in local mode; rollFirst shortened.

## 0.105.0 — 20.11.2026
- Compact game layout (pg41) extended to ≤860px portrait (tablets); points stretch up to 8.5 cells on tall screens; score right-aligned in player bars.

## 0.104.0 — 20.11.2026
- Perf: h1Render coalesced to one rAF, skipped while hidden/covered (dirty flag), hero board node reused; Onest preloaded instead of Jost.
- Light theme for the new home, Events and the sidebar via --ds-* tokens.
- UI gradients removed: progress bars solid mint, segments for small counts (quests, chapters); yellow CTA/rank bar gone; club badge, radio cover, arena ring flat.

## 0.103.1 — 20.11.2026
- Tournament card on the home: photo plate + mint date tag, no overlay gradient.

## 0.103.0 — 20.11.2026
- Design system start: --sans → Onest site-wide; --ds-* tokens (surfaces, ink, accent, radii, type scale).
- Shared top-bar actions (h1Acts) on Learn, Rating and Shop on computers; back buttons hidden there (the sidebar navigates); page titles 24/700.
- Radio never autostarts on load (station remembered, playback not).

## 0.102.4 — 20.11.2026
- Home/Events card icons: no stray bottom margin, one size; tournament card uses the tournament hero photo.

## 0.102.3 — 20.11.2026
- Fold toggle moved to the bottom of the sidebar as a labelled row.

## 0.102.2 — 20.11.2026
- Sidebar: logo is a home button, fold-to-icons toggle (remembered), settings gear moved to the top bar.

## 0.102.1 — 20.11.2026
- Overlays (profile, tournament, settings) are offset by the left menu width on computers.

## 0.102.0 — 20.11.2026
- New home page (#h1Pg) over the old one: hero with the live board, start-here steps, puzzle, course, learn, weekly set, recent games, top; right panel with rank, tournament, arena, quests, players online.
- Responsive menu: bottom bar on phones, 76 px icon rail up to 1199 px, 232 px labelled sidebar with radio above; pages offset by --sbw.
- New «Events» page (#evPg); nav tab «Learn» replaced by «Events» (learning stays on the home and in the sidebar).
- Shop tabs get room on computers.

## 0.101.1 — 20.11.2026
- Shop: tables preview on their own (full-size image, no board).

## 0.101.0 — 20.11.2026
- Effects: one preview stage (modal over your board) for every roll and win effect; canvas and DOM effects can render into a host.
- Turn banner hidden over pages and modals; tournament tabs scroll; rating label on the home rank card.

## 0.100.0 — 20.11.2026
- Shop: three big tabs (Shop · Cases · Mine), category rows with «All ›», back link from a category, bottom sheet on phones, one-line filters, buttons without wrapping.

## 0.99.0 — 20.11.2026
- Ефект і звук перемоги — один раз на кінець партії (ключ gameId+seq+рахунок).
- .lotpop: backdrop-filter blur.
- Без згадок Dota/CS у текстах і старих новинах; формат монет у банері входу.

## 0.98.1 — 17.11.2026
- /licenses/ — ліцензії та подяки; посилання у футері, у «Подіях» і в налаштуваннях; privacy доповнено (ім'я, країна, турніри); sitemap.

## 0.98.0 — 17.11.2026
- Сервер: action ident (A.idn {fn,ln} лише коли show, A.cc з білого списку 42 країн), pz у записах A.tp.
- Клієнт: nameLine98, pfTour98, idnForm98, прапори img/flags (flag-icons, MIT); openPlayer тягне idn/cc/tp.

## 0.97.0 — 17.11.2026
- ui(): записані звуки sfx/ui/* (Kenney Interface Sounds, UI Audio, Music Jingles — CC0): win/lose, levelup, claim, yourturn, epic, caseopen, toggle/tab, error.
- 12 столів з фото власника (fleather … fcarpet), fmarble перефарбований у срібло.

## 0.96.1 — 17.11.2026
- hs-top знову flex-колонка з gap; arnhome з відступами й іконкою Phosphor; nbhint рядком; tdt.course без градієнта.

## 0.96.0 — 17.11.2026
- Аудит: тексти без «30 цілей», формат монет, навчання (без pz, без плиток), tdt.camp прихований на ПК, gscard під rkcard на телефоні, nbhint як картка, toast унизу, s2Show/shTabShow → «Добірка», ширші налаштування.
- pfDaily96: щоденний подарунок у профілі.
- Кейси: csfan — колекційні картки з кольором рідкості.

## 0.95.0 — 17.11.2026
- ACH2/A2: wins250, games500, mars20, streak10, comeback5, giant10, tour5, friend5, days30, case10, col50, zodiac12; med:laurel/bolt/star ('x').
- ACH_IC: Phosphor іконки досягнень; a2D_arena12/120.
- hsCols95: дві колонки на головній; showItemEl/shwCap: вітрина профілю; radD оновлено.

## 0.94.2 — 17.11.2026
- Кнопка ⇄ відкриває колесо/список станцій; одноразова підказка radHint.

## 0.94.1 — 17.11.2026
- RAD_ART: обкладинки станцій (Phosphor + градієнт), rgen_* жанри; колесо лише на ПК, на телефоні список; Jazz24 → Kiss FM.

## 0.94.0 — 17.11.2026
- Кейс zodiac (500): av:zc1–12 (c) + av:ze1–12 (e), генератор tools/gen_zodiac.py; caseAvs() — усі аватари з кейсів у виборі аватара (також somm).
- Медальйон (категорія med, 8 шт.): у рядку аватара третім полем av~frame~med, малюється в центрі половин (medPaint), магазин medHero.
- Столи й фони картки: nykyiv, nymoon, nypodil, nysnow, nygreen.
- Радіо: 8 живих станцій (HTTPS), колесо станцій (openRadWheel), select у налаштуваннях; CI radiocheck.
- Профіль: pffacts — смуга з розділювачами, іконки Phosphor.

## 0.93.0 — 17.11.2026
- fix93: «Сьогодні» і «Події» з однаковою сіткою (16px, іконка 28px, текст з 56px), заголовки всередині карток, без плиток під іконками; радіо — кнопка ▶/❚❚; на десктопі смужка сезону прихована (є рядок у Подіях).
- Вітрина: s2rw align start, завдання рядками; іконка подарунка Phosphor.
- Колекція: портрет у текстовій колонці замість напису «Зараз на вас».

## 0.92.0 — 16.11.2026
- Нова форма пунктів leaf (пелюстка з заокругленим кінчиком, SVG-маска) для всіх колишніх tri/slim дошок і класичної.
- Повернуто lane (заокруглені смуги) на cup, druzi, friends2–4, holo, midnight, modern, synth.
- Текстура волокон для дерев'яних дошок, медальйон у центрі половин (walnut, usta, tavla, classic).
- Нові дошки beech, leather, resin (каталог на сервері й у клієнті).

## 0.91.0 — 16.11.2026
- Звуки кубиків і ходу — записи Kenney «Casino Audio» (CC0), синтез лишився запасним.
- Дошки без форми пунктів (classic, cup, druzi, friends2–4, holo, midnight, modern, synth) отримали трикутники; фактура сукна на стандартній дошці; неонові світіння прибрано.
- Кубики: втиснуті крапки, грані за матеріалом, без SVG-фільтрів (також безпечніше для iOS).
- Шашки neon/lava/friends/holo без світіння.
- Підказка про пробіл більше не показується на телефонах (uk/ru).

## 0.90.0 — 16.11.2026
- Усі іконки замінено на Phosphor Icons (duotone, MIT): LICO, спрайт, ICO, нижнє меню, ігрове меню, дзвіник, замки, пошук, календар, гучність.

## 0.89.1 — 2026-11-16
- Portrait moods: emoSvg makes glad/upset variants of the flat portraits on the fly ('pt48@w'/'@l'); bosses and campaign characters flash a mood for 3.5 s on game events and keep it after the game.

## 0.89.0 — 2026-11-16
- Campaign chapter characters redrawn in the flat style (pt55–pt61, tools/gen_pt_camp.py); chapter prizes pt15/pt26/pt31 → pt55/pt58/pt61 (client + server); owned portraits untouched.

## 0.88.2 — 2026-11-16
- Arena bosses unified in the flat portrait style (pt48–pt54, tools/gen_pt_bosses.py).
- ~80 UI strings rewritten without explanatory dashes (uk/en, ru where present).
- Leagues and clubs code archived to tools/archive/leagues_clubs.js (stubs remain, flags off).
- Build: later-page CSS (shop, arena, achievements, rating, admin, tournament, cases) split into pages.css loaded after first paint (index 1.19 MB → 1.04 MB); verified by pixel diff of 23 screens.

## 0.88.1 — 2026-11-16
- Progressive reveal (nbApply/nbLocked; body.nb1/nb3/nb5; admin exempt): puzzle/gift/quests after 1 game, events/top after 3, arena/cases after 5; unlock hint under Play.
- Arena guest preview with all bosses; friendlier campaign sign-in line.

## 0.88.0 — 2026-11-16
- Read-call dedupe/cache for the game function (season ×6→1, arena ×2→1 at start).
- Self-hosted: Jost (fonts/jo-*), supabase-js 2.118.0 and lottie-web 5.12.2 (lib/), 45 Unsplash photos (img/u, fetched by .github/workflows/photos.yml); Google Fonts and jsdelivr no longer used by the main site.
- Phones held upright: --prow lengthens points (5.2→up to 7 cells), .half height follows.
- Icon-only buttons get aria-labels.

## 0.87.4 — 2026-11-16
- Radio pill: volume button with a popover slider synced with settings; drag ignores inputs.

## 0.87.3 — 2026-11-16
- Hookah clip played from a fetched blob (canvas can read it, white keyed out); centred mobile search layout.

## 0.87.2 — 2026-11-16
- Search hookah video drawn on a canvas with the edge-connected white keyed out; tournament registered block left-aligned.

## 0.87.1 — 2026-11-16
- unzipLottie inlines images/ from .lottie (account icon); lotSilver recolours gold/amber to silver in trophy/badge/winner/rank (no-yellow rule).

## 0.87.0 — 2026-11-16
- LottieFiles animations (Lottie Simple License, loaded on demand via LOT/lotInto/lotPop): trophy (tournament final win), winner (match/arena win), rank badge (tier up), winner badge (achievement claim), coffee (morning daily gift, Trend 26 case sheet), account icon + Telegram logo (guest sign-in card), astronaut (offline line, new 404.html), hookah smoker MP4 (opponent search).

## 0.86.1 — 2026-11-16
- .s2kind vertically centred with the rarity chip; 16px page edge on phones (home, shop, learn, achievements, arena).

## 0.86.0 — 2026-11-16
- Typography: Onest (self-hosted, OFL) replaces Playfair for brand and h1–h3; settings group labels quiet; case odds 11.5px.
- Weekly tournament covers tb/tc1–tc4 (tools/gen_tour_covers.py), picked by tourCover(at).
- Fixes: shop tabs on phones wrap to their own row; arena guest layout.

## 0.85.2 — 2026-11-16
- «Trend 26» case grows to 22 items: fx beans (roll), petals, latte (win); av:somm; ck/dice latte; vo sip/spoon (synth); 6 text phrases ch26*. Generated tables get shop thumbnails (TABLE_SW).

## 0.85.1 — 2026-11-16
- «Burgundy» set: board/ck/dice/table burg (tb/burg.webp generated), bundle 'burg' (client + server).

## 0.85.0 — 2026-11-16
- «Trend 26» collection (2026 palette: cloud white, chocolate, teal, plum, mahogany): shop boards cloud/choco, checkers cloud/choco, dice cloud/choco, table linen; case «trend» (board tealx/plum, ck tealx/plum, dice plum/tealx, table mahog, vo:froth).
- Portrait pack «cafe» pt42–pt46 (tools/gen_pt_cafe.py); tables generated by tools/gen_trend26_tables.py.
- Sound pack «cafe» (espresso, saucer, pour, doorbell, grinder) synthesized on device (syn85).

## 0.84.0 — 2026-11-16
- UI de-templating: purple/pink UI accents → sage #4fb393 (skins untouched); no uppercase eyebrows; Playfair Display (self-hosted, OFL, fonts/) for brand and titles.
- Shorter copy (bot picker, format, settings, find, cases, guest banner).
- Tournament: icon share/calendar buttons, plain info list, inline flow, scrollable tabs.
- Home: no empty form card for new players, no guest friends card, 3 nearby opponents; quiet in-game rules line; settings search hidden; gift dot coral.

## 0.83.3 — 2026-11-15
- iOS: used die no longer uses CSS filter (WebKit could skip painting it); dimmed with an overlay instead.

## 0.83.2 — 2026-11-15
- Tournament games show the match score (Bo3/Bo5) in the player panel.
- Quick-phrase row under the board removed (QR_OFF).

## 0.83.1 — 2026-11-15
- Tournament games against bot opponents are saved locally and resumed on re-entry or reload instead of restarting.

## 0.83.0 — 2026-11-15
- Exclusive weekend-tournament set (board, onyx/pearl checkers, dice, hall table tb/cup.webp), applied only in tournament games, never in the shop.
- Tournament FX and synthesized sounds: silver dust on roll, start gong, dice clack, low-time clock tick, hall ambience, applause on win.
- Signature synthesized sounds for all 12 arena bosses (bubbles, taunts, fight start).

## 0.82.6
- CL_ON=false: the Club tab, club bell item, club background load and ?club= invites are off in the UI; the server and data stay.

## 0.82.5
- Bell (bell57Items): tournament (signed up and starting within 36 h / sign-up open, once per event / live), season (achievements to claim, ends in ≤3 days, once), arena (active run with the next boss / free run, once a day), club prize, new friend requests (fans not seen yet). A 3-minute background feed refreshes arena, club, season and friends while the tab is visible.

## 0.82.4
- tb53: the turn banner moves under the board only for wait/info states; whenever it carries a button (Roll dice etc.) it stays centred on the board. Bigger button on phones.

## 0.82.3
- Dice: the board no longer rebuilds the dice when they have not changed (key on phase/dice/remaining/turn/rollId), so repeated renders during a roll do not restart the animation; each animated die drops its .roll class after the animation time, so a stalled CSS animation (iOS/Telegram) cannot leave a die invisible or mid-spin.

## 0.82.2
- Arena art from Vlad's picks: arena/sky.webp (his B&W mosque photo tinted to night navy), arena/stone.webp (his dark slate wall made seamless), arch masks win1–4/winb and roof.png cut from his arch vector set (Freepik/Magnific, credited on the page). Windows: .ww wrapper with a stone frame and dark glass masked to the arch; the generated city layer removed.

## 0.82.1
- Arena art generated in code (no third-party licences): arena/sky.webp (night gradient, clouds, moon), arena/city.webp (two-layer skyline with domes, minarets, lit windows), arena/stone.webp (seamless cut-stone masonry). Generators in tools/gen_arena_stone.py and tools/gen_arena_city.py.

## 0.82.0
- Arena redrawn: .tw2 stone tower (roof dome, crenellations, 12 floors .fl with arched .win windows — lit for the current boss, bars when locked, check when beaten), night sky with moon and an SVG city skyline; right column on ≥980px: run card (hearts, wins, best, progress) and the «you VS boss» card with rules and reward.
- LICO/lico(): one line-icon set. iconify(): a MutationObserver turns interface emoji (🏆🎁⚔️🔒📅🛡🎯🧩💎🏁🔍💡⚠️👥📻🎓🏅🥇🎲⚡❄🖼🧪🪨💨💬👑⏱🔥⭐🚩🔁✅❌▶) into those icons, skipping chat, bubbles, phrases and inputs.
- 58 caps-label rules switched to sentence case (rarity/new badges keep caps); the season bar and club badge lost the purple-pink gradient.
- LG_ON=false: leagues hidden in the UI (server untouched).

## 0.81.1
- Arena page ≥980px: two columns — tower left, sticky .arn-side right (status, .arnstats with progress, .arnnext with rules and Fight, final rewards, hall of fame); on phones the same blocks flow in one column via display:contents + order.
- Talking bosses: every ~4 s a .arnbub pops by a boss in view (chA_<boss>_h/a), clamped to the page, with arnBabble — a short per-boss triangle-wave babble that respects sound and voice mute. In arena games botSay uses chA_<boss>_h/a/w/l (chatty bazar/storm/sharp talk more); 48 lines × uk/en/ru.
- Confetti palette without amber; phone header: the profile button shows only the avatar ≤760px, brand smaller ≤380px and hidden ≤340px.

## 0.81.0
- Arena moved from a modal to a full page (#arnPg, like #campPg): sticky top bar with back, sticky run status, the tower with icon chips per boss (ARN_CH) instead of sentences, reward line coins + 🎁. Tapping a boss opens #arnSh with the rules spelled out row by row, rewards and «Fight» for the current boss (arnFight now opens that card). Mobile nav hidden on the page.

## 0.80.6
- .die.used: opacity .62 + grayscale/brightness instead of opacity .3, which on dark boards (Druzi neon) looked like the second die was missing.

## 0.80.5
- The «offline» chip is shown only to a participant (mySlot) about a real user id; spectators of a broadcast and tournament-bot seats no longer get it.

## 0.80.4
- Bot picker: sticky «Play» button; descriptions hidden when the window is under 600px tall.

## 0.80.3
- Portal: t('login') reads «Sign in with CrazyGames» (cg73B) on CrazyGames.

## 0.80.2
- openProfile crashed in achRwEl for the arena achievements (arena12/arena120 have an empty reward): now shown as a title reward; achList calls are guarded. The client tournament reminder (ntfTourHB) had a hard-coded 18:00; it now formats the real start from nextSat().

## 0.80.1
- The turn banner showed «No moves» during the undo hold after every full move; it now stays hidden while _hold is set.

## 0.80.0
- CrazyGames resubmission pass. Brand «Nardy Masters» everywhere (brandName, titles, manifest). Game-first start: a new player (site and portal) goes straight into a game with bot Marta; ob40 asks nothing; a direction-neutral goal tip comes first. Portal: guideSeen no longer blocks the first game, no own «Log in» label (Guest → CrazyGames account), invite/referral/tournament/club/friend-link share hidden or turned into a hint (game invites use the CrazyGames invite link). Board point numbers, tray counts and seat lines are at least 11px. «N bots waiting» removed. Admin stats: a CrazyGames platform (plat 'cg').

## 0.79.1
- A MutationObserver turns every 🪙 text (the emoji is silver on most phones) into the gold coin icon everywhere; the boss tower for the arena.

## 0.79.0
- Arena: 12 bosses (server table ARN), 3 lives, 500 coins / free weekly run; obstacles in the engine (st.blk: points closed for the player's colour, wind), the bot's one re-roll, the player's double = a lost turn (rules.dbl 'skip'), no doubles (dbl 'none'), boss moves first, fog / mirror / no-undo on the client. Rewards in rate(): coins + a first-time item per boss, 12 wins and 12–0 sets, titles arena12 / arena120, hall of fame (srv/arena/hall.json). 15 arena-only items.

## 0.78.0
- Clubs: server action 'club' (mine/list/peek/create/join/leave/kick/say/claim), files srv/club/<id>.json + club/index.json, A.club. Weekly club tournament from rated games (clAdd next to lgAdd), prizes 300/200/100 collected by the members, chat (60 last, 2.5 s rate limit), invite link ?club=<id>. Ratings page: new «Club» tab.

## 0.77.0
- Friends 2.0: personal friend link (?fr=<id>; peek + mutual add via friends op link), «Want to be friends» (fans: profiles whose ach.friends contains you), live status of online friends from presence (playing / searching / free), the call button does not invite a friend who is mid-game.

## 0.76.3
- League table: the points cell used the class .pt, which is the board point class (width: var(--cs); height: 100%) — renamed to .lpt; the numbers no longer overflow the row on desktop.

## 0.76.2 (plan item 0.74 — rating seasons)
- Monthly rating seasons (Kyiv calendar month): A.ss tracks games, wins, streak, mars and the best calibrated rating; ≥10 rated games for a reward by the best rank (150…4000 coins) plus a season badge (A.sbad). Five season achievements with coins. Server action 'season' (state, top 50, op end/ach). Home card, events row, season page, end-of-season modal. No rating reset.

## 0.76.1
- UI audit fixes: bought frames listed in Collection → Frame (wear/remove), a bought frame hides the rank frame ring (no double ring); compact tournament tabs on phones; calendar button full row.

## 0.76.0
- Bots: format picker in the bot sheet — 1 game / to 3 / to 5 / to 7 (server bot games, signed-in) and Blitz (10 s a move, 3 timeouts = loss; also for guests on the device). Server: create accepts args.fmt for bots (rules + unrated), 'next' keeps bot settings, bot_step applies the player's timeout.

## 0.75.0
- Tournaments 2.0: History tab (server action tour_hist: last 10 finished events, top 3 and every real player's place, cached 10 min), «Your path» progress strip, «Add to calendar» (.ics with a 15-minute alarm for both days). 0.74 (seasons) comes next.

## 0.73.4
- Radio player is draggable on screens ≥700px (position saved as a fraction of the viewport; double-click resets).

## 0.73.3
- Tables Velvet, Teahouse, City lights, Rooftop now use photos Vlad sent (tb/*.webp, small swatches tb/*_s.webp).

## 0.73.2
- Radio: a second station, Nikow (6 tracks, used with the artist's permission, re-encoded to 128 kbps), switch with ⇄ in the player or in Settings.

## 0.73.1
- Avatar frames (new shop category): Silver, Pearl, Ornament, Aurora, Crown; shared with others as «avatar~frame» in the avatar key.
- Table backgrounds are back in the game; six new procedural tables (Kilim, Zellige, Velvet, Teahouse, City lights, Rooftop).
- Four shop boards: Linen, Pistachio, Cobalt, Sultan. East portrait pack (pt37–pt41). Sets Iznik and Sultan.

## 0.73.0
- Big content drop 3: the East case — Tavla and Workshop boards, Inlay/Pomegranate/Lapis checkers, Old bone and Izmir tile dice, Flying carpet and Mosaic win shows, Pomegranate seeds roll effect, saz and darbuka chat sounds (synthesized on the device).
- East phrase pack (6 phrases, 300 coins).
- Pasha's guide step g42 about the new case.

## 0.72.11
- Portal mode: the hookah phrase is hidden from the chat, quick replies and the phrase book.

## 0.72.10 — 13.11.2026
- Privacy policy page `/privacy/` (English + Ukrainian) and a link in Settings → Help.
- CrazyGames `disableChat`: the phrase wheel and the opponent's chat bubbles are off when the player disabled chat on CrazyGames.

## 0.72.9 — 13.11.2026
- Fix: 0.72.6 declared `b64u` twice in the game server, so the server failed to start for ~14 minutes (13:21–13:35); the JWT decoder is now `b64d`. Checked with a redeclaration scan before deploy from now on.
- Fair dice in the profile is compact: three stat chips (rolls, doubles vs 16.7%, pips per roll vs 8.17) and a small 1–6 bar strip in one row; “How are the dice rolled?” is a link in the header.
- `tools/check_server.js` catches syntax errors and double declarations in the game server.
- CrazyGames preview checked: load 2.2 s, instant multiplayer opens a friend table, `gameplayStart`, `inviteLink`, `updateRoom` detected.

## 0.72.8 — 13.11.2026
- Portal guests get an anonymous guest account automatically (name “Player1234”), so online play, friend tables and instant multiplayer work without any sign-in.

## 0.72.7 — 13.11.2026
- CrazyGames multiplayer on the current SDK API: `updateRoom` (joinable while a friend table waits, closed once both sit), `leftRoom`, `addJoinRoomListener`, `inviteParams` on start; the deprecated invite button calls are gone.

## 0.72.6 — 13.11.2026
- CrazyGames accounts: a player signed in on CrazyGames is signed in automatically. The SDK token is verified on the server (RS256 with CrazyGames' public key, expiry, optional `CG_GAME_ID`), one account per CrazyGames user (`cg-<id>@crazygames.invalid`, `ach.cg`). The auth listener switches a guest who signs in during play; the guest window has a secondary “Sign in with CrazyGames” button; no sign-out or Telegram link inside the portal.

## 0.72.5 — 13.11.2026
- CrazyGames multiplayer: friend links are CrazyGames invite links (`inviteLink`), the invite button shows while a friend table waits (`showInviteButton`/`hideInviteButton`), an invite opens the friend's table (`getInviteParam('roomId')`), instant multiplayer opens a new table; muting from the CrazyGames page (`settings.muteAudio`) turns the sound off.

## 0.72.4 — 13.11.2026
- Portal: players stay guests (no nickname/password or Telegram sign-in inside a portal, per CrazyGames rules for games without account integration); the profile shows a guest note, sign-in prompts are hidden.

## 0.72.3 — 13.11.2026
- Portal-safe mode (PEGI 12) inside game portals only: no alcohol / hookah items in the shop (`P75_HIDE`), the Hookah and Show cases and the hookah / bar / 3 kenta phrase packs are hidden, no radio, no voice chat; “Pop the bubbly!” becomes “Party popper!”, the course is called “Evenings with Vlad and Pasha”. The site itself is unchanged.

## 0.72.2 — 13.11.2026
- UI: quest rows on the home screen, in the shop and in rewards are separate cards with padding, wrapping names, the bar and count on one line and the reward as a pill.
- Home (desktop): “Online near you” renders up to 9 and shows as many as fit the height of its row (`near75Fit`, re-run after loading and on resize); phones keep 5.
- Google Search Console verification (meta tag + file).

## 0.72.1 — 13.11.2026
- Self-drawn SVG art for the Show case (stage, spotlights, bulbs) and the Winter case (night, moon, garland, pines, snow); the Winter card shows its item fan.
- Per-case sounds (`cs75*`): hover, opening, reel tick and reveal differ for Show / Winter / Phrases; new `syn66` kinds tick, tick2, bells.
- Inline SVG backgrounds are now base64 data URIs.

## 0.72.0 — 13.11.2026
- Portal mode (`PORTAL`): from `?portal=…`, a build-time `window.__PORTAL`, or the referrer (CrazyGames / Poki / GameDistribution). In a portal: no service worker, no install prompts, Pasha's tour skipped.
- CrazyGames SDK v3: `init`, `gameplayStart/Stop` follow the game phase, `happytime` on a win, the language from `systemInfo.countryCode` (only when the player never chose one), the portal username as a guest nickname.
- `tools/portal_zip.py` builds `dist/nardy-crazygames.zip` (the site files with `window.__PORTAL='crazygames'`) for upload — waits for Vlad's CrazyGames developer account.

## 0.71.0 — 13.11.2026
- Weekly leagues switched back on (site and server): groups of 30 (`LG_N`), 5 up / 5 down, prizes for places 1–5, the League tab and the home line.
- Pasha's tour: g41.

## 0.70.0 — 13.11.2026
- Block a player (the in-game “…” menu): stored on the device and on the profile (`ach.blk`); presence carries the list and matchmaking pairs greedily in the same order on every client, skipping blocked pairs; their chat phrases are ignored and voice chat is refused. The list with unblock is in Settings → Account.
- Report a player: reason + note (+ block), server action `report` → `srv/reports.json` (last 400, 10 a day per player); the admin panel has a Reports tab grouped by player.
- Offensive nicknames: a client check and a database trigger (`supabase/run/v10_nick.sql`).
- Pasha's tour: g40.

## 0.69.0 — 13.11.2026
- Replay: share a moment — a 1080×1350 picture of the current turn (board, players, the coach's verdict and the better move when analysed, a call to play) and a short video (the last 6 turns, MediaRecorder mp4/webm from a canvas).
- Web Share with files on phones, a download elsewhere; no video recorder → falls back to the picture.
- Pasha's tour: g39.

## 0.68.0 — 13.11.2026
- Game analysis in the replay viewer: every turn is re-searched with the strongest bot's evaluator (all distinct end positions of the turn), loss = best − played.
- Verdicts: ≤1.5 fine, ≤4 inaccuracy, ≤9 mistake, more — blunder; accuracy = mean of 100·e^(−loss/5) over non-forced turns (a random player ≈ 45–55%, the best bot 100%).
- Accuracy cards for both players, counts, jump chips to mistakes, the better move in the player's own point numbers. Runs in the browser in small slices.
- Pasha's tour: g38.

## 0.67.0 — 13.11.2026
- Fair dice: an explanation sheet (server rolls online, cryptographic generator, bots don't see rolls) from the profile and Settings → Help.
- Server keeps `ach.dst` per player: rolls, doubles, number frequencies, pips — from each finished game's history. Shown in the profile as a 1–6 bar chart against 1/6.
- The browser's own die (bot practice, local games) now uses `crypto.getRandomValues` with rejection sampling.
- Pasha's tour: g37.

## 0.66.0 — 13.11.2026 🎁
- Big content drop: the Winter case (350): boards Snowfall (e) and Garland (l, twinkling lights), checkers Snowballs (r), Baubles (e), Gingerbread (e), dice Ice (r) and Candy cane (e).
- Full-screen win shows: Gift rain (l) and Sled ride (e); roll effect Snow burst (r). Fluent Emoji 3D assets (MIT): `fx/gift|sled|snowman|flake.webp`, gift and sled hue-rotated (no yellow).
- Chat sounds made on the device (`syn66`): Jingle bells (e), Pop the bubbly! (r).
- Pasha's tour: g36.

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
