# GO Marketplace — Master Project Context for Claude Code

> Read this file completely before touching any code. Every session starts here.
> This is a production-grade, portfolio-quality full-stack marketplace application.
> Do NOT rush. Do NOT write messy code. Think like a senior engineer at every step.

---

## Project Overview

**Name:** GO Marketplace
**Tagline:** Buy. Sell. Connect.
**Type:** Full-stack classified ads + marketplace web application (OLX-level functionality, Airbnb-level polish)
**Goal:** Production-ready, recruiter-impressive, fully deployable web app

---

## Monorepo Structure

```
GO-MarketPlace/
├── CLAUDE.md                          ← You are here. Read every session.
├── .gitignore
├── README.md
├── design-screens/                    ← Stitch-generated HTML/PNG references (DO NOT MODIFY)
│   ├── home_page_1/
│   ├── search_results_page_1/
│   ├── ad_details_page_2/
│   ├── login_page_1/
│   ├── user_dashboard/
│   ├── create_new_ad/
│   ├── edit_ad/
│   ├── my_listings/
│   ├── messages_page/
│   ├── notifications_page/
│   ├── favorites/
│   ├── profile_page_fixed_header/
│   ├── settings_page/
│   ├── admin_panel/
│   ├── reports_moderation_populated_data/
│   └── premium_lifestyle/DESIGN.md   ← Official design system spec
│
├── client/                            ← React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                   ← Reusable primitives (Button, Input, Card, Modal, Badge, Avatar, Skeleton, Toast)
│   │   │   ├── layout/               ← Header, Footer, Sidebar, AdminLayout, DashboardLayout
│   │   │   └── shared/               ← AdCard, CategoryCard, UserAvatar, VerifiedBadge, EmptyState, LoadingSkeleton
│   │   ├── features/                 ← Feature-based modules (RTK slices + components)
│   │   │   ├── auth/
│   │   │   ├── ads/
│   │   │   ├── chat/
│   │   │   ├── notifications/
│   │   │   ├── favorites/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── hooks/                    ← Custom React hooks
│   │   ├── lib/                      ← axios instance, socket client, queryClient
│   │   ├── pages/                    ← Route-level page components
│   │   │   ├── public/               ← Home, Search, AdDetail, Login, Signup
│   │   │   ├── dashboard/            ← Overview, MyAds, CreateAd, EditAd, Favorites, Notifications, Profile, Settings, Messages
│   │   │   └── admin/                ← Dashboard, Users, Listings, Reports, Categories, Featured
│   │   ├── store/                    ← Redux Toolkit store + slices
│   │   ├── styles/                   ← globals.css, tailwind config
│   │   ├── types/                    ← Global TypeScript interfaces and enums
│   │   ├── utils/                    ← formatters, validators, helpers
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── routes.tsx                ← React Router v6 route definitions
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── server/                            ← Node.js + Express + TypeScript backend
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    ├── src/
    │   ├── config/                   ← env, database, cloudinary, passport, resend
    │   ├── controllers/              ← auth, users, ads, messages, notifications, admin, reports
    │   ├── middleware/               ← authenticate, authorize, validate, errorHandler, rateLimiter, upload
    │   ├── routes/                   ← v1 API routes
    │   ├── services/                 ← business logic layer
    │   ├── sockets/                  ← Socket.io handlers
    │   ├── types/                    ← Express augmentation, shared types
    │   ├── utils/                    ← jwt, email, cloudinary helpers, ApiError, ApiResponse
    │   ├── validators/               ← Zod schemas for all inputs
    │   └── app.ts                    ← Express app setup
    │   └── server.ts                 ← HTTP + Socket.io server entry
    ├── .env.example
    ├── tsconfig.json
    └── package.json
```

---

## Tech Stack — Locked & Final

### Frontend 
| Concern | Tool | Notes |
|---|---|---|
| Framework | React 19 Latest + TypeScript | Strict mode on |
| Build | Vite | Fast HMR |
| Routing | React Router latest | Nested routes, protected routes |
| Styling | Tailwind CSS Latest | Global design tokens via tailwind.config.ts |
| Global State | Redux Toolkit (RTK) | Auth, user, UI state, notifications, socket |
| Server State | TanStack Query v5 | All API calls, caching, pagination, optimistic updates |
| HTTP | Axios | Custom instance with interceptors, auto token refresh |
| Real-time | Socket.io client | Chat + live notifications |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Animations | Framer Motion | Page transitions, micro-interactions, modals |
| Icons | Lucide React | Consistent icon library |
| Date | date-fns | Formatting, relative time |
| Media | react-dropzone | Drag-and-drop image/file upload |

### Backend
| Concern | Tool | Notes |
|---|---|---|
| Runtime | Node.js 20+ LTS | |
| Framework | Express.js + TypeScript | |
| ORM | Prisma | Type-safe DB queries |
| Database | PostgreSQL via Supabase | Free tier, 500MB |
| Auth | Passport.js | Local strategy + Google OAuth 2.0 |
| Sessions/Tokens | JWT in httpOnly cookies | Refresh token rotation |
| Validation | Zod | Schema-first validation on all routes |
| Real-time | Socket.io | Chat messages + notifications |
| Email | Resend | Verification, password reset |
| Media | Cloudinary | Images, videos, audio, voice notes |
| Rate Limiting | express-rate-limit | Per-route limits |
| Security | helmet, cors, hpp | Production security headers |
| Logging | winston | Structured JSON logs |
| File Upload | multer + Cloudinary | Stream uploads directly |

### Database
| Concern | Tool |
|---|---|
| Provider | Supabase (PostgreSQL) |
| ORM | Prisma with migrations |
| Seeding | Prisma seed.ts with realistic fake data |

### Deployment (Reference)
| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render (free tier) |
| Database | Supabase |
| Media | Cloudinary |
| Email | Resend |

---

## Global Design System — ENFORCE ON EVERY SCREEN

> These tokens come from design-screens/premium_lifestyle/DESIGN.md.
> Every component MUST use these. Never hardcode colors.

### Colors (defined in tailwind.config.ts)
```typescript
// tailwind.config.ts — colors extension
colors: {
  brand: {
    pink:   '#C82C8C',
    purple: '#8A1D9D',
  },
  background: {
    DEFAULT: '#FFFFFF',
    soft:    '#FAFAFC',
    card:    '#FFFFFF',
  },
  border: {
    DEFAULT: '#ECECF1',
    divider: '#F0F0F5',
  },
  text: {
    primary:   '#232323',
    secondary: '#232323',   // same as primary, use opacity for muted
    muted:     '#232323',   // use opacity-60
    white:     '#FFFFFF',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#EF4444',
    info:    '#3B82F6',
  },
}
```

### Gradient — Primary (used for CTAs, hero, featured, active nav)
```css
background: linear-gradient(135deg, #C82C8C 0%, #8A1D9D 100%);
```
Create a Tailwind plugin or utility class `bg-brand-gradient` for this.

### Border Radius
```typescript
borderRadius: {
  card:    '20px',
  button:  '14px',
  input:   '16px',
  modal:   '24px',
  badge:   '9999px',
  DEFAULT: '8px',
}
```

### Typography — Inter font only
| Role | Size | Weight |
|---|---|---|
| Hero Title | 56px (desktop) / 40px (mobile) | 700 |
| Section Title | 32px | 600 |
| Card Title | 18px | 600 |
| Body | 15px | 400 |
| Label | 13px | 600 |
| Caption | 12px | 400 |
| Button | 15px | 500 |

### Shadows
```css
/* Card default  */ box-shadow: 0 2px 12px rgba(0,0,0,0.06);
/* Card hover    */ box-shadow: 0 8px 32px rgba(0,0,0,0.12);
/* Modal         */ box-shadow: 0 24px 80px rgba(0,0,0,0.16);
```

### Spacing Scale
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px

### Responsive Breakpoints
```
Mobile:  < 768px  — 4-col grid, 20px margins
Tablet:  768–1024px — 8-col grid, 40px margins  
Desktop: 1024px+  — 12-col grid, 80px margins, max-width 1200px
```

---

## Screens — Full List (17 total)

Reference the `design-screens/` folder for exact visual spec of each screen.

### Public (no auth required)
1. **Home Page** — Hero + search, categories, featured ads, latest ads, why GO, testimonials, footer
2. **Search Results** — Filters sidebar (category, location, price, condition, date), grid/list toggle, sort
3. **Ad Detail** — Image gallery, seller card, chat button, related listings
4. **Login** — Split screen, email/password, Google OAuth
5. **Signup** — Split screen, form, email verification flow

### User Dashboard (auth required)
6. **Dashboard Overview** — Metrics (active listings, sold, views, messages), quick actions
7. **Create Ad** — Multi-step form (category → details → images → location → preview → publish)
8. **Edit Ad** — Pre-filled create ad form
9. **My Ads** — Tabs (All/Active/Sold/Deactivated), table with actions
10. **Messages** — WhatsApp Web-style, two-panel, real-time, media + voice notes
11. **Notifications** — Feed with types: message, favorite, listing update, admin
12. **Favorites** — Saved listings grid
13. **Profile** — Cover banner, avatar, stats, listings, reviews
14. **Settings** — Profile, password, notifications, privacy

### Admin Panel (super admin only)
15. **Admin Dashboard** — Metrics, charts, moderation queue, recent activity
16. **Users Management** — Searchable table, ban/delete, status badges
17. **Reports & Moderation** — Reports queue, side panel detail, action buttons

### Global Components (build these first)
- Auth Modal (login/signup modal triggered for unauthenticated actions)
- Confirmation Modal (delete, ban, deactivate)
- Toast Notifications (success, error, info, warning — bottom-right, auto-dismiss)
- Empty States (illustrations + CTA for no listings, no messages, no favorites)
- Skeleton Loaders (shimmer effect for all card grids)
- Ad Card (used on home, search, favorites, profile — one component)

---

## Database Schema (Prisma) — Key Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String?   // null for OAuth users
  phone         String?
  avatar        String?
  coverImage    String?
  bio           String?
  city          String?
  isVerified    Boolean   @default(false)
  role          Role      @default(USER)
  status        UserStatus @default(ACTIVE)
  googleId      String?   @unique
  refreshToken  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  ads           Ad[]
  sentMessages      Message[]   @relation("SentMessages")
  receivedMessages  Message[]   @relation("ReceivedMessages")
  conversations     ConversationParticipant[]
  favorites     Favorite[]
  notifications Notification[]
  reports       Report[]        @relation("ReportedBy")
  reportedAds   Report[]        @relation("ReportedAd")
}

enum Role { USER ADMIN SUPER_ADMIN }
enum UserStatus { ACTIVE BANNED PENDING }

model Ad {
  id          String    @id @default(cuid())
  title       String
  description String
  price       Decimal
  negotiable  Boolean   @default(false)
  condition   Condition
  status      AdStatus  @default(ACTIVE)
  isFeatured  Boolean   @default(false)
  views       Int       @default(0)
  images      String[]
  city        String
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  favorites   Favorite[]
  reports     Report[]
}

enum Condition { NEW USED REFURBISHED }
enum AdStatus  { ACTIVE SOLD DEACTIVATED PENDING }

model Conversation {
  id           String    @id @default(cuid())
  adId         String?
  createdAt    DateTime  @default(now())
  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  conversationId String
  userId         String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])
  @@id([conversationId, userId])
}

model Message {
  id             String      @id @default(cuid())
  content        String?
  mediaUrl       String?
  mediaType      MediaType?
  isRead         Boolean     @default(false)
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String
  sender         User        @relation("SentMessages", fields: [senderId], references: [id])
  senderId       String
  createdAt      DateTime    @default(now())
}

enum MediaType { IMAGE VIDEO AUDIO VOICE_NOTE }

model Category {
  id    String @id @default(cuid())
  name  String @unique
  icon  String
  slug  String @unique
  ads   Ad[]
}

model Favorite {
  userId    String
  adId      String
  user      User   @relation(fields: [userId], references: [id])
  ad        Ad     @relation(fields: [adId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, adId])
}

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  body      String
  isRead    Boolean          @default(false)
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  metadata  Json?
  createdAt DateTime         @default(now())
}

enum NotificationType { MESSAGE FAVORITE LISTING_UPDATE ADMIN_ANNOUNCEMENT }

model Report {
  id           String       @id @default(cuid())
  reason       ReportReason
  description  String?
  status       ReportStatus @default(PENDING)
  priority     Priority     @default(MEDIUM)
  reportedById String
  reportedBy   User         @relation("ReportedBy", fields: [reportedById], references: [id])
  adId         String?
  ad           Ad?          @relation(fields: [adId], references: [id])
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

enum ReportReason  { SPAM FRAUD INAPPROPRIATE FAKE_LISTING HARASSMENT OTHER }
enum ReportStatus  { PENDING UNDER_REVIEW RESOLVED DISMISSED }
enum Priority      { LOW MEDIUM HIGH }
```

---

## API Routes Structure

```
/api/v1/auth
  POST   /register
  POST   /login
  POST   /logout
  POST   /refresh
  GET    /google
  GET    /google/callback
  POST   /verify-email
  POST   /forgot-password
  POST   /reset-password

/api/v1/users
  GET    /me
  PUT    /me
  PUT    /me/avatar
  GET    /:id/profile
  GET    /:id/ads

/api/v1/ads
  GET    /           (public, paginated, filterable)
  POST   /           (auth required)
  GET    /featured
  GET    /:id
  PUT    /:id        (owner only)
  DELETE /:id        (owner only)
  POST   /:id/favorite
  DELETE /:id/favorite
  PATCH  /:id/status

/api/v1/categories
  GET    /
  POST   /           (admin only)
  PUT    /:id        (admin only)
  DELETE /:id        (admin only)

/api/v1/conversations
  GET    /           (auth, own conversations)
  POST   /           (start new conversation)
  GET    /:id/messages
  POST   /:id/messages

/api/v1/notifications
  GET    /
  PATCH  /:id/read
  POST   /read-all

/api/v1/reports
  POST   /
  GET    /           (admin only)
  PATCH  /:id/status (admin only)

/api/v1/admin
  GET    /stats
  GET    /users
  PATCH  /users/:id/status
  DELETE /users/:id
  GET    /ads
  DELETE /ads/:id
  PATCH  /ads/:id/feature
  GET    /reports
```

---

## Authentication Architecture

- **JWT Access Token** — short-lived (15min), stored in httpOnly cookie
- **JWT Refresh Token** — long-lived (7 days), stored in httpOnly cookie, rotated on each use
- **Google OAuth 2.0** — via Passport.js, auto-creates account if email not found
- **Email Verification** — required before posting ads, via Resend
- **Role-based access** — USER | ADMIN | SUPER_ADMIN enforced on every protected route
- **Unauthenticated users** — can browse freely, blocked at: messaging, posting ads, favoriting → triggers auth modal

---

## Real-time Architecture (Socket.io)

```
Events emitted by server:
  message:new          → new chat message
  message:read         → message read receipt
  user:typing          → typing indicator
  user:online          → presence update
  notification:new     → new notification (any type)
  ad:updated           → ad status changed

Events emitted by client:
  message:send
  message:markRead
  user:typing
  conversation:join
  conversation:leave
```

Socket rooms: `user:{userId}` for notifications, `conversation:{conversationId}` for chat.

---

## Security Requirements — Non-Negotiable

- All inputs validated with Zod on backend before any DB operation
- JWT in httpOnly, SameSite=strict cookies only — never localStorage
- helmet.js on all responses
- CORS locked to frontend origin only
- Rate limiting: 100 req/15min general, 10 req/15min for auth routes
- Passwords hashed with bcrypt (salt rounds: 12)
- File upload: type validation (mimetype), size limit (10MB images, 50MB video, 5MB audio)
- SQL injection impossible via Prisma parameterized queries
- XSS protection via helmet CSP headers
- All admin routes double-checked: authenticate middleware + authorize('ADMIN','SUPER_ADMIN')

---

## Code Quality Standards — Enforce Always

### General
- TypeScript strict mode — no `any`, no implicit types
- ESLint + Prettier enforced
- Every function has a single responsibility
- No file longer than 300 lines — split if needed
- No business logic in controllers — delegate to service layer
- No direct DB calls in routes — controllers → services → Prisma

### Naming Conventions
```
Files:         kebab-case        (ad-card.tsx, auth.service.ts)
Components:    PascalCase        (AdCard, UserProfile)
Hooks:         camelCase + use   (useAuth, useInfiniteAds)
RTK Slices:    camelCase         (authSlice, adsSlice)
API functions: camelCase         (createAd, fetchUserProfile)
Constants:     SCREAMING_SNAKE   (MAX_FILE_SIZE, API_BASE_URL)
Types:         PascalCase        (AdStatus, UserRole)
```

### Frontend Patterns
- TanStack Query for ALL API data — no manual fetch in components
- RTK for global UI state — auth user, notifications count, socket status
- Custom hooks extract all logic from page components
- Page components are thin — just layout + hook calls
- Skeleton loaders on every data-dependent section
- Error boundaries on route level
- Optimistic updates for favorites, read receipts

### Backend Patterns
- Controller catches errors → passes to next(error)
- Global error handler returns consistent ApiResponse shape
- All responses use: `{ success, message, data, meta }` shape
- Pagination on all list endpoints: `{ data, meta: { total, page, limit, totalPages } }`
- Services return typed results, never throw HTTP errors (that's controllers' job)
- All async route handlers wrapped in asyncHandler utility

---

## Environment Variables

### client/.env
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
```

### server/.env
```
NODE_ENV=development
PORT=5000
DATABASE_URL=                    # Supabase PostgreSQL connection string
DIRECT_URL=                      # Supabase direct connection (for migrations)
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
FROM_EMAIL=noreply@go-marketplace.com
CLIENT_URL=http://localhost:5173
```

---

## Build Order — Follow This Sequence

> Complete each phase before moving to the next.

### Phase 1 — Project Foundation
1. Initialize monorepo (client with Vite+React+TS, server with Express+TS)
2. Install all dependencies
3. Configure Tailwind with full design token system
4. Setup ESLint + Prettier
5. Setup Prisma + Supabase connection
6. Run initial migration
7. Seed database with realistic fake data (5 categories minimum, 3 users, 20 ads)

### Phase 2 — Backend Core
8. Express app setup (helmet, cors, rate limiter, cookie-parser)
9. Prisma client singleton
10. ApiError + ApiResponse utilities + asyncHandler
11. Global error handler middleware
12. Zod validators for all schemas
13. Auth system: register, login, logout, refresh token, httpOnly cookies
14. Google OAuth via Passport.js
15. Email verification via Resend
16. JWT middleware (authenticate, authorize)
17. Cloudinary upload middleware (multer + stream)
18. All route controllers + services (ads, users, categories, conversations, notifications, reports, admin)

### Phase 3 — Real-time (Socket.io)
19. Socket.io server setup with auth middleware
20. Chat: join room, send message, read receipts, typing indicator
21. Notifications: emit to user room on relevant events

### Phase 4 — Frontend Core
22. Tailwind config with all design tokens
23. Axios instance with interceptors (auto attach cookie, refresh on 401)
24. Redux store + all slices (auth, notifications, socket, ui)
25. TanStack Query client setup
26. React Router routes (public, protected, admin)
27. Socket.io client connection (authenticated)

### Phase 5 — UI Components (Bottom-up)
28. Design system primitives: Button, Input, Badge, Avatar, Modal, Toast, Skeleton
29. Layout components: Header, Footer, DashboardSidebar, AdminSidebar
30. Shared components: AdCard, CategoryCard, EmptyState, ConfirmModal, AuthModal

### Phase 6 — Pages
31. Login + Signup (with Google OAuth button)
32. Home Page (hero, categories, featured ads, latest ads)
33. Search Results (filters, grid, pagination)
34. Ad Detail (gallery, seller card, related)
35. User Dashboard + My Ads + Create/Edit Ad
36. Messages Page (Socket.io real-time)
37. Notifications Page
38. Favorites + Profile + Settings
39. Admin Panel (all 3 admin screens)

### Phase 7 — Polish
40. Loading states + skeleton loaders everywhere
41. Error states + empty states
42. Toast notifications for all actions
43. Framer Motion animations (page transitions, modal, cards)
44. Full mobile responsiveness audit
45. Auth Modal for unauthenticated actions

---

## Responsiveness Rules — Every Screen

- **Mobile-first** Tailwind classes: base → `md:` → `lg:`
- Header: hamburger menu on mobile, full nav on desktop
- Ad grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Dashboard sidebar: hidden on mobile (slide-out drawer), visible on `lg:`
- Messages page: single panel on mobile (list OR chat, not both), split on `lg:`
- Admin table: horizontal scroll on mobile (`overflow-x-auto`)
- All modals: full-screen on mobile, centered card on desktop
- Hero text: 40px mobile, 56px desktop

---

## What NOT To Do — Ever

- ❌ No `any` TypeScript type
- ❌ No hardcoded colors — always use Tailwind tokens
- ❌ No inline styles (use Tailwind classes only)
- ❌ No API calls directly in React components — use TanStack Query hooks
- ❌ No business logic in Express route handlers — use service layer
- ❌ No JWT in localStorage — httpOnly cookies only
- ❌ No unvalidated user input reaching the database
- ❌ No single file over 300 lines — refactor into smaller modules
- ❌ No console.log in production code — use winston logger
- ❌ No raw SQL — Prisma only
- ❌ No skipping error handling — every async function handled

---

## Reference Files

Always check these before building any screen:
- `design-screens/{screen_name}/code.html` — Stitch-generated HTML reference
- `design-screens/{screen_name}/screen.png` — Visual reference
- `design-screens/premium_lifestyle/DESIGN.md` — Full official design system

When implementing a screen, open the corresponding `code.html` in browser, study the layout, extract colors/spacing/components, then implement it cleanly in React + Tailwind — do NOT copy the HTML directly.
