# GO Marketplace

> Buy. Sell. Connect.

A production-grade classified ads marketplace — OLX-level functionality, Airbnb-level polish.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| State | Redux Toolkit, TanStack Query v5 |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase), Prisma ORM |
| Auth | JWT (httpOnly cookies), Google OAuth 2.0 |
| Real-time | Socket.io |
| Media | Cloudinary |
| Email | Resend |

## Quick Start

```bash
# Install root deps
npm install

# Install all deps
cd client && npm install
cd ../server && npm install

# Set up environment
cp server/.env.example server/.env
# Fill in server/.env with your credentials

# Database
cd server
npx prisma migrate dev
npx prisma db seed

# Run both servers
cd ..
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000  
Prisma Studio: `npm run db:studio`
