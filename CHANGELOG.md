# Changelog — нарди (nardy-nine.vercel.app)

Versions: **patch** (0.13.1) — small fixes; **minor** (0.14.0) — new features; **1.0** — the big redesign.
The beta at `/beta` is not versioned until its features reach the main site.

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
