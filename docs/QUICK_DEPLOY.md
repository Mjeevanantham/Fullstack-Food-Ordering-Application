# Quick Deployment Guide

## Frontend → Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Repository**: Select `Mjeevanantham/Fullstack-Food-Ordering-Application`
3. **Configure**:
   - Framework: Next.js (auto)
   - Root Directory: `apps/frontend`
   - Build Command: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @slooze/frontend build`
   - Output Directory: `.next`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://slooze-backend.onrender.com/api
   NEXT_PUBLIC_STRIPE_KEY=pk_test_...
   ```
5. **Deploy** → Done! 🎉

## Backend → Render (10 minutes)

### Create Database First

1. **Render Dashboard** → "New +" → "PostgreSQL"
2. Name: `slooze-db`
3. Plan: Free
4. **Create** → Copy connection string

### Deploy Backend

1. **Render Dashboard** → "New +" → "Web Service"
2. **Connect GitHub** → Select repository
3. **Configure**:
   - Name: `slooze-backend`
   - Environment: Node
   - Root Directory: `apps/backend`
   - Build Command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/backend && pnpm prisma:generate && pnpm build`
   - Start Command: `cd apps/backend && pnpm prisma:migrate:deploy && node dist/main.js`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=<from-database-above>
   JWT_SECRET=<generate-random-32-chars>
   JWT_REFRESH_SECRET=<generate-random-32-chars>
   STRIPE_SECRET_KEY=sk_test_...
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. **Link Database**: Click "Link Resource" → Select `slooze-db`
6. **Create Web Service** → Wait for deploy

### Seed Database

1. Render → Your service → "Shell"
2. Run:
   ```bash
   cd apps/backend
   pnpm prisma:migrate:deploy
   pnpm prisma:seed
   ```

### Update Frontend URL

1. Go back to Vercel
2. Update `NEXT_PUBLIC_API_URL` with your Render URL
3. Redeploy

## Done! ✅

Your app is live:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://slooze-backend.onrender.com/api`

