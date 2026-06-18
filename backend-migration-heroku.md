# Backend Migration — Railway ➜ Heroku

> **Goal:** Move the **Express 5 + Socket.io backend** off Railway onto **Heroku** (always-on, using GitHub Student Pack credits). The frontend (Vercel), database (Supabase/Postgres), and cache (Upstash/Redis) **stay exactly where they are** — only the Node application layer moves.
>
> This document is the single source of truth for the migration. It is written so that any engineer **or** an AI agent (Claude Code, Codex, etc.) can execute it without extra context.

---

## 0. TL;DR (the whole migration in 8 moves)

1. Add 3 things to `server/`: `engines` field, a `heroku-postbuild` script, and a `Procfile`.
2. Create a Heroku app; set its **two buildpacks** (monorepo + Node) so it builds from `server/`.
3. Set `APP_BASE=server` + all backend env vars in the Heroku dashboard.
4. `git push heroku main` → Heroku builds (`prisma generate` → `tsc`) and starts (`node dist/server.js`).
5. Grab the new Heroku URL (e.g. `https://go-marketplace-api.herokuapp.com`).
6. In **Vercel**, repoint `VITE_API_URL` + `VITE_SOCKET_URL` to the Heroku URL → redeploy frontend.
7. In **Google Cloud Console**, add the new OAuth callback URL.
8. Set `CLIENT_URL` (Vercel URL) on Heroku so CORS + Socket.io accept the frontend. Test, then delete the Railway service.

**No application source code needs to change** — the server already reads everything from environment variables. The only repo edits are 3 small additions to `server/package.json` + a `Procfile`.

---

## 1. Current setup (verified from the codebase)

### Backend (`server/`)
| Thing | Current value | Notes |
|---|---|---|
| Runtime | Node.js 20+ (local is v24) | Heroku needs an explicit `engines` pin |
| Framework | Express 5 + TypeScript | Compiles to `dist/` via `tsc` |
| Real-time | Socket.io | **Requires a persistent server** (why not serverless) |
| ORM | Prisma 7 + `@prisma/adapter-pg` | Client must be generated at build time |
| Build script | `"build": "tsc"` | Does **not** run `prisma generate` |
| Start script | `"start": "node dist/server.js"` | ✅ correct for Heroku |
| `postinstall` | ❌ none | So Prisma client is **not** auto-generated — must add |
| Port binding | `process.env.PORT \|\| 5001` | ✅ Heroku injects `PORT`; already handled |
| Server CORS | `origin: process.env.CLIENT_URL` (app.ts) | ✅ env-driven, no code change |
| Socket.io CORS | `origin: CLIENT_URL` (server.ts) | ✅ env-driven, no code change |
| Listen host | `httpServer.listen(PORT, …)` | ✅ binds all interfaces by default |

### Data layers (NOT migrating — already external & free)
- **PostgreSQL** → Supabase (via `DATABASE_URL` pooled + `DIRECT_URL` direct).
- **Redis** → Upstash (via `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`).
- **Media** → Cloudinary. **Email** → Brevo HTTP API.

### Frontend (`client/`, on Vercel)
- Talks to the backend through **two env vars**: `VITE_API_URL` and `VITE_SOCKET_URL` (see `client/src/lib/axios.ts` and `client/src/lib/socket.ts`).
- Current Vercel project vars (from dashboard): `VITE_GOOGLE_CLIENT_ID`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_SOCKET_URL`, `VITE_API_URL` — the last two currently point at Railway and **must be updated**.

### The monorepo wrinkle
The repo root contains **both** `client/` and `server/`. Heroku expects the Node app at the repo root, but ours lives in `server/`. → solved with the **monorepo buildpack** + `APP_BASE=server` (Option A — keeps one repo, one deploy).

---

## 2. Why Heroku (and why these specific changes)

- **Persistent container** → Socket.io WebSockets stay alive (serverless can't do this).
- **Always-on** with Student Pack credits → no free-tier sleep/spin-down.
- **`git push` deploy** → simplest pipeline for Express + Socket.io.
- The 3 repo edits exist because Heroku, unlike Railway, **won't** auto-generate the Prisma client or know the Node version unless told.

---

## 3. Repo changes to make (in `server/`)

> These are the **only** code/config edits. Apply them, commit, then deploy.

### 3.1 — `server/package.json`: add `engines` + `heroku-postbuild`

Add an `engines` field (pin Node 20 LTS — stable on Heroku) and a `heroku-postbuild` script so Heroku generates the Prisma client and compiles TypeScript during the build:

```jsonc
{
  // ...
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only --exit-child src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "heroku-postbuild": "prisma generate && npm run build",   // ← ADD
    "test": "vitest run",
    "db:seed": "prisma db seed",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio"
  },
  "engines": {                                                 // ← ADD
    "node": "20.x"
  }
}
```

**What it does:** on deploy Heroku runs `npm install`, then `heroku-postbuild` → `prisma generate` (creates the typed Prisma client) → `tsc` (compiles `src/` → `dist/`). Then it runs the start command.

### 3.2 — `server/Procfile` (new file, no extension)

```
web: npm start
```

**What it does:** tells Heroku this is a `web` process and to launch it with `npm start` (= `node dist/server.js`). The `web` type is required for Heroku to route HTTP/WebSocket traffic to it.

### 3.3 — Nothing else

- ❌ No Dockerfile (Heroku's Node buildpack handles it).
- ❌ No source code changes — CORS, port, and Socket.io are all env-driven already.

---

## 4. Heroku setup (dashboard + CLI)

> Prerequisite: install the Heroku CLI and `heroku login`. Run all commands from the **repo root**.

### 4.1 — Create the app
```bash
heroku create go-marketplace-api      # pick any unique name → becomes the URL
```

### 4.2 — Configure the two buildpacks (ORDER MATTERS)
The monorepo buildpack must run **first** (it moves `server/` to the root), then the Node buildpack builds it:
```bash
heroku buildpacks:add -i 1 https://github.com/lstoll/heroku-buildpack-monorepo
heroku buildpacks:add -i 2 heroku/nodejs
```

### 4.3 — Point the buildpack at the `server/` subdirectory
```bash
heroku config:set APP_BASE=server
```

### 4.4 — Set the backend environment variables
See the full checklist in **Section 5** (use `heroku config:set KEY=value` or paste them in the dashboard → Settings → Config Vars).

### 4.5 — Deploy
```bash
git add server/package.json server/Procfile
git commit -m "chore: Heroku deploy config (engines, heroku-postbuild, Procfile)"
git push heroku main
```
> If your branch isn't `main` locally: `git push heroku <yourbranch>:main`.

### 4.6 — (One time) run migrations if needed
Your schema is already applied on Supabase, so usually **nothing to do**. Only if you have pending migrations:
```bash
heroku run "cd server && npx prisma migrate deploy"
```
> ⚠️ Do **not** put `migrate deploy` in the start/build command — run it manually, once.

### 4.7 — Grab the new URL
```bash
heroku info -s | grep web_url
# e.g. https://go-marketplace-api.herokuapp.com/
```
Health check: open `https://<your-app>.herokuapp.com/api/v1/health` → should return `{ success: true }`.

---

## 5. Environment variables → set these in Heroku

> Heroku dashboard → your app → **Settings → Reveal Config Vars**, or `heroku config:set KEY=value`.
> Copy the **values** from your current Railway dashboard (or local `server/.env`).

| Key | Where the value comes from | Notes |
|---|---|---|
| `NODE_ENV` | literal `production` | enables prod cookie/CORS behavior |
| `PORT` | **DO NOT SET** | Heroku injects it automatically; code reads `process.env.PORT` ✅ |
| `DATABASE_URL` | Supabase (pooled, `:6543`) | unchanged |
| `DIRECT_URL` | Supabase (direct, `:5432`) | unchanged |
| `JWT_ACCESS_SECRET` | existing secret | unchanged |
| `JWT_REFRESH_SECRET` | existing secret | unchanged |
| `JWT_ACCESS_EXPIRES` | e.g. `15m` | unchanged |
| `JWT_REFRESH_EXPIRES` | e.g. `7d` | unchanged |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | unchanged |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | unchanged |
| `GOOGLE_CALLBACK_URL` | **UPDATE** | `https://<your-app>.herokuapp.com/api/v1/auth/google/callback` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | unchanged |
| `CLOUDINARY_API_KEY` | Cloudinary | unchanged |
| `CLOUDINARY_API_SECRET` | Cloudinary | unchanged |
| `BREVO_API_KEY` | Brevo | unchanged |
| `UPSTASH_REDIS_REST_URL` | Upstash | **easy to forget — not in `.env.example`** |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | **easy to forget — not in `.env.example`** |
| `CLIENT_URL` | your Vercel URL | e.g. `https://go-marketplace-rouge.vercel.app` — drives **CORS + Socket.io origin** |

> 🔐 **Security note:** the Brevo API key (and any secret) that was ever pasted in chat or committed should be **rotated** before relying on it in production.

---

## 6. Updates OUTSIDE Heroku (required)

These are what make the frontend talk to the new backend. **Yes, Vercel must be updated.**

### 6.1 — Vercel (frontend) env vars → repoint to Heroku
In Vercel → Project → **Settings → Environment Variables**, update these two (currently point at Railway):

| Vercel var | New value |
|---|---|
| `VITE_API_URL` | `https://<your-app>.herokuapp.com/api/v1` |
| `VITE_SOCKET_URL` | `https://<your-app>.herokuapp.com` |

Leave `VITE_GOOGLE_CLIENT_ID` and `VITE_CLOUDINARY_CLOUD_NAME` unchanged.
**Then redeploy the frontend** (Vercel → Deployments → Redeploy) so the new values are baked into the build (Vite inlines `VITE_*` at build time).

### 6.2 — Google Cloud Console → add the new OAuth callback
APIs & Services → Credentials → your OAuth client → **Authorized redirect URIs** → add:
```
https://<your-app>.herokuapp.com/api/v1/auth/google/callback
```
(Keep the Railway one until cutover is verified, then remove it.)

### 6.3 — Socket.io: no code change needed
- **Server:** Socket.io `cors.origin` already reads `CLIENT_URL` → just set it on Heroku (Section 5). ✅
- **Client:** already connects to `VITE_SOCKET_URL` with `transports: ['websocket', 'polling']` (polling fallback prevents drops) and `withCredentials: true`. Updating the Vercel var (6.1) is all that's required. ✅

---

## 7. Cutover & verification checklist

Run through this after the first successful Heroku deploy:

- [ ] `GET https://<heroku>/api/v1/health` → `{ success: true }`
- [ ] `GET https://<heroku>/api/v1/categories` → returns data (proves DB + Prisma client work)
- [ ] Vercel `VITE_API_URL` / `VITE_SOCKET_URL` updated **and frontend redeployed**
- [ ] Open the live site → no console CORS errors
- [ ] Log in (email/password) → works
- [ ] Log in with **Google** → redirects back logged in (proves OAuth callback URL)
- [ ] Open **Messages** → real-time chat connects & sends (proves Socket.io/WebSocket)
- [ ] Post/edit an ad with an image → uploads (proves Cloudinary)
- [ ] Trigger a verification/contact email → arrives (proves Brevo)
- [ ] Browse home a few times → categories/featured fast (proves Upstash cache)
- [ ] Only after all green: **delete the Railway service** to stop billing/usage.

---

## 8. Rollback (if something breaks)

The migration is non-destructive — keep Railway running until verification passes.
- To roll back instantly: revert the two Vercel vars (`VITE_API_URL`, `VITE_SOCKET_URL`) to the Railway URLs and redeploy the frontend. The Railway backend is untouched and still live.
- Heroku build issues are isolated to Heroku; they don't affect the running Railway app.

---

## 9. Quick reference — commands

```bash
# one-time setup
heroku login
heroku create go-marketplace-api
heroku buildpacks:add -i 1 https://github.com/lstoll/heroku-buildpack-monorepo
heroku buildpacks:add -i 2 heroku/nodejs
heroku config:set APP_BASE=server
# ...set all config vars from Section 5...

# deploy (repeat for every future deploy)
git push heroku main

# logs / debugging
heroku logs --tail
heroku ps                      # see dyno status
heroku run "cd server && npx prisma migrate deploy"   # one-time, only if migrations pending
```

---

### File summary (what this migration adds to the repo)
| File | Change |
|---|---|
| `server/package.json` | add `engines` (Node 20.x) + `heroku-postbuild` script |
| `server/Procfile` | new file → `web: npm start` |
| *(everything else)* | unchanged — CORS, ports, Socket.io are env-driven |
