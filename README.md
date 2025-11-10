# E-commerce Platform Backend

Backend implementation of the CoreDev Interviews 2025 assessment. It exposes a REST API for authentication, product catalogue management, and order processing using Node.js and TypeScript.

---

## 1. Technology Choices

| Layer             | Stack / Library                              | Reason                                                                 |
| ----------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| Runtime           | Node.js 18 + TypeScript                       | Matches assessment requirement; type-safety improves maintainability    |
| HTTP Server       | Express 5                                     | Mature ecosystem, middleware support                                    |
| ORM / Database    | Prisma ORM + SQLite                           | Prisma gives schema-first modelling and migrations; SQLite simplifies local setup |
| Validation        | Zod                                           | Declarative schemas, reusable on routes and services                    |
| Auth / Security   | bcryptjs, jsonwebtoken                        | Industry-standard hashing and JWT handling                              |
| Caching           | In-memory cache utility                       | Satisfies bonus requirement for product listing caching                 |
| Testing           | Vitest + Supertest                            | Fast unit/integration tests with HTTP assertions                        |

---

## 2. Features Delivered (User Stories)

| #  | Title                  | Highlights                                                                                          |
| -- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| 1  | Signup                 | Validates username/email/password, ensures uniqueness, hashes password with bcrypt.                |
| 2  | Login                  | Validates credentials, issues JWT containing `userId`, `username`, `role`, `email`.               |
| 3  | Create Product         | Admin-only endpoint, validates payload, records creator, busts cache.                              |
| 4  | Update Product         | Admin-only, partial updates, reuses validation rules, busts cache.                                 |
| 5  | List Products          | Public; pagination, search by name, returns mandated response envelope, cached with TTL.           |
| 6  | Search Products        | Implements case-insensitive substring search via query parameter.                                   |
| 7  | Product Details        | Public; fetches by UUID, returns complete product object.                                           |
| 8  | Delete Product         | Admin-only; validates existence, deletes, invalidates cache.                                        |
| 9  | Place Order            | User-only; wraps operations in transaction, verifies stock, decrements inventory, calculates totals.|
| 10 | View My Orders         | User-only; returns orders scoped to authenticated user.                                             |

Every response conforms to the required shape (`Success`, `Message`, `Object`, `Errors`, etc.).

---

## 3. Data Model (Prisma)

- **User**: `id`, `username`, `email`, `password`, `role`, timestamps.
- **Product**: `id`, `name`, `description`, `price (Decimal)`, `stock`, `category`, optional `createdBy`.
- **Order**: `id`, `userId`, `description`, `totalPrice`, `status`, timestamps.
- **OrderItem**: Joins orders/products; stores `quantity` and `unitPrice`.

Enums: `UserRole (ADMIN/USER)`, `OrderStatus`.

---

## 4. Architecture & Flow

```
Request → Express Router → Controller → Service → Repository (Prisma) → Database
                     ↓
           Middleware (auth, validation, errors)
```

- **Controllers** orchestrate request/response.
- **Services** hold business rules (e.g. stock checks, caching, JWT creation).
- **Repositories** encapsulate Prisma data access.
- **Middlewares** handle authentication/authorization, schema validation, and centralized error reporting.
- **Utils** contain shared helpers (logging, response builders, cache).

---

## 5. Step-by-Step Setup

1. **Clone & install dependencies**
   ```bash
   git clone https://github.com/Telesphore-Uwabera/CoreDev_A2SV.git
   cd CoreDev_A2SV/backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env   # provided template (or create manually)
   ```
   Required variables:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="supersecret"
   JWT_EXPIRES_IN="1h"
   BCRYPT_SALT_ROUNDS="10"
   CACHE_TTL_SECONDS="60"
   PORT=3000
   NODE_ENV=development
   ```

3. **Apply database migrations & generate Prisma client**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the API in development**
   ```bash
   npm run dev
   ```
   Server starts on `http://localhost:3000`. Health check available at `/health`.

5. **Build for production**
   ```bash
   npm run build   # outputs compiled JS to /dist
   npm start       # runs dist/server.js
   ```

6. **Run automated tests**
   ```bash
   npm test
   ```

---

## 6. API Endpoints

### Authentication
| Method | Path               | Description              | Auth |
| ------ | ------------------ | ------------------------ | ---- |
| POST   | `/api/auth/register` | Register new user       | No   |
| POST   | `/api/auth/login`    | Obtain JWT              | No   |

### Products
| Method | Path                      | Description                              | Auth      |
| ------ | ------------------------- | ---------------------------------------- | --------- |
| GET    | `/api/products`           | List products (pagination + search)       | Public    |
| GET    | `/api/products/:id`       | Get product by ID                         | Public    |
| POST   | `/api/products`           | Create product                            | Admin JWT |
| PUT    | `/api/products/:id`       | Update product                            | Admin JWT |
| DELETE | `/api/products/:id`       | Delete product                            | Admin JWT |

Query params for listing:
`page` (default 1), `pageSize` (default 10), `search` (optional substring).

### Orders
| Method | Path             | Description               | Auth      |
| ------ | ---------------- | ------------------------- | --------- |
| POST   | `/api/orders`    | Place order               | User JWT  |
| GET    | `/api/orders`    | View authenticated orders | User JWT  |

Order request example:
```json
{
  "description": "Weekly groceries",
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

---

## 7. Validation & Error Handling

- **Zod schemas** enforce payload shape for body/query/params.
- `validateRequest` middleware attaches parsed data to `req.validated`.
- `authenticate` middleware checks for `Bearer` token, loads user, and injects `req.user`.
- `authorizeRoles` ensures only specified roles access protected routes.
- Central `errorHandler` converts thrown `AppError`/Zod errors to standardized responses and logs diagnostics.

---

## 8. Caching Strategy

Product listing responses are cached per `(page, pageSize, search)` key using a simple in-memory cache with configurable TTL (`CACHE_TTL_SECONDS`). Mutating operations (create/update/delete product) invalidate cache entries via prefix clearing. This satisfies the “Implement caching for the product listing endpoint” bonus requirement.

---

## 9. Testing Methodology

- **Tooling**: Vitest (test runner + assertions) and Supertest (HTTP client).
- **Approach**:
  - Controllers are exercised via real Express app (`src/app.ts`) to verify middleware chains, routing, response envelopes, and status codes.
  - Prisma repositories/services are mocked within tests to avoid touching the real database, keeping tests deterministic and fast.
  - Authentication middleware detects `NODE_ENV=test` and trusts JWT payloads for simplified role simulation.
- **Coverage**:
  - `tests/auth.test.ts`: registration/login success & failure paths.
  - `tests/product.test.ts`: listing, detail fetch, admin create, non-admin restriction.
  - `tests/order.test.ts`: order creation workflow and history retrieval.
- **Execution**:
  ```bash
  npm test           # single run
  npm test -- --run  # CI-friendly run without watch
  ```

---

## 10. Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app initialization
│   ├── server.ts                 # HTTP bootstrap
│   ├── config/                   # env + Prisma client
│   ├── controllers/              # route handlers
│   ├── services/                 # business logic
│   ├── repositories/             # Prisma data access
│   ├── middlewares/              # auth, validation, errors
│   ├── validators/               # Zod schemas
│   ├── utils/                    # response helpers, cache, logger
│   └── routes/                   # modular routers
├── prisma/                       # schema & migrations
├── tests/                        # Vitest suites
├── dist/                         # compiled JS after `npm run build`
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 11. Remaining Improvements

- API documentation (e.g., OpenAPI/Swagger).
- Product image upload support.
- Advanced filtering (price range, category).
- Rate limiting / security hardening.
- Deployment automation (Docker, CI/CD pipeline).

---

## 12. Submission Repo Link

Repository: [`Telesphore-Uwabera/CoreDev_A2SV`](https://github.com/Telesphore-Uwabera/CoreDev_A2SV)    

--- 
