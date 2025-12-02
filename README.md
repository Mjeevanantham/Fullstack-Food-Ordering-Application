# Fullstack-Food-Ordering-Application
# Slooze — Fullstack Food Ordering Application

A complete fullstack food ordering application with Role-Based Access Control (RBAC) and country-scoped data access.

## 🚀 Features

- **RBAC System**: ADMIN, MANAGER, and MEMBER roles with granular permissions
- **Country Scoping**: Managers and Members restricted to their country's data (bonus feature)
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Stripe Integration**: Payment processing simulation in test mode
- **Modern UI/UX**: Responsive design with dark mode support
- **Comprehensive Testing**: Unit and E2E tests
- **CI/CD Pipeline**: Automated testing and deployment

## 📋 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Headless UI / Radix UI
- Zod for validation
- Framer Motion for animations

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport JWT
- CASL for ability management
- Stripe SDK (test mode)

### Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- PostgreSQL database

## 🏗️ Architecture

```
slooze/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js App
├── prisma/               # Prisma schema & migrations
├── docs/                 # Documentation & diagrams
└── .github/workflows/    # CI/CD pipelines
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Slooze
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` in both `apps/backend` and `apps/frontend`:
   
   **Backend** (`apps/backend/.env`):
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slooze
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
   NODE_ENV=development
   PORT=4000
   ```
   
   **Frontend** (`apps/frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_test_key
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d db
   ```

5. **Run database migrations and seed**
   ```bash
   cd apps/backend
   pnpm prisma:migrate:dev
   pnpm prisma:seed
   ```

6. **Start the development servers**
   
   In separate terminals:
   
   ```bash
   # Backend
   cd apps/backend
   pnpm start:dev
   
   # Frontend
   cd apps/frontend
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - API Docs: http://localhost:4000/api/docs
   - pgAdmin: http://localhost:5050 (admin@slooze.com / admin)

## 👥 Test Accounts

The seed script creates the following test users (password: `password123`):

- **Admin**: `nick.fury@slooze.com` (ADMIN role, no country restriction)
- **Manager (India)**: `captain.marvel@slooze.com` (MANAGER role, India)
- **Manager (America)**: `captain.america@slooze.com` (MANAGER role, America)
- **Member (India)**: `thanos@slooze.com` (MEMBER role, India)
- **Member (America)**: `thor@slooze.com` (MEMBER role, America)
- **Member (America)**: `travis@slooze.com` (MEMBER role, America)

## 🔐 RBAC Permissions

### ADMIN
- ✅ View restaurants & menu (all countries)
- ✅ Create order
- ✅ Checkout & pay
- ✅ Cancel order
- ✅ Update payment methods (all users)

### MANAGER
- ✅ View restaurants & menu (own country only)
- ✅ Create order
- ✅ Checkout & pay
- ✅ Cancel order
- ❌ Update payment methods

### MEMBER
- ✅ View restaurants & menu (own country only)
- ✅ Create order
- ❌ Checkout & pay
- ❌ Cancel order
- ❌ Update payment methods

## 📡 API Endpoints

Base URL: `http://localhost:4000/api`

### Authentication
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token

### Restaurants
- `GET /restaurants` - List restaurants (with pagination, search, country filter)
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/:id/menu` - Get restaurant menu items

### Orders
- `POST /orders` - Create a new order
- `GET /orders` - List orders (scoped by role)
- `GET /orders/:id` - Get order details
- `POST /orders/:id/checkout` - Checkout order (ADMIN/MANAGER only)
- `POST /orders/:id/cancel` - Cancel order (ADMIN/MANAGER only)

### Payment Methods
- `GET /users/:id/payment-methods` - List payment methods
- `POST /users/:id/payment-methods` - Add payment method (ADMIN only for others)

### Countries
- `GET /countries` - List all countries
- `GET /countries/:id` - Get country details

See `docs/postman.json` for a complete API collection.

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
pnpm test:cov          # Coverage report
```

### Frontend Tests
```bash
cd apps/frontend
pnpm test              # Component tests
pnpm test:coverage     # Coverage report
```

## 🐳 Docker

### Development
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- pgAdmin on port 5050

### Production Build
```bash
# Build backend
docker build -f apps/backend/Dockerfile -t slooze-backend .

# Build frontend
docker build -f apps/frontend/Dockerfile -t slooze-frontend .
```

## 🚢 Deployment

### Quick Deploy Guide

See [QUICK_DEPLOY.md](docs/QUICK_DEPLOY.md) for step-by-step instructions.

### Frontend → Vercel

1. **Connect Repository**: [Vercel Dashboard](https://vercel.com/new) → Import repository
2. **Configure**: Root Directory: `apps/frontend` (auto-detected from `vercel.json`)
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_STRIPE_KEY=pk_test_...`
4. **Deploy** → Frontend live!

### Backend → Render

1. **Create Database**: Render → "New +" → PostgreSQL → Name: `slooze-db`
2. **Create Web Service**: Render → "New +" → Web Service → Connect repo
3. **Configure**: Root Directory: `apps/backend` (see `render.yaml` for full config)
4. **Environment Variables**: Set `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.
5. **Link Database** → Deploy → Seed database

**Detailed instructions**: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📚 Documentation

- [API Collection](docs/postman.json) - Postman/Thunder Client collection
- [Demo Script](docs/demo-script.md) - 3-5 minute demo flow
- [Contributing](CONTRIBUTING.md) - Development guidelines
- [Security](SECURITY.md) - Security policy

## 🛠️ Development

### Project Structure

```
apps/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── restaurants/   # Restaurants module
│   │   ├── orders/        # Orders module
│   │   ├── payments/      # Payments module
│   │   ├── countries/     # Countries module
│   │   └── common/        # Shared utilities
│   └── test/              # E2E tests
└── frontend/
    ├── app/               # Next.js App Router pages
    ├── components/        # React components
    ├── lib/               # Utilities & API client
    └── hooks/             # Custom React hooks
```

### Scripts

**Root**
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all apps

**Backend**
- `pnpm start:dev` - Start development server
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate:dev` - Run migrations
- `pnpm prisma:seed` - Seed database

**Frontend**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## 🔒 Security

- JWT tokens with secure expiration
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention (Prisma)

## 📝 License

This project is part of a take-home assignment.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability and maintainability.
