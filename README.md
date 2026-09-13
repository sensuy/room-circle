# RoomCircle

Room rental platform with owner referrals and rental-linked reviews.

Start with [Project context](docs/CONTEXT.md), then read [Architecture](docs/ARCHITECTURE.md) and [Current status and handoff](docs/HANDOFF.md).

This directory is an npm-workspaces monorepo. It has not been initialized as a Git repository as of September 12, 2026.

## Local development

Run from /home/sensui/projects/room-circle in Ubuntu-24.04 WSL:

```bash
source /home/sensui/.nvm/nvm.sh
nvm use
npm install
docker compose up -d --wait db
npm run db:generate
npm run dev:api
```

In another terminal:

```bash
npm run dev --workspace @room-circle/web -- --host 127.0.0.1 --port 5174 --strictPort
```

The web app is at http://localhost:5174. The API uses port 3000.
The API development command applies pending Prisma migrations before starting.
Existing local credentials are in root .env; do not print or copy them into handoff documents. For a new environment, use .env.example as a template and supply local credentials.

## Verification

```bash
npm run build
npm run lint
npm test
npm run test:e2e --workspace @room-circle/api
```

These are development foundations, not a production-ready authentication system.
