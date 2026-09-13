# RoomCircle implementation plan

## Resume here

Status: planning complete; implementation tasks below are not started.
Next task: T01. Read CONTEXT.md, ARCHITECTURE.md, HANDOFF.md, then this file before changing code. Inspect relevant source and local AGENTS.md instructions. The current request authorized documenting this plan, not executing the entire roadmap.

The working backend currently implements owner registration and referrals only. Prior build/test results are historical, not fresh verification. UI prototypes are exploratory and do not establish production functionality.

## Accepted scope

- Public room browsing by editable region, image carousel, and room details before login. Full addresses are not public.
- One email-or-mobile field plus password. Account role is selected during registration, recognized during login.
- Email-link and phone-code confirmation; editable country calling code and manually entered area code/phone. Contact verification is not identity verification.
- Property photos for shared areas and separate room photos, cover selection and ordering.
- Independently priced optional daily, weekly, monthly rates. No automatic discount rules.
- Availability is a manually updated available/unavailable flag. No future dates, scheduling, stay duration, or booking calendar in the MVP.
- Requests, owner decisions, mutual rental confirmation, reviews and restricted candidate history are the intended remaining MVP journey, with unresolved rules below.
- Payments, built-in chat, contracts, rewards payouts, mobile app, unrestricted CPF/phone search and automated identity-provider integration remain deferred.

## Execution order

Follow the numbered order by default. Each task delivers an incremental change with relevant checks and an updated handoff. A proposed decision is not automatically approved because it appears in this plan.

### T01 — Baseline and prototype reconciliation

Status: TODO. Dependencies: none.
- Inspect source, migrations, dependency manifests, README and applicable instructions; check current services before relying on them.
- Verify the current build, lint and existing tests when the implementation session begins. Preserve the retained demo account and unrelated changes.
- Inventory prototype versus approved requirements: photos are missing, some sample prices and availability are hard-coded, verification is simulated, and phone handling is illustrative. The prototype currently uses Portuguese while repository policy calls for English product text; retain English for implementation unless the user explicitly changes that policy.
- Record a baseline and exact failing checks, if any. Do not silently initialize Git: a previous Git-init request was declined.
Acceptance: documented baseline, discrepancy list, and concrete next task. No prototype behavior mistaken for a real API capability.

### T01A — Mobile-first visual proposal

Status: TODO. Dependencies: T01. Complete before final production screen implementation.
- Propose mobile public discovery and room details, with desktop adaptations, modern typography, large photos and touch-friendly carousels. Use RoomCircle's own visual identity.
- Review with the user before final screen implementation. The existing navigation prototype is not approved final design.
Acceptance: approved mobile/desktop visual direction and reusable responsive patterns documented.

### T01B — Internationalization foundation

Status: TODO. Dependencies: T01. Complete before new production screens; coordinate translated layouts with T01A.
- English is the default/source language. Create separate English and Portuguese translation files and ship both initially. This supersedes the earlier English-only product-text note in T01.
- Choose a React-compatible internationalization approach with stable keys, interpolation, pluralization and future mobile reuse. Avoid hard-coded user-facing strings.
- Define language selection, persistence and fallback to English. Specify the Portuguese locale variant before locale-specific formatting. Language must not determine phone country or change currency.
- Translate labels, validation/errors and relevant messages; localize number and monetary formatting without changing stored values.
- Keep the structure extensible for Spanish and other languages; additional translations are deferred.
Acceptance: initial screens support English and Portuguese, missing translations fall back to English, language choice persists and translated layouts remain usable. Planned only; no localization code implemented now.

### T01C — Light, dark and system theme foundation

Status: TODO. Dependencies: T01, T01A. Complete before new production screens.
- Define shared semantic design tokens for light and dark surfaces, text, borders, controls and interaction states; avoid per-screen hard-coded colors.
- Follow the operating system color preference by default. Offer System, Light and Dark settings; persist explicit choices and react to system changes only in System mode.
- Apply the resolved theme before initial rendering where practical to prevent a wrong-theme flash. Define a stable fallback when system preference or saved storage is unavailable.
- Include both themes in the mobile-first and desktop visual proposal and localize theme controls through T01B.
Acceptance: first visit follows system preference, explicit choice survives reload, System responds to operating system changes, and screens/forms/errors/carousels remain readable and accessible in both themes. This is a planned task only; no theme implementation performed during documentation.

### T02 — Account and verification contracts

Status: TODO. Dependencies: T01.
- Define shared account identity for owner/tenant profiles without losing current owner records, password hashes or referral relationships. Decide whether dual-role accounts are needed before schema work.
- Specify registration, login, logout, current-account, email/phone verification and recovery contracts; role routing and pending-verification states.
- Decide contact-change behavior and which actions require both contacts verified. Proposed gate: browsing stays public; publishing/requesting requires verified contacts. This gate needs product approval.
- Define phone canonicalization and country suggestion fallback; never derive area code from location.
Acceptance: recorded schema/contract design, role and verification transition rules, migration approach, and unresolved choices clearly identified.

### T03 — Account persistence and registration

Status: TODO. Dependencies: T02.
- Add incremental migrations and repository contracts for the approved account/profile design and verification state.
- Extend registration for both roles, retain optional owner referral behavior and existing validation, use a maintained international phone parser.
- Preserve existing records; do not rewrite applied migrations or use db push.
Acceptance: both roles register; normalized duplicate identifiers are handled; existing owner/referral data survives; migration and regression tests pass against isolated data.

### T04 — Password login and sessions

Status: TODO. Dependencies: T03.
- Implement email-or-phone password login, secure session lifecycle, logout and role-aware routing.
- Implement access control on the server, including pending verification and ownership rules; add rate limiting and non-revealing authentication errors.
- Keep credentials and sensitive fields out of responses and logs.
Acceptance: both identifiers access the same account; incorrect credentials fail; logout invalidates access; cross-role and unauthorized access checks pass.

### T05 — Contact confirmation and recovery

Status: TODO. Dependencies: T04.
- Implement single-use expiring email links and phone codes, resend limits, attempt limits and correction flows using delivery interfaces and local development adapters.
- Decide delivery providers/channel with the user before paid services or real sends. Define password recovery and safe contact changes.
- Wire registration through confirmation and resume the intended action after verification.
Acceptance: valid, expired, reused and incorrect tokens/codes are exercised; both contact states persist; correction invalidates affected verification; local tests send no real messages. Real delivery is explicitly marked pending until configured and verified.

### T06 — Properties and rooms

Status: TODO. Dependencies: T05.
- Implement owner property and room management with validated fields, approximate public location and private full address.
- Store positive daily/weekly/monthly money values using a precise monetary representation; require at least one enabled rate.
- Implement manual availability toggle and persist it. No dates or duration fields.
- Decide public behavior of unavailable listings: proposed exclusion from browse and requests, with a clear unavailable state on direct detail links.
Acceptance: one property has multiple rooms with independent rates; edits persist; ownership isolation holds; availability behavior matches the recorded decision.

### T07 — Property and room photos

Status: TODO. Dependencies: T06.
- Complete the missing prototype photo step, then implement uploads at both levels with cover selection, ordering, removal and failure/retry states.
- Use a storage interface and local adapter first; choose production storage separately. Validate file type/size, access and image processing limits.
Acceptance: room and shared-area images stay correctly associated; cover/order survive reload; unauthorized uploads or edits fail; failed uploads do not leave broken published references.

### T08 — Public discovery and detail pages

Status: TODO. Dependencies: T06, T07.
- Build the modern public entry page using real listing data, region selection, responsive cards and navigable photo carousels.
- Add loading, empty, unavailable and error states. Define how multiple rate options appear without mixing daily/monthly prices in comparisons.
- Provide login/registration entry and return users to the intended room/action afterward. Optional browser location requests require consent and a manual fallback.
Acceptance: anonymous visitor can browse, change region and inspect rooms; full addresses remain private; price period is always explicit; cards/details use consistent live data.

### T09 — Specify requests, confirmation and review rules

Status: TODO. Dependencies: T08. Design conversations may occur earlier.
- Draw request → owner analysis → accept/reject → both parties confirm rental → eligible review. Do not add stay dates/duration.
- Resolve cancellation, duplicate requests, what acceptance means, when availability changes, and disagreements about whether a rental occurred.
- Resolve review eligibility/timing, fields, visibility, reciprocal publication, replies, disputes, moderation and retention.
- Define candidate-history access conditions and identity matching; decide whether a manual identity process is needed. A verified phone alone is not legal identity.
Acceptance: approved state transitions, visibility/access matrix and reviewed prototype of the complete journey. Block only the implementation dependent on unresolved decisions, not unrelated completed work.

### T10 — Requests and mutual rental confirmation

Status: TODO. Dependencies: T09, T04–T08.
- Implement the approved request lifecycle, owner inbox, tenant request status and confirmations.
- Enforce eligibility and transitions on the server, including concurrent actions and duplicate submissions.
Acceptance: a tenant requests an available room, only its owner decides, and rental confirmation requires the agreed evidence from both parties. No implicit scheduling or payment system.

### T11 — Reviews, candidate history and moderation

Status: TODO. Dependencies: T10.
- Implement reviews tied to eligible confirmed rentals, authorized history access, replies and dispute/moderation paths from T09.
- Keep candidate histories out of public APIs and searches; define auditable access and moderation changes.
Acceptance: unrelated users cannot access restricted histories; unconfirmed rentals cannot generate eligible reviews; both review directions and dispute handling work. Provide empty-history state for first-time tenants.

### T12 — MVP end-to-end validation and launch preparation

Status: TODO. Dependencies: T11.
- Test both roles through discovery, registration, confirmation, owner publication, requests, rental confirmation and reviews using isolated fixtures.
- Validate migration deployment on a fresh test database, permissions, accessibility, responsive layout, common errors and storage/delivery failures.
- Configure production delivery/storage, secrets, routing, migrations, backups and operational checks only when the destination and services are chosen. Record current dependency audit findings.
- Prepare deployment instructions; actual public deployment requires explicit authorization.
Acceptance: repeatable essential journey checks pass; known gaps and operational requirements are documented; no claimed production readiness while providers or critical checks remain unverified.

## Task completion and handoff protocol

Use TODO, IN_PROGRESS, BLOCKED or DONE per task. DONE requires acceptance criteria met, not merely code written. On every implementation handoff record:

- Active task and completed substeps.
- Files/components changed and migrations added.
- Checks run and their outcomes; do not reuse old results as new evidence.
- Approved product decisions versus proposals needing user input.
- Blockers and the exact next action for the next instance.

Update this task status and HANDOFF.md together. Update CONTEXT.md for product decisions and ARCHITECTURE.md for accepted technical changes. Do not store credentials or real verification codes in documentation.
