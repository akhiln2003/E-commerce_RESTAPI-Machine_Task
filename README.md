# ShopHub E-commerce REST API

ShopHub is a full-stack e-commerce application with a React/Vite client and an Express/MongoDB API. It supports JWT authentication, role-protected administration, nested categories, product management, and transactional order processing.

## Features

### Customer

- Sign up and sign in with HTTP-only access and refresh-token cookies
- Protected welcoming home page at `/`
- Browse active products
- Search by product name, SKU, or description
- Filter by category, including products in nested child categories
- Filter by minimum and maximum price
- Sort by newest, price, or name
- Paginate product results
- Build an order and adjust quantities before confirmation
- View only the authenticated customer's orders
- View the authenticated profile

### Admin

- Protected admin routes based on the verified JWT role claim
- Create, update, list, and delete nested categories
- View the complete category hierarchy
- Create, update, list, and delete products
- Manage product status, stock, price, sale price, SKU, and category
- View all customer orders
- Update order status through the allowed workflow
- Block and unblock customer accounts

## Project structure

```text
client/  React, Vite, Redux Toolkit, RTK Query, Tailwind CSS
server/  Express, TypeScript, MongoDB, Mongoose, Zod
```

## Requirements

- Node.js 20+
- npm
- MongoDB. Order creation uses MongoDB transactions, so use MongoDB Atlas or a local replica set.

## Configuration

### Server

```bash
cd server
cp .env.example .env
```

Set the values in `server/.env`:

| Variable             | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `NODE_ENV`           | `development`, `test`, or `production`               |
| `PORT`               | API port, normally `5000`                            |
| `CLIENT_ORIGIN`      | Client origin used by CORS                           |
| `MONGODB_URI`        | MongoDB connection string                            |
| `JWT_ACCESS_SECRET`  | Access-token signing secret, at least 32 characters  |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret, at least 32 characters |

Never commit `.env` files or real secrets.

### Local admin account

The server can create or update an admin account automatically during startup when
the admin variables are configured. Add the following values to your local
`server/.env` file:

```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=@10admin
```

Use the password supplied separately for your local development account in place
of `replace-with-your-local-admin-password`. Do not add the real password to this
README, `.env.example`, source code, or any committed file.

### Client

```bash
cd client
cp .env.example .env
```

Set:

```env
VITE_SERVER_API_URL=http://localhost:5000/api
```

## Installation and development

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Start the API:

```bash
cd server
npm run dev
```

Start the client in a second terminal:

```bash
cd client
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Production builds

```bash
cd server
npm run build
npm start
```

```bash
cd client
npm run build
npm run preview
```

## API overview

### Authentication

```text
POST /api/auth/sign-up
POST /api/auth/sign-in
POST /api/auth/sign-out
POST /api/auth/token-gen
GET  /api/auth/profile
```

### Categories

```text
GET    /api/categories/tree
POST   /api/admin/categories
GET    /api/admin/categories
GET    /api/admin/categories/tree
PATCH  /api/admin/categories/:categoryId
DELETE /api/admin/categories/:categoryId
```

Category administration requires a verified access token with the `admin` role. Category input and route parameters are validated with Zod. Circular parent relationships and deletion of categories with children are rejected.

### Products

```text
GET    /api/products
POST   /api/admin/products
GET    /api/admin/products
PATCH  /api/admin/products/:productId
DELETE /api/admin/products/:productId
```

Product listing supports `search`, `categoryId`, `minPrice`, `maxPrice`, `sort`, `page`, and `limit`.

### Orders

```text
POST  /api/orders
GET   /api/orders/mine
GET   /api/orders/admin
PATCH /api/orders/admin/:orderId/status
```

The customer order listing accepts `page` and `limit` query parameters. The customer interface requests five orders per page. Order totals and prices are calculated on the server. Product availability and stock are checked in a MongoDB transaction before stock is reduced and the order is created.

Allowed status flow:

```text
pending -> confirmed -> processing -> shipped -> delivered
pending -> cancelled
confirmed -> cancelled
processing -> cancelled
```

## Quality checks

Run the server checks:

```bash
cd server
npm run build
npm run lint
```

Run the client build:

```bash
cd client
npm run build
```


