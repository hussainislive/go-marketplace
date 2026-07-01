# GO Marketplace

### Designed & developed by **Hussain Ahmed**

[![Email](https://img.shields.io/badge/Email-developer.hussain125%40gmail.com-C82C8C?style=flat&logo=gmail&logoColor=white)](mailto:developer.hussain125@gmail.com) &nbsp;[![GitHub](https://img.shields.io/badge/GitHub-hussainislive-181717?style=flat&logo=github&logoColor=white)](https://github.com/hussainislive) &nbsp;[![LinkedIn](https://img.shields.io/badge/LinkedIn-hussainislive-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/hussainislive)

> **Buy. Sell. Connect.**
> A production-grade, full-stack classified-ads marketplace — OLX-level functionality with Airbnb-level polish.

![GO Marketplace demo](client/src/assets/demo.gif)

GO Marketplace is a feature-complete classifieds platform where users can post listings, browse and search ads, chat in real time with sellers, favorite items, manage their listings from a dashboard, and where administrators can moderate users, listings, and reports. It is built as a TypeScript monorepo with a React 19 frontend and an Express + Prisma backend backed by PostgreSQL (Supabase).

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Monorepo Folder Structure](#monorepo-folder-structure)
5. [Prerequisites](#prerequisites)
6. [Environment Variables](#environment-variables)
7. [Getting Started](#getting-started)
8. [Available Scripts](#available-scripts)
9. [Database](#database)
10. [API Reference](#api-reference)
11. [Real-time (Socket.io) Events](#real-time-socketio-events)
12. [Authentication Flow](#authentication-flow)
13. [Caching (Redis)](#caching-redis)
14. [SEO](#seo)
15. [Testing & CI](#testing--ci)
16. [Design System](#design-system)
17. [Build Progress by Phase](#build-progress-by-phase)
18. [Seed Credentials](#seed-credentials)
19. [Notable Technical Decisions](#notable-technical-decisions)
20. [Troubleshooting](#troubleshooting)

---

## Features

- **Listings** — create, edit, delete, search, filter (category / city / price / condition), feature, and change status (active / sold / deactivated).
- **Real-time chat** — WhatsApp-style conversations between buyers and sellers over Socket.io, with typing indicators, read receipts, and media messages.
- **Authentication** — email/password (bcrypt) + Google OAuth 2.0, JWT access/refresh tokens stored in httpOnly cookies with silent refresh-token rotation, email verification, and password reset.
- **Favorites & notifications** — save ads and receive live notifications for messages, favorites, and listing updates.
- **User dashboard** — overview metrics, my-ads management, profile, and settings.
- **Admin panel** — dashboard stats, user management (ban/delete), listing moderation (remove/feature), and a reports queue.
- **Informational pages** — How It Works, Privacy Policy & Terms of Use, an About-the-Developer page, and a Contact page whose form emails the developer via Brevo.
- **Server-side caching** — Redis (Upstash) cache-aside on the read-heavy endpoints (categories, featured ads, ad listings) with TTLs and write-time invalidation, and a graceful no-op fallback when Redis is unavailable.
- **SEO** — per-page titles & meta via `react-helmet-async`, Open Graph + Twitter cards, canonical URLs, JSON-LD structured data (WebSite / Product / Person), plus `robots.txt` and `sitemap.xml`.
- **Performance** — route-level code splitting, a React-vendor chunk, CDN-sized images (Cloudinary/Unsplash transforms), `content-visibility` on ad cards, self-hosted Inter (no font-swap CLS), and an Embla-powered hero carousel.
- **Resilience** — a branded router error page (`errorElement`) plus a one-shot silent reload that recovers open tabs from stale-chunk MIME errors after a new deploy.
- **Production hardening** — Helmet CSP, origin-locked CORS, HPP, per-route rate limiting, Zod validation on every input, and structured Winston logging.

---

## Tech Stack

### Frontend (`client/`)

| Concern | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (CSS `@theme` tokens) |
| Global state | Redux Toolkit |
| Server state | TanStack Query v5 |
| HTTP client | Axios (interceptors + auto token refresh) |
| Real-time | socket.io-client |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Carousel | Embla Carousel (+ autoplay) |
| SEO | react-helmet-async |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Fonts | Self-hosted Inter (`@fontsource/inter`) |

### Backend (`server/`)

| Concern | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 5 + TypeScript |
| ORM | Prisma 7 (with `@prisma/adapter-pg` driver adapter) |
| Database | PostgreSQL via Supabase |
| Auth | Passport.js (Local + Google OAuth 2.0), JWT |
| Validation | Zod |
| Real-time | Socket.io |
| Email | Brevo (HTTP API) |
| Media | Cloudinary (multer memory storage → stream upload) |
| Caching | Upstash Redis (`@upstash/redis`, cache-aside) |
| Security | helmet, cors, hpp, express-rate-limit, bcryptjs |
| Logging | Winston |
| Testing / CI | Vitest, GitHub Actions (lint · typecheck · build) |

---

## Architecture Overview

```
┌──────────────────────┐         HTTP / REST (axios, withCredentials)         ┌──────────────────────┐
│                      │  ───────────────────────────────────────────────►   │                      │
│   client/ (React)    │                                                      │   server/ (Express)  │
│                      │  ◄───────────────────────────────────────────────   │                      │
│  • Redux (UI/auth)   │         WebSocket (socket.io, cookie auth)           │  Routes → Controllers│
│  • TanStack Query    │  ◄═══════════════════════════════════════════════►  │       → Services     │
│  • React Router      │                                                      │       → Prisma       │
└──────────────────────┘                                                      └───────────┬──────────┘
                                                                                          │
                                                                              ┌───────────▼──────────┐
                                                                              │  PostgreSQL (Supabase)│
                                                                              └───────────────────────┘
```

**Backend layering (strict, no shortcuts):**
`Route` → `validate/authenticate/authorize middleware` → `Controller` (HTTP concerns only) → `Service` (business logic) → `Prisma` (data access). Controllers never call Prisma directly; services never throw HTTP errors (that is the controller's job via `ApiError`).

---

## Monorepo Folder Structure

```
GO-MarketPlace/
├── CLAUDE.md                     # Master project context & coding standards
├── MASTER_PROMPT.md              # Phase-by-phase build instructions
├── README.md                     # ← this file
├── package.json                  # Root workspace scripts (concurrently)
├── design-screens/               # Stitch HTML/PNG design references + DESIGN.md
│
├── client/                       # React 19 + Vite frontend
│   ├── index.html
│   ├── vite.config.ts            # @ alias, /api dev proxy → :5001
│   ├── tsconfig.app.json
│   ├── .env                      # VITE_API_URL, VITE_SOCKET_URL, ...
│   └── src/
│       ├── main.tsx              # Entry: Redux + QueryClient providers
│       ├── App.tsx               # AuthBootstrap, SocketManager, Router, Toaster
│       ├── index.css             # Tailwind v4 @theme design tokens
│       ├── routes.tsx            # Public / Protected / Admin route guards
│       ├── lib/
│       │   ├── axios.ts          # Axios instance + 401 refresh interceptor
│       │   ├── queryClient.ts    # TanStack Query config
│       │   └── socket.ts         # Socket.io client + typed event emitters
│       ├── store/
│       │   ├── index.ts          # configureStore
│       │   ├── hooks.ts          # typed useAppDispatch / useAppSelector
│       │   ├── authSlice.ts      # user, isAuthenticated, isLoading
│       │   ├── uiSlice.ts        # authModal, sidebar
│       │   ├── socketSlice.ts    # connected, onlineUsers
│       │   └── notificationSlice.ts # unreadCount
│       └── pages/
│           ├── public/           # Home, Search, AdDetail, Login, Signup,
│           │                     #   VerifyEmail, HowItWorks, Legal,
│           │                     #   Developer (About), Contact, RouteError
│           ├── dashboard/        # Dashboard, CreateAd, EditAd, MyAds,
│           │                     #   Messages, Notifications, Favorites,
│           │                     #   Profile, Settings
│           └── admin/            # AdminDashboard, Users, Listings,
│                                 #   Reports, Categories
│
└── server/                       # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma         # Full data model (9 models, 9 enums)
    │   ├── seed.ts               # Faker-based seed
    │   └── migrations/           # SQL migration history
    ├── prisma.config.ts          # Prisma 7 config (adapter + seed command)
    ├── tsconfig.json
    ├── tsconfig.seed.json        # ts-node config for seeding
    ├── .env                      # DATABASE_URL, JWT secrets, ... (gitignored)
    ├── .env.example
    └── src/
        ├── server.ts             # HTTP + Socket.io entry, Prisma connect
        ├── app.ts                # Express app: helmet, cors, routes, errors
        ├── config/
        │   ├── env.ts            # Zod-validated environment
        │   ├── database.ts       # Prisma singleton (pg adapter)
        │   └── passport.ts       # Local + Google strategies
        ├── middleware/
        │   ├── authenticate.ts   # JWT from httpOnly cookie → req.user
        │   ├── authorize.ts      # role gate (USER/ADMIN/SUPER_ADMIN)
        │   ├── validate.ts       # Zod validation factory
        │   ├── upload.ts         # multer memory storage
        │   ├── rateLimiter.ts    # general + auth limiters
        │   └── errorHandler.ts   # global error handler
        ├── validators/           # auth, ad, user, message, report, contact (Zod)
        ├── services/             # auth, user, ad, category, conversation,
        │                         #   notification, report, admin
        ├── controllers/          # one per feature (thin, HTTP only)
        ├── routes/               # /api/v1/* route definitions
        ├── sockets/
        │   └── index.ts          # Socket.io auth + chat/notification handlers
        ├── types/                # express.d.ts augmentation, shared types
        └── utils/                # ApiError, ApiResponse, asyncHandler,
                                  #   jwt, email, cloudinary, logger
```

---

## Prerequisites

- **Node.js** 20 LTS or newer
- **npm** 9+
- A **Supabase** project (free tier) for PostgreSQL — you need the pooled and direct connection strings
- *(Optional, for full functionality)* Cloudinary account (media uploads), Brevo API key (emails), Google OAuth credentials (social login). The app boots and runs without these; only the corresponding features are inert.

---

## Environment Variables

### `server/.env`

```bash
NODE_ENV=development
PORT=5001                         # 5000 is taken by macOS Control Center

# Supabase PostgreSQL
# Pooled (transaction mode) — used at runtime by the app
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
# Session-mode pooler — used by Prisma migrations & seeding
DIRECT_URL=postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres

# JWT
JWT_ACCESS_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5001/api/v1/auth/google/callback

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Brevo email (optional) — HTTP API key from Brevo → Settings → SMTP & API → API keys
BREVO_API_KEY=

# Frontend origin (CORS + email links)
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```bash
VITE_API_URL=http://localhost:5001/api/v1
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
```

> **Port note:** the backend runs on **5001**, not 5000, because macOS Control Center (AirPlay Receiver) binds port 5000 by default.

---

## Getting Started

```bash
# 1. Clone and install root dev deps (concurrently)
git clone <your-repo-url> GO-MarketPlace
cd GO-MarketPlace
npm install

# 2. Install workspace dependencies
cd client && npm install
cd ../server && npm install
cd ..

# 3. Configure environment
cp server/.env.example server/.env
#   → fill in DATABASE_URL, DIRECT_URL, and JWT secrets at minimum
#   → client/.env already points at http://localhost:5001

# 4. Set up the database (from server/)
cd server
npx prisma migrate dev --name init   # apply schema → creates tables
npx prisma generate                  # generate the typed client
npx prisma db seed                   # populate demo data
cd ..

# 5. Run both apps together
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api/v1
- **Prisma Studio (DB browser):** `npm run db:studio`

Quick sanity check once the server is up:

```bash
curl http://localhost:5001/api/v1/categories     # → 12 categories
curl "http://localhost:5001/api/v1/ads?limit=3"  # → paginated ads
```

---

## Available Scripts

### Root (`package.json`)

| Script | Description |
|---|---|
| `npm run dev` | Run client **and** server together (via `concurrently`) |
| `npm run dev:client` | Vite dev server only → `:5173` |
| `npm run dev:server` | Express dev server only (ts-node-dev) → `:5001` |
| `npm run build` | Build both client and server |
| `npm run build:client` / `build:server` | Build one side |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | `prisma db seed` |
| `npm run db:studio` | Open Prisma Studio |

### Server (`server/package.json`)

| Script | Description |
|---|---|
| `npm run dev` | ts-node-dev with respawn + transpile-only |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/server.js` (production) |
| `npm run db:seed` | `prisma db seed` |
| `npm run prisma:migrate` / `prisma:generate` / `prisma:studio` | Prisma helpers |

### Client (`client/package.json`)

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

---

## Database

PostgreSQL on Supabase, accessed through **Prisma 7** using the `@prisma/adapter-pg` driver adapter (see [Notable Technical Decisions](#notable-technical-decisions)).

**Models:** `User`, `Category`, `Ad`, `Conversation`, `ConversationParticipant`, `Message`, `Favorite`, `Notification`, `Report`.

**Enums:** `Role`, `UserStatus`, `Condition`, `AdStatus`, `MediaType`, `NotificationType`, `ReportReason`, `ReportStatus`, `Priority`.

The seed (`prisma/seed.ts`) creates:

- 12 categories (Vehicles, Property, Mobile Phones, Electronics, Jobs, Pets, Furniture, Fashion, Services, Education, Sports, Books)
- 1 super-admin + 10 regular users
- 50 ads across categories (Unsplash images)
- Conversations with messages, favorites, notifications, and reports

---

## API Reference

All routes are prefixed with **`/api/v1`**. Successful responses share a consistent envelope:

```jsonc
// single resource
{ "success": true, "message": "Ad retrieved", "data": { /* ... */ } }

// paginated list
{ "success": true, "message": "Ads retrieved", "data": [ /* ... */ ],
  "meta": { "total": 35, "page": 1, "limit": 20, "totalPages": 2 } }

// error
{ "success": false, "message": "Authentication required" }
```

### Auth — `/api/v1/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account, send verification email |
| POST | `/login` | — | Set httpOnly access + refresh cookies |
| POST | `/logout` | ✅ | Clear cookies, revoke refresh token |
| POST | `/refresh` | cookie | Rotate tokens |
| GET | `/google` | — | Begin Google OAuth |
| GET | `/google/callback` | — | OAuth callback → set cookies → redirect |
| POST | `/verify-email` | — | Verify email by token |
| POST | `/forgot-password` | — | Send reset email |
| POST | `/reset-password` | — | Reset password by token |

### Users — `/api/v1/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | ✅ | Current user |
| PUT | `/me` | ✅ | Update profile |
| PUT | `/me/avatar` | ✅ | Upload avatar |
| GET | `/:id/profile` | — | Public profile |
| GET | `/:id/ads` | — | A user's public ads |

### Ads — `/api/v1/ads`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Paginated, filterable (`q, category, city, minPrice, maxPrice, condition, sort, page, limit`) |
| POST | `/` | ✅ | Create ad (+ image upload) |
| GET | `/featured` | — | Featured ads |
| GET | `/me` | ✅ | My ads (filter by status) |
| GET | `/:id` | — | Single ad (increments views) |
| PUT | `/:id` | ✅ owner | Update ad |
| DELETE | `/:id` | ✅ owner | Delete ad |
| POST/DELETE | `/:id/favorite` | ✅ | Toggle favorite |
| PATCH | `/:id/status` | ✅ owner | Change status |

### Categories — `/api/v1/categories`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List with ad counts |
| POST/PUT/DELETE | `/` `/:id` | ✅ admin | CRUD |

### Conversations — `/api/v1/conversations`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | My conversations |
| POST | `/` | ✅ | Start/find a conversation |
| GET | `/:id/messages` | ✅ | Paginated messages |
| POST | `/:id/messages` | ✅ | Send message (+ media upload) |

### Notifications — `/api/v1/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Paginated notifications |
| PATCH | `/:id/read` | ✅ | Mark one read |
| POST | `/read-all` | ✅ | Mark all read |

### Reports — `/api/v1/reports`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Report an ad |
| GET | `/` | ✅ admin | List reports (filterable) |
| PATCH | `/:id/status` | ✅ admin | Update report status |

### Admin — `/api/v1/admin` *(all require `ADMIN` or `SUPER_ADMIN`)*
| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Dashboard metrics |
| GET | `/users` | List/search users |
| PATCH | `/users/:id/status` | Ban / activate |
| DELETE | `/users/:id` | Delete user |
| GET | `/ads` | List all ads |
| DELETE | `/ads/:id` | Force-delete ad |
| PATCH | `/ads/:id/feature` | Toggle featured |
| GET | `/reports` | Reports queue |

### Contact — `/api/v1/contact`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | — | Send a message from the public Contact form (rate-limited; emails the developer via Brevo) |

---

## Real-time (Socket.io) Events

The socket connection is **authenticated by the same `accessToken` httpOnly cookie** as the REST API. A connection middleware parses the cookie, verifies the JWT, and rejects the handshake with `Authentication required` if invalid. On connect, the user joins their personal room `user:{userId}`.

**Client → Server**
| Event | Payload | Effect |
|---|---|---|
| `conversation:join` | `conversationId` | Join `conversation:{id}` room |
| `conversation:leave` | `conversationId` | Leave room |
| `message:send` | `{ conversationId, content?, recipientId, mediaUrl?, mediaType? }` | Persist message → broadcast `message:new` → notify recipient |
| `message:markRead` | `{ messageId, conversationId }` | Mark read → emit `message:read` |
| `conversation:markAllRead` | `conversationId` | Bulk mark read → emit `conversation:allRead` |
| `user:typing` | `{ conversationId, isTyping }` | Relay typing state to room |

**Server → Client**
| Event | Payload | Meaning |
|---|---|---|
| `message:new` | message object | New message in a conversation |
| `message:read` | `{ messageId, conversationId, readBy }` | Read receipt |
| `conversation:allRead` | `{ conversationId, readBy }` | All read |
| `user:typing` | `{ userId, conversationId, isTyping }` | Typing indicator |
| `user:online` | `{ userId, online }` | Presence update |
| `notification:new` | `{ type, title, body, metadata }` | Live notification |
| `message:error` | `{ message }` | Send failure |

On the client, `App.tsx`'s `SocketManager` connects the socket only when authenticated and wires `user:online` / `notification:new` into Redux.

---

## Authentication Flow

1. **Login / Register** issues a short-lived **access token (15 min)** and a long-lived **refresh token (7 days)**, both as `httpOnly`, `SameSite=Strict` cookies — never localStorage.
2. Axios sends cookies automatically (`withCredentials: true`).
3. On any **401**, the Axios response interceptor calls `/auth/refresh` once, rotates the tokens, and retries the original request. Concurrent 401s are queued behind a single refresh.
4. If refresh fails, the client dispatches `logout()` and redirects to `/login`.
5. **Refresh-token rotation:** each refresh invalidates the previous refresh token (stored hashed on the user) and issues a new pair.
6. **Route guards** (`routes.tsx`): unauthenticated users hitting a protected route get the Auth Modal (not a redirect); non-admins hitting `/admin/*` are redirected to `/`. The backend independently enforces the same rules via `authenticate` + `authorize` middleware.

---

## Caching (Redis)

The read-heavy public endpoints are cached in **Upstash Redis** using a simple cache-aside pattern, taking load off PostgreSQL on the busiest routes.

- **Helpers** — `server/src/config/redis.ts` (client; returns `null` when env vars are absent so the app runs uncached) and `server/src/utils/cache.ts` (`cacheGetOrSet(key, ttl, fetcher)` + `cacheInvalidate(...keys)`). Every Redis call is wrapped in `try/catch`, so a cache outage **never breaks a request** — it transparently falls back to the database.

| Cached | Key | TTL | Invalidated when |
|---|---|---|---|
| `GET /categories` | `categories:all` | 1 hour | a category is created / updated / deleted |
| `GET /ads/featured` | `ads:featured` | 5 min | an ad is featured / unfeatured / deleted |
| `GET /ads?…` (list) | `ads:list:<filters>` | 60 s | expires by TTL (kept short so new ads appear quickly) |

On the client, TanStack Query `staleTime` is tuned to match (categories 30 min, featured 5 min) so the browser also avoids redundant refetches.

**Env vars:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (both optional — omit them to disable caching).

---

## SEO

- **Per-page meta** via `react-helmet-async` and a reusable `Seo` component (`client/src/components/shared/Seo.tsx`): unique `<title>`, description, and canonical URL on every public page; auth/dashboard pages are marked `noindex`.
- **Social cards** — Open Graph + Twitter `summary_large_image` tags.
- **Structured data (JSON-LD)** — `WebSite` + `SearchAction` (home), `Product`/`Offer` (ad detail), and `Person` (about) for rich Google results.
- **Crawler files** — `client/public/robots.txt` (blocks private routes, points to the sitemap) and `client/public/sitemap.xml`.

---

## Testing & CI

- **Unit tests** with **Vitest** cover the pure logic most worth protecting: formatters / CDN image helper (`utils/format`), Zod validators, and the Redis cache helper (with a mocked client). Run with `npm test` in `client/`.
- **GitHub Actions** (`.github/workflows/ci.yml`) runs **lint → type-check → build → test** on every push and pull request.

---

## Design System

Tailwind **v4** is used with design tokens declared directly in CSS (`client/src/index.css` `@theme` block) — there is no `tailwind.config.ts`.

| Token group | Values |
|---|---|
| Brand | `brand-pink #C82C8C`, `brand-purple #8A1D9D` |
| Gradient | `bg-brand-gradient` → `linear-gradient(135deg, #C82C8C, #8A1D9D)` |
| Radii | card 20px, button 14px, input 16px, modal 24px, badge 9999px |
| Shadows | card, card-hover, modal |
| Typography | Inter; hero 56/40px, section 32px, card-title 18px, body 15px |
| Status | success `#22C55E`, warning `#F59E0B`, error `#EF4444`, info `#3B82F6` |

Visual references for every screen live in `design-screens/{screen}/` (HTML + PNG), with the canonical spec in `design-screens/premium_lifestyle/DESIGN.md`.

---

## Build Progress by Phase

The project follows the phased plan in `MASTER_PROMPT.md` / `CLAUDE.md`.

| Phase | Scope | Status |
|---|---|---|
| **1 — Foundation** | Monorepo, Vite client, Express server, Tailwind tokens, Prisma schema, migration, seed | ✅ Complete |
| **2 — Backend** | Utilities, middleware, Zod validators, all services/controllers/routes (auth, users, ads, categories, conversations, notifications, reports, admin) | ✅ Complete |
| **3 — Socket.io** | Cookie-authenticated socket server: rooms, chat send, read receipts, typing, presence, live notifications | ✅ Complete |
| **4 — Frontend Core** | Axios instance + refresh interceptor, TanStack Query client, Socket.io client, Redux store (auth/ui/socket/notification), React Router guards, App/main wiring | ✅ Complete |
| **5 — UI Components** | Design-system primitives (Button, Input, Card, Badge, Modal, Skeleton, Spinner, Tabs, Avatar, Select, ConfirmModal, PriceRangeSlider), layouts (Header, Footer, Public/Dashboard/Admin), shared components (AdCard, AdCardSkeleton, CategoryCard, AuthModal, EmptyState, VerifiedBadge) | ✅ Complete |
| **6 — Pages** | All 17 screens implemented against the live API with skeletons + empty states: Home, Search (filters + dual price slider), Ad Detail (gallery/lightbox/chat/report), Login, Signup, Dashboard, My Ads, Create/Edit Ad (dropzone wizard), Messages (realtime + media + voice notes), Notifications, Favorites, Profile, Settings, Admin Dashboard (recharts), Users, Listings, Reports (slide-in panel), Categories | ✅ Complete |
| **7 — Polish** | Framer Motion transitions, full mobile audit, error states, branded router error page, stale-chunk auto-recovery, and informational pages (How It Works, Privacy & Terms, About the Developer, Contact) wired into routes + footer | ✅ Complete |

> **What's verified working today:** the backend API serves real seeded data; auth (register/login/refresh/logout) sets and rotates cookies; admin routes return 401/403 appropriately; the Socket.io handshake rejects unauthenticated clients and accepts authenticated ones; the full React app (all 17 pages, all components) compiles under `tsc` and builds under Vite with zero errors; new endpoints (`/users/me/stats`, `/ads/favorites`) and existing ones (`/admin/stats`, `/conversations`, `/ads/featured`, `/categories`) all respond correctly with seeded data.

### Frontend data layer

All API access goes through typed TanStack Query hooks in `client/src/api/` (`ads`, `categories`, `auth`, `users`, `conversations`, `notifications`, `favorites`, `reports`, `admin`), backed by the Axios instance with automatic 401 refresh. Domain types live in `client/src/types/`. Realtime chat uses the Socket.io client emitters in `client/src/lib/socket.ts`.

---

## Seed Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@go.com` | `Admin@123` |
| Regular user | any seeded user email | `User@1234` |

List the seeded user emails any time with `npm run db:studio`.

---

## Notable Technical Decisions

- **Prisma 7 driver adapter.** Prisma 7 removed `url`/`directUrl` from `schema.prisma`. The connection is provided at runtime via `@prisma/adapter-pg` (a `pg.Pool` wrapped in `PrismaPg`) in `server/src/config/database.ts`, in `prisma.config.ts` for migrations, and in `prisma/seed.ts` for seeding.
- **Express 5 read-only `req.query`.** Express 5 makes `req.query` a getter, so validation middleware cannot reassign it. Query validation is therefore parsed directly in the controller (`searchAdsSchema.parse(req.query)`); `validate()` only reassigns `body`/`params`.
- **Tailwind v4 with no config file.** All tokens live in the CSS `@theme` block; the build uses `@tailwindcss/vite`.
- **Brevo over HTTP, not SMTP.** Cloud hosts (Railway) block outbound SMTP ports (25/465/587), so email is sent via Brevo's HTTP API (`https://api.brevo.com/v3/smtp/email`) over port 443 using `fetch`. The `BREVO_API_KEY` is read lazily, so the server boots fine without it (email is inert in dev).
- **String-literal enum types in services.** To stay decoupled from Prisma's generated client, services use string-literal unions (e.g. `'ACTIVE' | 'SOLD' | ...`) and the `Prisma.*WhereInput` types for query shapes.
- **Port 5001.** macOS Control Center occupies port 5000, so the backend defaults to 5001 (client proxy and env updated to match).
- **Stale-chunk auto-recovery.** After a deploy, a tab left open may still reference old hashed JS chunks that no longer exist; loading one fails with a "not a valid JavaScript MIME type" / dynamic-import error. `client/src/main.tsx` listens for these errors and performs a single guarded `window.location.reload()` (tracked via a `sessionStorage` flag to avoid loops) so the user silently lands on the fresh build. React Router routes also declare a branded `RouteErrorPage` as their `errorElement`.
- **Brand icons are inline SVGs.** This version of `lucide-react` no longer ships GitHub/LinkedIn brand logos, so `client/src/components/shared/BrandIcons.tsx` defines minimal inline SVG components with the same `size`/`className` API.

---

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `EADDRINUSE :::5000` | macOS Control Center owns port 5000 — the server uses **5001**; ensure `PORT=5001` in `server/.env`. |
| `P1001: Can't reach database server` | Use the **pooler** host (`aws-1-<region>.pooler.supabase.com`), not the deprecated `aws-0`. Verify `DATABASE_URL`/`DIRECT_URL`. |
| `PrismaClient needs … adapter or accelerateUrl` | Prisma 7 requires the pg adapter; make sure `@prisma/adapter-pg` is wired in `database.ts`, `prisma.config.ts`, and `seed.ts`. |
| Verification emails not arriving | Set `BREVO_API_KEY` and verify a sender in Brevo → Senders. The "From" address in `src/utils/email.ts` must match a verified sender. |
| Socket connects but immediately errors | The handshake needs a valid `accessToken` cookie — log in first; the socket connects only when authenticated. |
| `Cannot set property query of #<IncomingMessage>` | Express 5 — don't reassign `req.query`; parse it in the controller (already handled). |

---

<sub>Built by Hussain Ahmed. See `CLAUDE.md` for the full engineering standards and `MASTER_PROMPT.md` for the phase-by-phase build plan.</sub>
