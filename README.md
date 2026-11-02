# Nardy — long backgammon for two

Play long nardy with a friend by link, or two people on one device.

- Static site: a single `index.html`, no build step.
- Backend: [Supabase](https://supabase.com) — guest (anonymous) or email sign-in, live game sync via Realtime, player profiles and stats.
- Hosting: any static host (Vercel, Netlify, GitHub Pages).

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. In Authentication → Sign In / Providers, enable **Allow anonymous sign-ins**.
3. Put the project URL and publishable key into `SB_URL` / `SB_KEY` at the top of the script in `index.html`
   (the publishable key is meant for browsers; data is protected by Row Level Security).
4. Deploy the folder to any static host.

## Rules implemented

Long nardy: 15 checkers start on the head (white on 24, black on 12), both move counter-clockwise, no hitting,
one checker from the head per turn (two on a first-turn 6-6, 4-4 or 3-3), doubles played four times,
must use both dice when possible (otherwise the larger), no 6-point prime without an enemy checker ahead,
bear off once all 15 are home; mars (opponent bore off none) scores 2.
