# Americano Padel Tournament

A live, mobile-first web app for running a 12-player / 3-court / 8-round Americano
padel tournament: public dashboard, schedule, leaderboard, and player pages, plus a
secure admin area for entering results, managing rounds/status, posting
announcements, validating the schedule, and exporting data.

Built with React + Vite + TypeScript + Firebase (Firestore + Authentication),
designed for Netlify hosting.

## 1. Install and run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview   # optional local preview of the production build
```

## 2. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project.
2. Add a **Web app** to the project (the `</>` icon) and copy the config values shown.
3. Enable **Firestore Database** (production mode is fine — the rules below secure it).
4. Enable **Authentication** → Sign-in method → **Email/Password**.

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from your Firebase web app config:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_TOURNAMENT_ID=main
```

Never commit `.env` — it's already in `.gitignore`. On Netlify, set the same
variables under **Site settings → Environment variables**.

## 4. Deploy the Firestore security rules

Install the Firebase CLI if you don't have it, then from the project root:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # point it at firestore.rules, use your existing project
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` directly into the Firebase console under
**Firestore Database → Rules** and click Publish.

The rules allow anyone to **read** tournament data, but only signed-in users whose
UID exists in the `admins` collection can **write**.

## 5. Create an admin user

1. In the Firebase console, go to **Authentication → Users → Add user**, and create
   a user with an email and password. This is the login your tournament admin
   will use.
2. Copy that user's **User UID** (shown in the Authentication users table).
3. Go to **Firestore Database → Data**, and manually create a document:
   - Collection: `admins`
   - Document ID: paste the User UID from step 2
   - Fields: none are required — the document just needs to exist. You can add
     `{ "email": "admin@example.com" }` for your own reference if you like.
4. Repeat steps 1–3 for each additional admin.

Once that document exists, that user can sign in at `/admin/login` and will have
full admin access.

## 6. Initialize the tournament

1. Sign in at `/admin/login` with the admin account you just created.
2. Go to the **Setup & export** tab.
3. Click **Initialize tournament**. This creates the tournament document, all 12
   players, 8 rounds, 24 matches (with the fixed schedule and times from the
   brief), and 2 breaks, using deterministic document IDs
   (`round-1-court-1`, etc.). Re-running it is safe — it won't create
   duplicates, but it does overwrite existing data under those IDs, so you'll be
   asked to confirm first.

The public dashboard, schedule, and leaderboard will now show live data.

## 7. Deploy to Netlify

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Netlify, **Add a new site → Import an existing project**, and pick the repo.
3. Build command: `npm run build`. Publish directory: `dist`. (Both are already
   set in `netlify.toml`, so Netlify should pick them up automatically.)
4. Add the six `VITE_FIREBASE_*` environment variables (plus `VITE_TOURNAMENT_ID`
   if you're using something other than `main`) under **Site settings →
   Environment variables**.
5. Deploy. `netlify.toml` includes an SPA redirect rule so refreshing any route
   (e.g. `/schedule` or `/players/pavels`) serves `index.html` instead of a 404.

## How the data model works

- `tournaments/{tournamentId}` — tournament-level status, active round, and settings.
- `tournaments/{tournamentId}/players/{playerId}` — the 12-player roster.
- `tournaments/{tournamentId}/rounds/{roundId}` — round and break timing.
- `tournaments/{tournamentId}/matches/{matchId}` — one document per match; this is
  the **source of truth** for all results.
- `tournaments/{tournamentId}/announcements/{announcementId}` — admin announcements.
- `admins/{userUid}` — grants write access to that Firebase Authentication user.

**The leaderboard is never stored as a standalone total.** It's recalculated in
the browser from the `matches` collection every time matches change, using
Firestore's real-time listeners — so it's always consistent with the underlying
results, and there's nothing to get out of sync.

## Ranking rules

Players are ranked by, in order: total points scored, point difference, wins,
head-to-head result (when it applies), otherwise a shared position.

## Schedule validation

`src/utils/scheduleValidation.ts` checks the fixed schedule against every
structural rule from the brief (round/match counts, no repeated partnerships, no
opponent pairing more than twice, the Aleksejs/Aleksandrs restriction, etc.). The
**Validation** tab in the admin area runs this and reports the exact rule, round,
court, and players involved for any failure.

## Score overrides

Normal match results must total exactly 21 points. For unusual situations (match
stopped early, injury, technical interruption, or another reason), an admin can
enable **override** on a match, which relaxes the 21-point total requirement but
requires a written explanation. Overridden matches are clearly marked wherever
they're shown, and a tied override score is recorded as a draw for both players.

## Project structure

```
src/
  data/schedule.ts          fixed players + schedule (source of truth)
  types/                    shared TypeScript types
  utils/                    scoring, ranking, schedule validation, CSV export, time logic
  firebase/                 Firebase config, auth, Firestore service functions
  hooks/                    auth context, toast context, live tournament data hook
  components/               MatchCard, LeaderboardTable, Nav, admin score entry, etc.
  pages/                    Dashboard, Schedule, Leaderboard, Players, Print
  pages/admin/              Login, Results, Control, Announcements, Validation, Setup
```
