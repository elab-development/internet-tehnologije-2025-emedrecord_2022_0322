# eMedRecord

eMedRecord is a full-stack medical records and appointment management app built with Next.js, Prisma, PostgreSQL, and Clerk authentication.

## Tech Stack

- Next.js (App Router) + TypeScript
- Prisma ORM + PostgreSQL (Neon compatible)
- Clerk authentication
- Tailwind CSS
- Vitest + Playwright for automated testing

## Prerequisites

Before running the project, install:

- Node.js 20+
- npm 10+
- PostgreSQL database (local or Neon)
- Clerk account and API keys

## 1) Clone and install

```bash
git clone https://github.com/dpopoviic/emedrecord_app.git
cd internet-tehnologije-2025-emedrecord_2022_0322
npm install
```

If PowerShell blocks `npm` scripts on Windows, use `npm.cmd` instead.

## 2) Environment setup

Create a file named `.env` in the project root (same level as `package.json`).

You can copy from `.env.example` (recommended):

```bash
cp .env.example .env
# Windows (PowerShell / CMD)
copy .env.example .env
```

Then fill in real values.

### Required `.env` values

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key"
CLERK_SECRET_KEY="sk_test_your_key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

DATABASE_URL="postgresql://neondb_owner:npg_m0v9cNQFMlLu@ep-purple-band-ag9lp5pp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"


## 3) Database setup (development)

Run Prisma generation and migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Optional seed:

```bash
npx prisma db seed
```

## 4) Run the application

Development:

```bash
npm run dev
```

Open http://localhost:3000

Production build locally:

```bash
npm run build
npm run start
```

## 5) Automated tests

The project includes three layers of tests:

- Unit tests (`test:unit`) for isolated core logic
- Integration tests (`test:integration`) with a real test database
- E2E smoke tests (`test:e2e`) in browser via Playwright

### 5.1 Create `.env.test`

Create `.env.test` in the project root:

```bash
cp .env.test.example .env.test
# Windows (PowerShell / CMD)
copy .env.test.example .env.test
```

Set at minimum:

DATABASE_URL="postgresql://neondb_owner:npg_m0v9cNQFMlLu@ep-rapid-snow-agwsyk32-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Important:
- `.env.test` must point to a **separate test database/branch**, never your dev DB.
- If you use Neon, create a dedicated test branch/database and use its connection string.

### 5.2 Prepare test database

```bash
npm run test:db:migrate
```

Optional reset:

```bash
npm run test:db:reset
```

Optional test seed:

```bash
npm run test:db:seed
```

### 5.3 Run tests

Unit tests:

```bash
npm run test:unit
```

Integration tests:

```bash
npm run test:integration
```

Install Playwright browser once:

```bash
npm run test:e2e:install
```

Run E2E smoke tests:

```bash
npm run test:e2e
```

E2E UI mode:

```bash
npm run test:e2e:ui
```

### One-shot verification order

```bash
npm run test:db:migrate
npm run test:unit
npm run test:integration
npm run test:e2e:install
npm run test:e2e
```

## What each test type validates

### Unit tests
- Fast checks of isolated logic (security sanitization, CSRF checks, authorization branches).
- Purpose: detect regressions early without DB/browser overhead.

### Integration tests
- Real Prisma + PostgreSQL checks for permission rules and data relations.
- Purpose: verify business rules work against real persisted data.

### E2E smoke tests
- Browser-level checks for critical user-facing flow and page availability.
- Purpose: ensure app startup, routing, and key UI actions work together.

## Troubleshooting

### `P1001: Can't reach database server`
- Check if your database is running and reachable.
- Verify `DATABASE_URL` host, database name, and credentials.

### Playwright browser missing
- Run:

```bash
npm run test:e2e:install
```

### PowerShell `npm.ps1` execution policy error
- Use `npm.cmd` instead of `npm`, for example:

```bash
npm.cmd run test:unit
```