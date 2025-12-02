# Deployment Checklist

Follow this checklist to deploy Slooze to production.

## Prerequisites

- [ ] GitHub repository pushed
- [ ] Vercel account created
- [ ] Render account created
- [ ] Stripe test keys ready

## Step 1: Deploy Backend to Render

### 1.1 Create PostgreSQL Database

- [ ] Go to Render Dashboard → "New +" → "PostgreSQL"
- [ ] Name: `slooze-db`
- [ ] Database: `slooze`
- [ ] User: `slooze`
- [ ] Plan: Free (or paid)
- [ ] **Copy the connection string** (Internal Database URL)

### 1.2 Create Web Service

- [ ] Render Dashboard → "New +" → "Web Service"
- [ ] Connect GitHub: `Mjeevanantham/Fullstack-Food-Ordering-Application`
- [ ] Name: `slooze-backend`
- [ ] Environment: `Node`
- [ ] Region: Choose closest
- [ ] Branch: `feat/complete-slooze-implementation` (or `main` after merge)
- [ ] Root Directory: `apps/backend`

### 1.3 Configure Build & Start Commands

**Build Command**:
```bash
cd ../.. && corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && cd apps/backend && pnpm prisma:generate && pnpm build
```

**Start Command**:
```bash
cd apps/backend && pnpm prisma:migrate:deploy && node dist/main.js
```

### 1.4 Set Environment Variables

In Render → Environment tab, add:

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `<from-database-connection-string>`
- [ ] `JWT_SECRET` = `<generate-random-32-chars>`
- [ ] `JWT_REFRESH_SECRET` = `<generate-random-32-chars>`
- [ ] `JWT_EXPIRATION` = `15m`
- [ ] `JWT_REFRESH_EXPIRATION` = `7d`
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...`
- [ ] `PORT` = `10000`
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app` (update after frontend deploy)

**Generate secrets**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.5 Link Database

- [ ] In web service → Environment → "Link Resource"
- [ ] Select `slooze-db`
- [ ] Render will auto-add `DATABASE_URL`

### 1.6 Deploy

- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~5-10 minutes)
- [ ] **Copy your backend URL**: `https://slooze-backend.onrender.com`

### 1.7 Seed Database

- [ ] Render → Your service → "Shell" tab
- [ ] Run:
  ```bash
  cd apps/backend
  pnpm prisma:migrate:deploy
  pnpm prisma:seed
  ```

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Project

- [ ] Go to [Vercel Dashboard](https://vercel.com/new)
- [ ] "Import Project" → Select `Mjeevanantham/Fullstack-Food-Ordering-Application`
- [ ] Vercel will auto-detect Next.js

### 2.2 Configure Project

- [ ] Framework Preset: `Next.js` (auto)
- [ ] Root Directory: `apps/frontend` (important!)
- [ ] Build Command: (auto from `vercel.json`)
- [ ] Output Directory: `.next` (auto)

### 2.3 Set Environment Variables

- [ ] `NEXT_PUBLIC_API_URL` = `https://slooze-backend.onrender.com/api`
- [ ] `NEXT_PUBLIC_STRIPE_KEY` = `pk_test_...`

### 2.4 Deploy

- [ ] Click "Deploy"
- [ ] Wait for build (~3-5 minutes)
- [ ] **Copy your frontend URL**: `https://your-project.vercel.app`

## Step 3: Update Backend CORS

- [ ] Go back to Render → Your backend service
- [ ] Environment → Update `FRONTEND_URL` = `https://your-project.vercel.app`
- [ ] Render will auto-redeploy

## Step 4: Verify Deployment

### Backend Health Check

- [ ] Visit: `https://slooze-backend.onrender.com/api/docs`
- [ ] Should see Swagger UI

### Frontend Check

- [ ] Visit: `https://your-project.vercel.app`
- [ ] Should redirect to `/restaurants` or `/login`
- [ ] Test login with: `nick.fury@slooze.com` / `password123`

### Test Flow

- [ ] Login as admin
- [ ] Browse restaurants
- [ ] Add items to cart
- [ ] Create order
- [ ] Checkout (should work for admin/manager)

## Troubleshooting

### Backend Won't Start

- Check Render logs
- Verify `DATABASE_URL` is correct
- Ensure migrations ran successfully
- Check `PORT` is set to `10000`

### Frontend Can't Connect to Backend

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (visit `/api/docs`)
- Verify CORS is configured in backend
- Check browser console for errors

### Database Connection Issues

- Verify database is linked in Render
- Check `DATABASE_URL` format
- Ensure database is running (Render dashboard)

## Post-Deployment

- [ ] Update README with production URLs
- [ ] Test all user roles (admin, manager, member)
- [ ] Verify country scoping works
- [ ] Test payment flow (Stripe test mode)
- [ ] Monitor Render logs for errors
- [ ] Set up Vercel analytics (optional)

## URLs to Save

- Frontend: `https://your-project.vercel.app`
- Backend API: `https://slooze-backend.onrender.com/api`
- API Docs: `https://slooze-backend.onrender.com/api/docs`

## Cost

**Free Tier**:
- Vercel: Free (with limitations)
- Render Web: Free (spins down after inactivity)
- Render DB: Free (90 days, then $7/month)

**Total**: $0/month (free tier) or $14/month (paid)

