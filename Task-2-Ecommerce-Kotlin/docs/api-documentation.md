# 📡 REST API Documentation — ShopSphere

All endpoints run on `http://localhost:3001` (or `http://10.0.2.2:3001` on Android emulator).
Interactive Swagger documentation is available at `http://localhost:3001/api/docs`.

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Create buyer/seller account.
- `POST /api/auth/login`: Authenticate and receive JWT access + refresh tokens.
- `POST /api/auth/refresh`: Exchange refresh token for new access token.
- `POST /api/auth/forgot-password`: Initiate password reset flow.

## 2. Categories & Products (`/api/categories`, `/api/products`)
- `GET /api/categories`: List all categories with product counts.
- `GET /api/products`: Filter products by category, search query, featured flag, or price sorting.
- `GET /api/products/:id`: Fetch comprehensive product details with seller info.
- `POST /api/products`: Publish a new listing (authenticated seller).
- `DELETE /api/products/:id`: Remove listing (enforces owner/admin check).

## 3. Cart & Orders (`/api/cart`, `/api/orders`)
- `GET /api/cart`: Retrieve cart with authoritative totals and delivery fee.
- `POST /api/cart/items`: Add product to cart with server-side stock validation.
- `PATCH /api/cart/items/:id`: Update item quantity.
- `DELETE /api/cart/items/:id`: Remove item from cart.
- `POST /api/orders`: Place order with transaction-based stock deduction.
- `GET /api/orders`: List orders placed by current authenticated user.
- `POST /api/orders/:id/cancel`: Cancel order and restore stock.

## 4. Payment Gateway Sandbox (`/api/payments`)
- `POST /api/payments/process`: Simulate payment outcomes (`SUCCESS`, `FAILED`, `CANCELLED`).
