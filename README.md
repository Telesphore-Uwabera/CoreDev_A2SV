# E-commerce Platform Backend

This project implements the REST API for an e-commerce platform, covering authentication, product management, and order handling as described in the A2SV backend assessment.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM (SQLite for local development)
- Zod for validation
- JWT authentication (jsonwebtoken)
- Vitest + Supertest for tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory. An example configuration:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="1h"
BCRYPT_SALT_ROUNDS="10"
CACHE_TTL_SECONDS="60"
```

### Database Setup

Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Development

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default. Key endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products` (pagination + search)
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders` (user)
- `GET /api/orders` (user)

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

The tests mock database calls and exercise the HTTP layer with Supertest.

## Project Structure

```
backend/
├── src/
│   ├── config/        # env/bootstrap + Prisma client
│   ├── controllers/   # route handlers
│   ├── middlewares/
│   ├── repositories/  # data access layer
│   ├── services/      # business logic
│   ├── utils/
│   ├── validators/    # Zod schemas
│   └── routes/
├── prisma/            # Prisma schema & migrations
├── tests/             # Vitest + Supertest suites
└── ...
```

## Notes

- Product listing responses are cached in-memory for `CACHE_TTL_SECONDS`.
- Passwords are hashed with bcrypt before storage.
- Order creation runs inside a Prisma transaction and validates stock levels.
- In test mode (`NODE_ENV=test`), the authentication middleware trusts JWT payloads to simplify mocking.

