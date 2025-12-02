# Slooze Demo Script (3-5 minutes)

## Overview
This script demonstrates the key features of Slooze: RBAC, country scoping, order management, and payment processing.

## Prerequisites
- Application running locally (frontend: localhost:3000, backend: localhost:4000)
- Test accounts seeded in database

## Demo Flow

### 1. Login as Admin (30 seconds)
1. Navigate to http://localhost:3000/login
2. Login as Admin:
   - Email: `nick.fury@slooze.com`
   - Password: `password123`
3. **Highlight**: Admin can see all restaurants from all countries
4. Navigate to restaurants page - show restaurants from both India and America

### 2. Country Scoping - Manager View (45 seconds)
1. Logout and login as Manager (India):
   - Email: `captain.marvel@slooze.com`
   - Password: `password123`
2. **Highlight**: Manager only sees restaurants from India
3. Show restaurant list - only Indian restaurants visible
4. Try to access an American restaurant (if URL known) - should show "Restaurant not found"

### 3. Create Order as Member (60 seconds)
1. Logout and login as Member:
   - Email: `thanos@slooze.com`
   - Password: `password123`
2. Browse restaurants (India only)
3. Click on a restaurant
4. Add items to cart:
   - Select quantity
   - Click "Add to Cart"
5. Navigate to cart
6. **Highlight**: Member can create order but cannot checkout
7. Show checkout button is disabled or redirects (explain permission restriction)

### 4. Checkout as Manager (60 seconds)
1. Logout and login as Manager:
   - Email: `captain.marvel@slooze.com`
   - Password: `password123`
2. Create a new order:
   - Add items to cart
   - Go to checkout
3. **Highlight**: Manager can checkout orders
4. Select payment method
5. Complete checkout
6. Show order confirmation page

### 5. Order Management (45 seconds)
1. Navigate to Orders page
2. Show order list
3. Click on an order to view details
4. **Highlight**: Manager can cancel orders
5. Show cancel button (if order is cancellable)
6. Demonstrate cancel functionality

### 6. Admin Panel - Payment Methods (45 seconds)
1. Logout and login as Admin:
   - Email: `nick.fury@slooze.com`
   - Password: `password123`
2. Navigate to Admin Panel: `/admin/payment-methods`
3. **Highlight**: Only Admin can manage payment methods
4. Enter a user ID
5. Create a payment method for that user
6. Show payment methods list

### 7. API Documentation (30 seconds)
1. Navigate to http://localhost:4000/api/docs
2. Show Swagger UI
3. Demonstrate API endpoints
4. Show authentication requirements

## Key Points to Emphasize

1. **RBAC**: Different roles have different permissions
2. **Country Scoping**: Managers and Members are restricted to their country
3. **Admin Override**: Admin can access all data across countries
4. **Security**: JWT authentication, role-based access control
5. **Modern Stack**: Next.js 14, NestJS, Prisma, TypeScript

## Troubleshooting

- If login fails, ensure database is seeded
- If restaurants don't show, check country assignments
- If checkout fails, verify Stripe keys (or mock mode)
- Check browser console for errors

## Recording Tips

- Use screen recording software
- Show browser developer tools for API calls
- Highlight role changes clearly
- Pause to explain key concepts
- Keep demo under 5 minutes

