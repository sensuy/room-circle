# Architecture decisions

## Accepted stack

- React and TypeScript with Vite for the web application.
- NestJS and TypeScript for the independent API.
- PostgreSQL.
- Prisma as the first persistence implementation behind repository interfaces.
- npm workspaces with apps/web and apps/api. The user explicitly accepted the apps grouping after discussing a flatter layout.
- A packages/* workspace is declared for future shared code; shared packages are not implemented.
- Node 24.21.0 via NVM and .nvmrc. The earlier setup also changed the user's NVM default globally, not just for this project.

Next.js and Supabase were explicitly rejected. Do not reintroduce them without a new user decision.

Prisma 7.10.0 was installed and its client generated. The latest-version notice was a Prisma 8 release candidate; do not assume a newer major is already in use. NestJS manifests declare ^12.0.1; consult package-lock.json for exact installed versions.

## Dependency boundaries

Application services depend on repository contracts. NestJS dependency injection selects the implementation.
Use interfaces at meaningful replaceable boundaries: persistence, identity verification, file storage, notifications. An interface for every internal class is not required.

Changing ORM still requires new repository implementations, transaction/query adaptation, and a migration strategy. It is not a zero-cost replacement.

Current registration code is compact in apps/api/src/owners.ts. It includes OwnerRepository, PrismaOwnerRepository, OwnerRegistrationService, controller, module, and Zod validation. The service is ORM-independent, but the physical file is not yet split into architectural layers.

## Frontend

React Hook Form is wired into the registration form. Current client-side validation uses HTML constraints; the API validates with Zod.
React Router, TanStack Query, Zod, and the hook-form resolver were installed or proposed during setup, but are not all wired into the application. Current HTTP calls use fetch. Tailwind was proposed, but current styling is plain CSS.

Vite proxies /api to the API on 127.0.0.1:3000. This is a development proxy; production routing is not configured.

## Database and migrations

compose.yaml currently runs only PostgreSQL 17. Web and API run locally in WSL; no application Dockerfiles exist.
Compose project: room-circle. Service: db. Persistent volume: postgres_data.
Host mapping: 127.0.0.1:55432 to container port 5432.
Database and username: roomcircle. Credentials live in ignored root .env.

All schema changes must use committed migration files. Do not replace this workflow with db push or automatic synchronization.
Current migration: apps/api/prisma/migrations/202609120001_initial_owners/migration.sql.
It creates Owner, unique email/phone/referral-code indexes, the referral foreign key, and a no-self-referral check.
Never rewrite an already applied migration to change the schema; add a new migration.

npm run db:migrate applies existing migrations using migrate deploy; it does not author a new migration.
npm run db:generate regenerates Prisma Client.
A convenient authoring command for future migrations is still to be added and documented.

## Security behavior and limits

Passwords use asynchronous Node scrypt, a random 16-byte salt, and a 64-byte derived key, stored as scrypt:salt:hex.
No plaintext password is persisted. Authentication/login, session management, rate limiting, password recovery, and verification are not implemented.
Registration responds with an owner ID and phoneVerified false. It does not establish a logged-in session.
Database constraint errors for duplicates map to HTTP 409. Other database failures currently fall through to NestJS error handling; improve this before production.
Do not expose password hashes, connection strings, or private identity information in public responses.

## Testing

Vitest and React Testing Library/user-event are configured for the web app.
The generated NestJS template uses Vitest plus Supertest; the earlier Jest suggestion was superseded by this actual setup.
MSW and Playwright were proposed but are not yet configured.
