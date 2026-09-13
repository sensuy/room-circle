# Product context

## Intent and preferences

The user is building RoomCircle: owners advertise individual rooms in houses, prospective tenants request a room, and owners consider rental histories before accepting. Tenant history is a central differentiator, not an optional afterthought.

Discussion may be in Portuguese. English is the default and source product language. Ship Portuguese translations from the initial release, with separate English and Portuguese locale files and an extensible structure for future languages such as Spanish. Source identifiers, repository names and project documentation remain in English. Internationalization is approved for the implementation plan, not implemented yet.

Keep delivery incremental. The user dislikes repeated confirmations and status-only loops. Preserve explicit authorization, but respect actual execution permission boundaries.

## Owner onboarding

1. Owner registers with full name, email, phone, and password.
2. Optional referral code identifies the owner who invited them. A link can prefill the code.
3. Owner adds a property once: city, state, neighborhood, full address, description, shared areas, and house rules.
4. Owner adds individual rooms: photos, price, capacity, furnishings, bathroom type, and availability.

A property can have multiple rooms with different characteristics and prices. Public listings should show approximate location rather than the full address.

## Referrals

Record who referred whom from the start. Future rewards are planned, but their rules, eligibility, amounts, and payments are not defined.
Registration must work without a referral. Invalid codes should allow correction or removal.
Current implementation stores the referrer relation and the account creation time; referral assignment happens during registration.
A dashboard for viewing or sharing invitation links is not implemented.

## Proposed MVP beyond registration

- Property and room listings.
- Tenant registration and rental requests.
- Owner acceptance or rejection.
- Confirmation by both parties that a rental occurred.
- Tenant reviews of rooms and owner reviews of rental experiences.
- Reviews tied to confirmed rentals, with replies, disputes, and basic moderation.
- Restricted history lookup associated with a rental candidate, rather than unrestricted public access.

The user originally requested lookup by CPF or phone. Exact access, identity matching, review visibility, retention, and moderation rules still require product design before implementation. Phone alone must not be treated as proof of identity. CPF lookup is not implemented.

Identity checking before rental confirmation was proposed; a manual process can precede automation. No identity verification workflow exists yet.

## Approved product flow decisions

- Support light and dark themes from the initial release. Default to the operating system preference; provide System, Light and Dark choices and persist an explicit user selection. While System is selected, follow subsequent system changes. Theme support is planned, not implemented.

- Phone entry uses an editable country/calling-code selector and a user-entered area code plus number. Country may be suggested, but it is not proof of the number's origin; never infer the area code from location. The prototype defaults to Brazil as a demonstration, without geolocation. Production country suggestion strategy and international phone validation remain to be implemented.

- Login uses one "Email or mobile number" identifier field plus a password. Both verified identifiers resolve to the same account and saved role. Phone input must support country and area codes and formatting normalization. Recurring passwordless code login is not part of this decision. The prototype uses fictitious account mappings; production authentication remains unimplemented.

- Account onboarding must include email confirmation through a sent link and phone confirmation through a one-time code. Apply to owners and tenants. The prototype places these after account details, before the initial account area; exact production access gates remain to be specified.
- Include resend, contact correction, and invalid-code feedback. Delivery channel/provider, expiry, retry limits, and handling previously verified contacts after edits remain to be specified before implementation. No real messages are sent by the prototype. Contact verification proves access to the contact channel, not legal identity.

- Public entry is a room listing view with an editable region, image carousels, and room details before login. Location suggestions require user permission; prototype regions and images are illustrative.
- Login routes an existing account to its saved role. Owner/tenant role selection belongs to account creation, not every login.
- Property photos cover shared areas; each room has its own photos. Photo selection, cover selection, and ordering still need to be added to the prototype.
- Owners may offer daily, weekly, and/or monthly rates. Each enabled period has an independently entered positive price; discounts are owner-defined, not automatically derived.
- MVP room availability is a manually maintained boolean: available or unavailable. The owner can mark or unmark it at any time. No future availability dates, scheduling, or requested stay duration are required in the MVP.
- These are approved product decisions, not claims of production implementation. The chat prototype demonstrates only part of the flow; registration remains the implemented backend capability.

## Deferred

Future availability dates, availability scheduling, and stay-duration collection are outside the MVP.

Integrated payments, built-in chat, automated rental contracts, reward payouts, advanced search, and Serpro integration.
Serpro/Datavalid was researched as an identity-verification option, but no provider was selected. Current pricing for this platform was not established; historical cartório pricing is not a usable project quote.

## Mobile direction

Use mobile-first responsive web design, with a modern visual identity and touch-friendly navigation, forms and image carousels. Create the public listing and room-detail visual proposals for mobile first and show their desktop adaptations before implementing the final screens. The existing chat prototype tests navigation; it is not the approved final visual design.

Web first, with a future React Native/Expo app discussed. Reuse platform-neutral types, validation, API contracts, and suitable hooks. HTML components and Vite are not automatically reusable as native UI. No mobile app exists.
