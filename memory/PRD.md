# NEXORA — Product Requirements Document

## Vision
NEXORA is a premium digital collectibles platform where every "Relic" has a permanent identity, certificate, and finite max supply. Once fully discovered, no new units of a Relic can ever exist. The experience must feel like Apple × Rolex × Hermès × modern art gallery — never like a game, casino, or TCG.

## Design language
- **Palette**: Background `#090909`, text white, accent matte gold `#C9A961`, graphite grays.
- **Typography**: Cormorant Garamond (serif display) + system sans for body. Wide letter-spacing on eyebrows.
- **Style**: Extreme minimalism, generous whitespace, thin gold rules, single-color SVG relics with metallic radial/linear gradients.

## Core screens (implemented)
1. Splash — auto-navigates after ~1.9s
2. Welcome — brand + Genesis art + Entrar CTA
3. Login — Apple / Google / Email (all route to signup mock)
4. Signup — photo, name, city, country, accept terms, submit
5. Home (tab) — rarest hero card, 4-tile grid (Collection, Discover, Invites, Registry)
6. Collection (tab) — 2-col grid; owned = colored, undiscovered = gray
7. Discover (tab) — clean, unlit Relic + REVELAR RELIC CTA
8. Reveal — cinematic animation (scale + rotate + glow + sequential fade of image → name → serial → description)
9. Relic Detail — hero + description + history + Certificate card (max qty, discovered, remaining, first collector, date/time)
10. Registry (tab) — editorial list, tabular counts (X / Y)
11. Profile (tab) — avatar, stats grid, rarest card, links to Invites/Settings/Logout
12. Invites — invite code, copy, share, influence metric
13. Settings — PT/EN language toggle, account/privacy/security/terms links

## 10 Founder Relics (backend seeded)
Genesis (1), Aeternum (10), Constellation (100), Eclipse (500), Painita (2500), Apex (10000), Aureon (25000), Obsidian (75000), Alfalium (250000), Omeguium (1000000). Each has a unique geometric SVG identity.

## Systems
- **Auth**: mock local, persisted via AsyncStorage
- **Backend**: FastAPI + MongoDB
- **Discovery**: weighted random (atomic increment) — rarer Relics have far lower weight
- **i18n**: PT (default) / EN toggle in Settings

## Out of scope (v1)
- Real OAuth
- Real photo picker
- Trading between users
- Push notifications
