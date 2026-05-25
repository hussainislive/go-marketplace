# GO Marketplace — Master Coding Agent Prompt
# Use this with: Claude Code, Codex, or any AI coding agent
# Always run this AFTER the agent has read CLAUDE.md

---

## AGENT INSTRUCTIONS — READ FIRST

You are a senior full-stack TypeScript engineer.
Your job is to build the GO Marketplace application from scratch.

Before writing a single line of code:
1. Read `CLAUDE.md` completely — it is your single source of truth
2. Open `design-screens/{screen}/code.html` for visual reference before building each screen
3. Follow the build order in CLAUDE.md Phase 1 → 7 exactly
4. Do not skip phases. Do not rush. Do not write placeholder code.

This is a production-grade application. Every file you write must be:
- Fully typed (TypeScript strict, no `any`)
- Modular and single-responsibility
- Following the patterns defined in CLAUDE.md
- Using the exact design tokens (colors, radius, spacing, typography) from CLAUDE.md

---

## WHAT YOU ARE BUILDING

A full-stack classified ads marketplace called **GO** (tagline: Buy. Sell. Connect.)

Think: OLX functionality + Airbnb visual quality + Linear UI precision.

**Monorepo structure:**
- `client/` — React 18 + TypeScript + Vite + Tailwind + RTK + TanStack Query
- `server/` — Node.js + Express + TypeScript + Prisma + PostgreSQL (Supabase)

---

## PHASE 1 — PROJECT FOUNDATION

### Step 1.1 — Initialize the monorepo

```bash
# Root package.json for monorepo scripts
# Initialize client
npm create vite@latest client -- --template react-ts
cd client && npm install

# Initialize server
mkdir server && cd server && npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

### Step 1.2 — Install ALL client dependencies at once

```bash
cd client
npm install \
  react-router-dom \
  @reduxjs/toolkit react-redux \
  @tanstack/react-query @tanstack/react-query-devtools \
  axios \
  react-hook-form @hookform/resolvers zod \
  socket.io-client \
  framer-motion \
  lucide-react \
  date-fns \
  react-dropzone \
  react-hot-toast \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-tooltip

npm install -D \
  tailwindcss postcss autoprefixer \
  @tailwindcss/forms \
  eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier eslint-config-prettier
```

### Step 1.3 — Install ALL server dependencies at once

```bash
cd server
npm install \
  express \
  prisma @prisma/client \
  passport passport-local passport-google-oauth20 \
  jsonwebtoken \
  bcryptjs \
  cookie-parser \
  cors \
  helmet \
  express-rate-limit \
  multer \
  cloudinary multer-storage-cloudinary \
  socket.io \
  resend \
  winston \
  zod \
  hpp \
  express-mongo-sanitize \
  @faker-js/faker

npm install -D \
  typescript ts-node ts-node-dev \
  @types/express @types/node @types/passport @types/passport-local \
  @types/passport-google-oauth20 @types/jsonwebtoken @types/bcryptjs \
  @types/cookie-parser @types/cors @types/multer @types/hpp \
  eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier
```

### Step 1.4 — Tailwind Config with Full Design Tokens

Create `client/tailwind.config.ts` with ALL design tokens from CLAUDE.md. This is the most important config file. Get it right once.

```typescript
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
          secondary: '#232323',
          white:     '#FFFFFF',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#3B82F6',
        },
      },
      borderRadius: {
        card:   '20px',
        button: '14px',
        input:  '16px',
        modal:  '24px',
        badge:  '9999px',
      },
      boxShadow: {
        card:       '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        modal:      '0 24px 80px rgba(0,0,0,0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero':    ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero-sm': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'section': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'card-title': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body':    ['15px', { lineHeight: '1.6' }],
        'label':   ['13px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.02em' }],
        'caption': ['12px', { lineHeight: '1.4' }],
      },
      maxWidth: {
        container: '1200px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #C82C8C 0%, #8A1D9D 100%)',
      },
      spacing: {
        'margin-desktop': '80px',
        'margin-mobile':  '20px',
        'gutter':         '24px',
      },
    },
  },
  plugins: [forms],
}

export default config
```

### Step 1.5 — Prisma Setup

```bash
cd server
npx prisma init
```

Then write `prisma/schema.prisma` using the FULL schema defined in CLAUDE.md.
Every model, every enum, every relation — complete.

Then run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 1.6 — Database Seed

Write `server/prisma/seed.ts` using `@faker-js/faker` to create:
- 12 categories (Vehicles, Property, Mobile Phones, Electronics, Jobs, Pets, Furniture, Fashion, Services, Education, Sports, Books)
- 1 SUPER_ADMIN user (email: admin@go.com, password: Admin@123)
- 10 regular USER accounts with realistic names + emails
- 50 ads across all categories with multiple images (use Unsplash URLs)
- Conversations and messages between users
- Favorites and notifications

Run with: `npx prisma db seed`

---

## PHASE 2 — BACKEND

Build in this order. No skipping.

### Server Entry (server/src/server.ts)
- Create Express app
- Attach Socket.io to HTTP server
- Connect Prisma
- Start listening on PORT from env

### Core Utilities (build these before anything else)
```
server/src/utils/ApiError.ts        — Custom error class with statusCode + message
server/src/utils/ApiResponse.ts     — Standard response shape { success, message, data, meta }
server/src/utils/asyncHandler.ts    — Wraps async route handlers, catches errors → next(error)
server/src/utils/jwt.ts             — generateAccessToken, generateRefreshToken, verifyToken
server/src/utils/email.ts           — sendVerificationEmail, sendPasswordResetEmail via Resend
server/src/utils/cloudinary.ts      — uploadToCloudinary, deleteFromCloudinary helpers
```

### Middleware (build before routes)
```
server/src/middleware/authenticate.ts  — Verify JWT from httpOnly cookie
server/src/middleware/authorize.ts     — Check user role (USER/ADMIN/SUPER_ADMIN)
server/src/middleware/validate.ts      — Zod schema validation middleware factory
server/src/middleware/upload.ts        — multer + Cloudinary storage config
server/src/middleware/errorHandler.ts  — Global error handler (catches ApiError + unknown)
server/src/middleware/rateLimiter.ts   — General + auth-specific rate limiters
```

### Zod Validators (server/src/validators/)
Write complete Zod schemas for:
- `auth.validator.ts` — register, login, resetPassword, verifyEmail
- `ad.validator.ts` — createAd, updateAd, searchAds (query params)
- `user.validator.ts` — updateProfile
- `message.validator.ts` — sendMessage
- `report.validator.ts` — createReport

### Services + Controllers + Routes
Build each feature module completely before moving to the next:

1. **Auth** — register (hash pw, send verification email), login (set httpOnly cookies), logout (clear cookies), refresh token, Google OAuth callback (auto-create if new), verify email, forgot/reset password

2. **Users** — get me, update profile, upload avatar to Cloudinary, get user profile by id, get user's public ads

3. **Ads** — create (with image upload to Cloudinary), read (paginated, filterable by category/city/price/condition/search query), get single, update (owner check), delete (owner check), toggle favorite, update status (active/sold/deactivated), get featured ads

4. **Categories** — public list, admin CRUD

5. **Conversations + Messages** — start conversation (linked to ad), get all conversations for user, get messages (paginated), send message (text/media — upload to Cloudinary), mark as read

6. **Notifications** — get all for user (paginated), mark one read, mark all read

7. **Reports** — create report (on ad), admin: get all reports (filterable), update report status

8. **Admin** — dashboard stats, user management (list, ban, delete), ad management (list, remove, feature/unfeature), report management

---

## PHASE 3 — SOCKET.IO

### server/src/sockets/index.ts
```typescript
// Socket auth middleware — verify JWT cookie before connection
// On connection:
//   - Join user to room: user:{userId}
//   - Handle: conversation:join, conversation:leave
//   - Handle: message:send → save to DB → emit message:new to room
//   - Handle: user:typing → emit to conversation room
//   - Handle: message:markRead → update DB → emit message:read
//   - Handle: disconnect → emit user:online status
```

---

## PHASE 4 — FRONTEND CORE

### Axios Instance (client/src/lib/axios.ts)
```typescript
// Base URL from VITE_API_URL
// withCredentials: true (send cookies)
// Request interceptor: nothing needed (cookies auto-sent)
// Response interceptor:
//   On 401: attempt refresh token call → retry original request
//   On refresh fail: dispatch logout action, redirect to /login
```

### Redux Store (client/src/store/)
```
store/index.ts          — configureStore combining all slices
store/authSlice.ts      — user, isAuthenticated, isLoading
store/uiSlice.ts        — authModal open/close, sidebar open/close
store/socketSlice.ts    — connected status
store/notificationSlice.ts — unread count
```

### TanStack Query (client/src/lib/queryClient.ts)
```typescript
// staleTime: 1000 * 60 * 5    (5 minutes)
// gcTime: 1000 * 60 * 10      (10 minutes)
// retry: 1
// refetchOnWindowFocus: false
```

### Socket Client (client/src/lib/socket.ts)
```typescript
// Create socket with withCredentials: true
// Do NOT auto-connect — connect only when user is authenticated
// Export connect(), disconnect(), socket instance
```

### React Router (client/src/routes.tsx)
```typescript
// Public routes (no auth): /, /search, /ads/:id, /login, /signup
// Protected routes (auth required): /dashboard/*, /messages, /notifications, /favorites, /profile, /settings
// Admin routes (SUPER_ADMIN only): /admin/*
// If unauthenticated user hits protected route → open AuthModal (not redirect)
// If non-admin hits admin route → redirect to /
```

---

## PHASE 5 — UI COMPONENTS

Build these in order. Each must match the design system exactly.

### Primitives (client/src/components/ui/)

**Button.tsx**
```
Variants: primary (gradient bg), secondary (white + border), ghost, danger
Sizes: sm, md, lg
States: loading (spinner), disabled
Always: button-radius (14px), Inter font, proper hover/active states
```

**Input.tsx**
```
Variants: default, error
Features: label, helper text, error message, left/right icon slot
Always: input-radius (16px), #FAFAFC bg, focus → gradient border glow
```

**Card.tsx**
```
Default: white bg, card-radius (20px), shadow-card, hover → shadow-card-hover + scale-[1.02]
Padding: 24px internal
```

**Badge.tsx**
```
Variants: success, warning, error, info, default
Always: badge-radius (9999px), label typography
```

**Modal.tsx**
```
Uses Radix Dialog
Backdrop: blur + dark overlay
Card: modal-radius (24px), shadow-modal
Animation: Framer Motion scale + fade entrance
Mobile: full-screen sheet
```

**Skeleton.tsx**
```
Animated shimmer effect (Tailwind animate-pulse)
Variants: card, text, avatar, row
```

**Toast.tsx**
```
Uses react-hot-toast with custom styling matching design system
Position: bottom-right
Types: success (#22C55E), error (#EF4444), info (#3B82F6)
Auto-dismiss: 4 seconds
```

### Layout Components (client/src/components/layout/)

**Header.tsx**
```
Height: 72px, sticky, white bg, 1px border-bottom, backdrop-blur on scroll
Left: GO logo (gradient text, bold Inter)
Center: search bar (pill shape, placeholder "Search for anything...")
Right: notifications icon, favorites icon, messages icon, Login btn (outlined), Signup btn (outlined), SELL NOW btn (gradient)
Mobile: hamburger menu, logo, sell button only
```

**Footer.tsx**
```
Dark bg (#111827), white text
4-column links + social icons
Copyright bar at bottom
```

**DashboardLayout.tsx**
```
Left sidebar (240px, white, border-right) + main content area
Sidebar: user avatar + name, nav items with active gradient state
Mobile: sidebar hidden, hamburger → slide-out drawer
```

**AdminLayout.tsx**
```
Left sidebar (240px, #111827 dark, white text) + main content
Sidebar nav: Dashboard, Users, Listings, Reports, Categories, Featured Ads
Active nav item: gradient background pill
```

### Shared Components (client/src/components/shared/)

**AdCard.tsx** — THE most important shared component, used everywhere
```
Image: 16:9 ratio, object-cover, card-radius top corners
Body: title (card-title), price (bold, gradient text), location (pin icon + text), posted date
Heart button: top-right, animated fill on click (optimistic update)
Featured badge: top-left, gradient bg, white text (conditional)
Verified badge: on seller avatar (conditional)
Hover: scale-[1.02], shadow-card-hover
Skeleton version: AdCardSkeleton.tsx
```

**CategoryCard.tsx**
```
Rounded square icon container (soft grey default, gradient on hover)
Icon (Lucide) + category name below
```

**AuthModal.tsx**
```
Triggered when unauthenticated user tries to: message, favorite, post ad
Radix Dialog
Tabs: Login | Sign Up
Compact versions of login/signup forms
On success: close modal, re-trigger the action
```

**EmptyState.tsx**
```
Props: icon, title, description, ctaLabel, ctaHref
Used for: no listings, no messages, no favorites, no notifications
```

---

## PHASE 6 — PAGES

For EVERY page:
1. Open `design-screens/{screen_name}/code.html` — study the layout
2. Look at `design-screens/{screen_name}/screen.png` — visual reference
3. Implement in React + Tailwind matching the design exactly
4. Use TanStack Query for data fetching
5. Use RTK for any global state interactions
6. Add skeleton loaders for all async sections
7. Add proper empty states
8. Ensure full mobile responsiveness

---

### PAGE: Home (client/src/pages/public/HomePage.tsx)

**Hero Section**
- Full-width gradient bg (brand-gradient), min-h-[520px] desktop, min-h-[380px] mobile
- Headline: "Find Anything Near You" — text-hero desktop, text-hero-sm mobile, text-white, font-bold
- Subheadline: white text, 85% opacity
- Search card: floating white card (card-radius, shadow-modal), 3 fields (keyword, location, category dropdown), gradient search button
- Trending searches: pill badges, white outline

```typescript
// Data: useQuery(['featuredAds'], fetchFeaturedAds)
// Data: useQuery(['categories'], fetchCategories)
// Data: useInfiniteQuery(['ads'], fetchAds) for latest ads section
```

**Categories Section**
- Grid: grid-cols-3 sm:grid-cols-4 lg:grid-cols-6
- 12 categories from API

**Featured Ads Section**
- 4-col grid desktop, horizontal scroll mobile
- AdCard with isFeatured=true shows gradient badge

**Latest Ads Section**
- 2-col mobile, 3-col tablet, 4-col desktop
- "Load More" button (or infinite scroll)

---

### PAGE: Search Results (client/src/pages/public/SearchPage.tsx)

```typescript
// URL params: ?q=&category=&city=&minPrice=&maxPrice=&condition=&sort=&page=
// useQuery(['search', params], fetchAds) — refetch on param change
// Filters update URL params → triggers re-query
```

- Left sidebar filters: 280px, hidden on mobile (toggle button)
- Price range: dual-handle slider
- Each filter change: update URL, invalidate query

---

### PAGE: Ad Detail (client/src/pages/public/AdDetailPage.tsx)

```typescript
// useQuery(['ad', id], fetchAdById)
// useMutation(startConversation) — on "Chat with Seller" click
//   If not authenticated → open AuthModal
//   If authenticated → create/get conversation → navigate to /messages?conv={id}
```

- Image gallery: main image + thumbnail strip, lightbox on click
- Seller card: sticky on desktop scroll
- View count: increment on mount (debounced API call)

---

### PAGE: Login (client/src/pages/public/LoginPage.tsx)

```typescript
// Split screen: left = gradient + GO branding, right = form
// Form: React Hook Form + Zod validation
// useMutation(loginUser) → on success: dispatch setUser to RTK → navigate to /dashboard
// Google OAuth button: <a href="/api/v1/auth/google"> (redirect flow)
```

---

### PAGE: Signup (client/src/pages/public/SignupPage.tsx)

```typescript
// Same split-screen as login
// useMutation(registerUser) → on success: show "Check your email" state
// Password strength indicator (4 levels: weak/fair/good/strong)
```

---

### PAGE: Dashboard Overview (client/src/pages/dashboard/DashboardPage.tsx)

```typescript
// useQuery(['dashboardStats'], fetchMyStats)
// Stats: activeAds, soldAds, totalViews, unreadMessages
```

---

### PAGE: Create Ad (client/src/pages/dashboard/CreateAdPage.tsx)

```typescript
// Multi-step wizard — local state manages currentStep (1-6)
// Progress bar: gradient fill, w-[{step/6 * 100}%]
// Step 3 (images): react-dropzone, max 10 files, preview grid, reorderable
// useMutation(createAd) → multipart/form-data → on success: navigate to /ads/{id}
```

---

### PAGE: My Ads (client/src/pages/dashboard/MyAdsPage.tsx)

```typescript
// Tabs: All / Active / Sold / Deactivated
// useQuery(['myAds', status], fetchMyAds)
// useMutation(updateAdStatus) with optimistic update
// useMutation(deleteAd) with confirmation modal
```

---

### PAGE: Messages (client/src/pages/dashboard/MessagesPage.tsx)

This is the most complex page. Build carefully.

```typescript
// Layout: flex, h-screen
// Left panel (340px): conversation list from useQuery
// Right panel: active conversation messages

// Socket events:
//   On mount: join conversation room
//   On message:new: add to messages list (optimistic or invalidate)
//   On user:typing: show typing indicator
//   On send: emit message:send AND useMutation(sendMessage) for persistence

// Media upload:
//   Image/video/audio: upload to Cloudinary via /api/v1/conversations/:id/messages
//   Voice note: MediaRecorder API → blob → upload same endpoint

// Message bubbles:
//   Sent: right, bg-brand-gradient, text-white
//   Received: left, bg-[#F1F1F5], text-text-primary
//   Image: inline preview, click to expand
//   Voice note: custom audio player (waveform bars + play/pause + duration)
```

---

### PAGE: Notifications (client/src/pages/dashboard/NotificationsPage.tsx)

```typescript
// useQuery(['notifications'], fetchNotifications)
// useMutation(markAllRead)
// Filter tabs: All / Unread / Messages / Updates
// RTK notificationSlice: decrement unreadCount when marking read
```

---

### PAGE: Admin Panel (client/src/pages/admin/)

**AdminDashboard.tsx**
```typescript
// useQuery(['adminStats'], fetchAdminStats)
// Charts using recharts: LineChart for users over time, BarChart for ads by category
// Recent activity feed
// Moderation queue (pending reports count with link)
```

**AdminUsersPage.tsx**
```typescript
// useQuery(['adminUsers', filters], fetchAllUsers)
// Search by name/email, filter by status
// Table: avatar, name, email, joined, total ads, status badge, actions
// useMutation(banUser) → confirm modal → optimistic update status badge
// useMutation(deleteUser) → confirm modal
// Pagination
```

**AdminReportsPage.tsx**
```typescript
// useQuery(['adminReports', filters], fetchAllReports)
// Filter tabs: All / Pending / Under Review / Resolved / Dismissed
// Table with expanded row design (report id, item, reporter, reason, priority, status, actions)
// "Review" click → opens right slide-in panel (Framer Motion x animation)
//   Panel: full report detail + action buttons (Remove Listing / Ban User / Dismiss)
// useMutation(updateReportStatus)
```

---

## PHASE 7 — POLISH

After all pages are built:

### Framer Motion Animations
```typescript
// Page transitions: wrap routes in AnimatePresence
// Standard page variant:
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

// Modal: scale(0.95) + opacity 0 → scale(1) + opacity 1
// Card hover: handled by Tailwind (hover:scale-[1.02] hover:shadow-card-hover)
// Sidebar slide: x: -240 → x: 0
// Report side panel: x: 420 → x: 0
```

### Mobile Audit Checklist
Go through every page and verify:
- [ ] Header collapses to hamburger
- [ ] All grids reflow correctly
- [ ] Modals are full-screen
- [ ] Touch targets minimum 44x44px
- [ ] Messages page is single-panel
- [ ] Admin tables have overflow-x-auto
- [ ] Dashboard sidebar is a drawer

### Final Quality Checks
- [ ] All API error states handled (network error, 404, 500 → friendly message)
- [ ] All loading states have skeletons
- [ ] All empty states have illustrations + CTA
- [ ] Toast notifications appear for: create ad, delete ad, send message, update profile, report submitted, admin actions
- [ ] Google OAuth flow completes end-to-end
- [ ] JWT refresh works silently on 401
- [ ] Socket reconnects on network recovery
- [ ] File uploads validate type and size client-side before API call
- [ ] Admin routes inaccessible to regular users (both frontend guard + backend middleware)

---

## QUICK REFERENCE — KEY COMMANDS

```bash
# Development
cd client && npm run dev       # Vite dev server → localhost:5173
cd server && npm run dev       # ts-node-dev → localhost:5000

# Database
cd server
npx prisma migrate dev         # Apply schema changes
npx prisma db seed             # Seed fake data
npx prisma studio              # Visual DB browser

# Generate Prisma client after schema change
npx prisma generate

# Build for production
cd client && npm run build
cd server && npm run build
```

---

## FIRST COMMAND TO RUN

Start here. Say this to Claude Code:

> "Read CLAUDE.md completely. Then begin Phase 1: initialize the monorepo, install all dependencies, configure Tailwind with the full design token system from CLAUDE.md, set up Prisma with the complete schema, run the migration, and seed the database. Do all of Phase 1 completely before stopping."

After Phase 1 is confirmed working, continue with Phase 2, then 3, and so on.
Never skip ahead. Never partially implement a phase.
