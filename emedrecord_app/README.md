This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

za pecka koji nije debil <3333

git clone https://github.com/dpopoviic/emedrecord_app.git GDE KLONIRAS PUTANJA

kreiraj .env fajl izvan svega u visual studio code-u evo sta treba da stoji u fajlu
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YW1hemVkLWdlbGRpbmctOS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_4VYjdtJ2rxx8CyOqVO6DTxTsxozzm4jMPZaaW9nRUg


NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up


# This was inserted by ⁨prisma init⁩:
# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add ⁨import "dotenv/config";⁩ to your ⁨prisma.config.ts⁩ file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.
# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
# The following ⁨prisma+postgres⁩ URL is similar to the URL produced by running a local Prisma Postgres
# server with the ⁨prisma dev⁩ CLI command, when not choosing any non-default ports or settings. The API key, unlike the
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="postgresql://neondb_owner:npg_m0v9cNQFMlLu@ep-purple-band-ag9lp5pp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"

npm install

npx prisma generate

npx prisma migrate dev

npm run dev