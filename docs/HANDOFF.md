# Current status and handoff

Snapshot: September 12, 2026. Verify transient process and database state before relying on it.

## Implementation roadmap and next action

Added T01C: light/dark themes, system preference by default, and persisted System/Light/Dark selection. Include both appearances in the mobile-first visual proposal and implement shared theme tokens before new production screens. Planned only; no production theme implementation yet.

Added T01A (mobile-first visual proposal) and T01B (internationalization foundation) before new production screens. English is default/source; separate English and Portuguese locale files ship initially. Spanish and other translations remain deferred. These tasks are planned, not implemented. The existing prototype is not final visual approval. Resume at T01, then address these prerequisites alongside contract design.

Read IMPLEMENTATION_PLAN.md for the ordered T01–T12 roadmap and acceptance criteria. All roadmap tasks are TODO. Next task is T01: verify the current baseline and reconcile prototype gaps before implementing authentication or listings. The plan was documented at the user's request; no roadmap implementation or fresh build/test validation was performed while writing it.

Read CONTEXT.md, ARCHITECTURE.md, this file and IMPLEMENTATION_PLAN.md at the start of future work. Keep task status, evidence and the next concrete action updated after each implementation increment.

## Implemented and verified

- Owner registration form in English in apps/web/src/App.tsx.
- Full name, email, international phone, password, optional referral.
- Referral query parameter ref prefills the form.
- POST /api/owners validates input and creates an Owner through a repository interface.
- Email is trimmed and lowercased; email and phone are unique.
- Password hashing with scrypt.
- Optional referral lookup, invalid-code rejection (422), duplicate rejection (409).
- Referral code is generated for each new owner; no invitation dashboard yet.
- PostgreSQL Compose service and initial Prisma migration.
- Development API startup applies migrations before starting Nest.
- Build and lint passed.
- Seven automated tests passed: four API unit tests, two web tests, one generated API HTTP test.
- An additional one-off integration check passed through the Vite proxy into the API and actual PostgreSQL: creation, persisted hash, duplicate rejection, invalid referral, and stored referrer relationship. This check is not yet saved as a repeatable test file.
- Synthetic integration accounts were removed after verification.

## Retained demo record

At the user's explicit request, one fictitious account remains in Owner:
- Name: Demo Owner
- Email: demo.owner@example.invalid
- Phone: +5511000000000

Do not remove it without instruction. Its password was randomly generated and was not delivered as a login credential. Login itself does not exist.

## Product design update

A first mobile visual proposal was created in the chat on September 13: public room cards, illustrative interior scenes/carousels, room detail, independently displayed rates, English/Portuguese controls, and system/light/dark previews. It is pending user review, uses sample data, and is not production implementation. Photography, desktop adaptation and full account-flow integration remain outstanding. T01A is partially explored, not complete; T01 remains the implementation entry point.

An editable country/calling-code selector was approved for phone entry. The prototype defaults to Brazil without automatic location detection and requires the user to provide their area code and number. This is a simulated input flow, not production international-number validation.

Login now has an approved single email-or-mobile field plus password. The chat prototype routes both fictitious identifiers to the same role and tolerates common phone formatting. This is a prototype change only; real authentication and verified identifier lookup still require implementation.

Email-link and phone-code confirmation were approved for account onboarding. The chat prototype includes simulated confirmation, resend, contact correction, and invalid phone-code feedback. Real delivery, secure token/code handling, expiry, attempt limits, persisted verification states, and production access rules are not implemented. See CONTEXT.md for remaining decisions.

Approved flow decisions are recorded in CONTEXT.md: public room browsing before login, role-aware login, property and room photos, independent optional daily/weekly/monthly prices, and manual boolean room availability only. Future availability dates, scheduling, and stay duration are excluded from the MVP. The chat prototype is exploratory; these decisions do not imply API or database implementation. Photo management, rental requests, confirmation, reviews, and restricted history still need prototype design.

## Not yet implemented

Login/session handling; actual phone or identity verification; owner dashboard; property/room CRUD; photo storage; tenant onboarding; rental workflows; reviews/moderation; history lookup; rewards; mobile app; production deployment; CI; application containers; OpenAPI documentation.

The registration success screen mentions phone verification as a future requirement. It does not mean verification or publication controls are implemented.

## Environment and pitfalls

Project: /home/sensui/projects/room-circle, Ubuntu-24.04 WSL.
The user confirmed DBeaver connectivity using host mode with 127.0.0.1, port 55432, database/user roomcircle.
Docker Desktop WSL integration was intermittently unavailable. Later the RoomCircle db was found stopped, restarted, and verified healthy; migration deployment reported no pending migrations.

The last frontend preview was localhost:5174 and API port 3000. Do not assume processes survived a restart.
The default root dev:web command may choose Vite's default port 5173. Use the explicit command in README to reproduce 5174.

The Codex session repeatedly had broken sandbox launch support and required approved shell execution. Its working directory also sometimes contained a malformed Windows path. Explicitly set workdir to the project.
Direct editing sometimes reported nonexistent Linux paths even though shell reads worked. Running env apply_patch through an approved shell with explicit Linux paths succeeded. Do not mistake these failures for absent project files.

Git was initialized on main on September 13 with user authorization. The origin remote is git@github.com:sensuy/room-circle.git. Initial commit d3074d9 was pushed successfully; main tracks origin/main. No PR has been created. Root ignore rules exclude local environment files, dependencies, build output, TypeScript build caches, test reports and common temporary files; .env.example is tracked with placeholder credentials only. No build or test suite was rerun for this Git setup.
.gitignore excludes local .env files; do not copy credentials into docs.
Some dependency installations reported audit findings; later installs changed the graph again. Do not claim the current dependency tree is clean without a fresh audit.

## Suggested independent work areas

These are proposed assignments, not dispatched tasks:
- Web: refine registration UX and accessibility; maintain the current API contract; add success and network-failure tests.
- API/auth: separate registration layers, design login and phone verification, preserve repository interfaces and response privacy.
- Database/testing: persist the integration check as a repeatable test with isolated records; verify migrations on a fresh test database without touching the demo record.
- Product: specify property/room forms and review visibility/dispute rules before implementing them.

Coordinate changes to package.json, package-lock.json, schema.prisma, and migrations with one owner at a time. Other work areas can proceed independently if file ownership and API contracts are agreed.

Each new instance should read these docs and inspect the relevant source, report its concrete task scope, and update this handoff when implementation or validation changes. Creating these documents does not itself authorize new tasks, deployments, schema resets, or removing records.
