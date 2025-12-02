# Deployment Guide

This guide covers deploying the Slooze application to production.

## Architecture

- **Frontend**: Vercel (Next.js 14)
- **Backend**: Render (NestJS)
- **Database**: Render PostgreSQL

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Stripe account (for test keys)

## Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `Mjeevanantham/Fullstack-Food-Ordering-Application`
4. Vercel will auto-detect Next.js

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `apps/frontend`

**Build Command**: 
```bash
cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @slooze/frontend build
```

**Output Directory**: `.next` (default)

**Install Command**:
```bash
cd ../.. && pnpm install --frozen-lockfile
```

### Step 3: Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key
```

**Note**: Replace `your-backend-url` with your actual Render backend URL (you'll get this after backend deployment).

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your frontend will be live at `https://your-project.vercel.app`

## Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `slooze-db`
   - **Database**: `slooze`
   - **User**: `slooze`
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. **Save the connection string** - you'll need it

### Step 2: Create Web Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:

**Name**: `slooze-backend`

**Environment**: `Node`

**Region**: Choose closest to your users

**Branch**: `feat/complete-slooze-implementation` (or `main` after merge)

**Root Directory**: `apps/backend`

**Build Command**:
```bash
cd ../.. && pnpm install --frozen-lockfile && cd apps/backend && pnpm prisma:generate && pnpm build
```

**Start Command**:
```bash
cd apps/backend && pnpm prisma:migrate:deploy && node dist/main.js
```

### Step 3: Set Environment Variables

In Render service settings → Environment, add:

```
NODE_ENV=production
DATABASE_URL=<your-postgres-connection-string>
JWT_SECRET=<generate-a-strong-secret>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PORT=10000
```

**Generate secrets**:
```bash
# Generate JWT secrets (run locally)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Link Database

1. In your web service settings
2. Go to "Environment" tab
3. Click "Link Resource"
4. Select your `slooze-db` database
5. Render will automatically add `DATABASE_URL`

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will:
   - Install dependencies
   - Build the application
   - Run migrations
   - Start the server
3. Your backend will be live at `https://slooze-backend.onrender.com`

### Step 6: Run Database Migrations

After first deployment, run migrations:

1. Go to your Render service
2. Open "Shell" tab
3. Run:
```bash
cd apps/backend
pnpm prisma:migrate:deploy
pnpm prisma:seed
```

## Post-Deployment Steps

### 1. Update Frontend Environment Variables

After backend is deployed, update Vercel environment variables:

```
NEXT_PUBLIC_API_URL=https://slooze-backend.onrender.com/api
```

Redeploy frontend to pick up the new URL.

### 2. Verify Deployment

**Backend Health Check**:
```bash
curl https://slooze-backend.onrender.com/api/docs
```

**Frontend**:
Visit your Vercel URL and test login.

### 3. Database Seeding

Seed the database with test data:

1. Connect to Render shell
2. Run:
```bash
cd apps/backend
pnpm prisma:seed
```

## Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://slooze-backend.onrender.com/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

### Backend (Render)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_...
PORT=10000
```

## Troubleshooting

### Backend Issues

**Database Connection Failed**:
- Verify `DATABASE_URL` is correct
- Check database is running in Render
- Ensure database is linked to web service

**Build Fails**:
- Check build logs in Render
- Verify `pnpm-lock.yaml` exists
- Ensure all dependencies are in `package.json`

**Migrations Fail**:
- Run migrations manually in Render shell
- Check database permissions

### Frontend Issues

**API Calls Fail**:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

**Build Fails**:
- Check Vercel build logs
- Verify root directory is `apps/frontend`
- Ensure build command includes monorepo setup

## Production Checklist

- [ ] Database created and linked
- [ ] Environment variables set in both Vercel and Render
- [ ] Backend deployed and accessible
- [ ] Database migrations run
- [ ] Database seeded with test data
- [ ] Frontend deployed with correct API URL
- [ ] CORS configured in backend for frontend domain
- [ ] Stripe keys configured (test mode)
- [ ] Health checks passing
- [ ] Test login flow works

## Cost Estimation

**Free Tier**:
- Vercel: Free (with limitations)
- Render Web Service: Free (spins down after inactivity)
- Render PostgreSQL: Free (limited to 90 days, then $7/month)

**Recommended for Production**:
- Vercel Pro: $20/month
- Render Web Service: $7/month
- Render PostgreSQL: $7/month

## Security Notes

1. **Never commit secrets** - Use environment variables
2. **Use strong JWT secrets** - Generate random 32+ character strings
3. **Enable HTTPS** - Both Vercel and Render provide this automatically
4. **Set up monitoring** - Use Render logs and Vercel analytics
5. **Regular backups** - Render PostgreSQL has automatic backups on paid plans

## Next Steps

After deployment:
1. Test all features end-to-end
2. Set up monitoring and alerts
3. Configure custom domains (optional)
4. Set up CI/CD for automatic deployments
5. Configure production Stripe keys (when ready)

