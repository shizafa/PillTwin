# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PillTwin

## What this project is
PillTwin is a website for patients in Pakistan. The user scans (photographs) a medicine box their doctor prescribed. Gemma reads the box, and PillTwin finds every DRAP-registered medicine with the **same salt, same strength and same dosage form** (the medicine's "twins"), so the user can see cheaper alternatives. It also flags medicines that look **fake / unregistered** (registration number not found in DRAP's registry, or registration not Active).

Tagline: *Find your medicine's twin.*

## Context and hard constraints
- Built for a **24-hour hackathon that requires Google's Gemma**. Gemma must be the AI model that reads the medicine box. Do not swap in another model.
- The owner (Tayyab) writes most of the code with you; teammates only help with design inspiration.
- Speed matters more than perfection. Choose the simplest thing that works and demos well.
- Deployed on **Vercel**.

## How to work with me (important)
- **Build one thing at a time.** Never build several features in one go.
- After each part, stop and give me a short report:
  1. What you built (files created/changed)
  2. How I can test it (exact steps: URL to open, Postman request, or command to run, plus what I should see)
  3. What comes next
- Wait for my okay before moving to the next part.
- I'm on **Windows** and test APIs with **Postman**. Give commands that work in Windows terminals (PowerShell / cmd).
- Explain things simply; I'm still learning Next.js backend.

## Tech stack
- **Next.js (App Router), JavaScript only — no TypeScript.**
- **Tailwind CSS** for styling. Keep the UI basic and clean for now; I will redesign the frontend later, so don't spend time on visual polish.
- **Supabase** (Postgres) as the database. I will create the Supabase project myself; when you need it, tell me exactly what to create and which keys to put in `.env.local`.
- **Gemma via Google AI Studio API** (`@google/genai` package). Model id lives in one constant in `lib/gemma.js`: **`gemma-4-26b-a4b-it`**. Verified 28 Oct 2026: `gemma-3-27b-it` no longer exists (404), and the other available model, `gemma-4-31b-it`, fails with a 500 on roughly 3 of 4 image requests, so do not use it. Image requests still fail transiently, so `readPack` retries.
- **No login / no accounts.** The app is fully open.

## Environment variables (`.env.local`, never commit)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```
These are server-only. Never prefix them with `NEXT_PUBLIC_` and never use the service role key in client components.

## Features

### Must-have (the demo)
1. **Scan box → alternatives**: upload/take a photo → Gemma extracts details → match product → list same-salt alternatives.
2. **Manual search**: type a brand or generic name. This is also the backup when a scan fails during the demo.
3. **Fake / unregistered check**: if the registration number from the box isn't found in our DB *or* in DRAP's registry, or its status is not "Active", show a clear warning.
4. **English + Urdu toggle** for the interface text (simple dictionary of strings; Urdu should render right-to-left).

### Nice-to-have (only after must-haves work and I say go)
- **Overcharge check**: user enters price paid, compare with printed MRP on the pack.
- **Expiry warning**: from the expiry date Gemma reads.
- **Risky-to-switch warning**: for medicines like levothyroxine, warfarin, antiepileptics.

### Not decided yet
- **Prices (MRP + pack size)**: DRAP data has NO prices. We will decide later how to get them. Until then: keep `mrp` and `pack_size` columns nullable, sort alternatives by price when available and put unpriced ones after, and show "price not available" in the UI. Do not invent prices.

## Safety rule (always)
PillTwin never tells a user to switch medicine on their own. Every alternatives screen shows: "Always ask your doctor or pharmacist before switching medicines." Say "registration not found / verify with pharmacist" rather than declaring a medicine definitely fake.

## Data source: DRAP registry (hybrid approach)
Data comes from the Drug Regulatory Authority of Pakistan public registry at `https://eapp.dra.gov.pk/WebProductIndex.php`. There is no official API; the page uses one endpoint, `https://eapp.dra.gov.pk/productView.php`. These calls were verified working on 28 Oct 2026:

| Purpose | Request | Response |
|---|---|---|
| Find generic | `GET productView.php?searchGeneric=<term>&_type=generic name` | JSON `{ results: [{ id, text }] }` (id is the generic name itself) |
| All products for a generic | `POST productView.php`, form body `masterID=<id>` | JSON array `[{ approvedName, companyName, genericName, id, registrationNo }]`. Fuzzy: "Omeprazole" also returns esomeprazole and combos, so filter by whole word. `genericName` may contain `<br>` between ingredients. `approvedName` has leading spaces. |
| One product's details | `POST productView.php`, form body `webRegNo=<registration no>` | HTML snippet of label/value pairs: Product Name, Registration No, Registration Date, Company Name, Registration Status (e.g. Active), Route of Admin, Dosage Form, Label Claim, Composition, Pack Size(s) (e.g. "14s"). **No price field.** |

Send headers `Referer: https://eapp.dra.gov.pk/WebProductIndex.php` and `X-Requested-With: XMLHttpRequest`. Be polite: ~1.5 s between requests when scraping in bulk.

**Hybrid strategy:**
1. **Pre-load**: `scripts/drap-scraper.js` (already written; it outputs `drap_products.csv`) scrapes our list of common generics. We import that CSV into Supabase so demo medicines are instant.
2. **Fetch on demand + cache**: if a scanned/searched medicine is not in our DB, the backend calls DRAP live (`lib/drap.js`), saves the results into Supabase (`source = 'drap_live'`), then answers. Next time it's instant.
3. If DRAP is slow or down, fail gracefully: use a short timeout (~8 s), return whatever we have in our DB, and tell the user live lookup is unavailable. The demo must never crash because of DRAP.

Share parsing/cleaning helpers between the scraper and `lib/drap.js` rather than duplicating them.

DRAP's disclaimer says the list is provisional. Show a small footer note: "Data from DRAP's provisional registry; may contain errors."

## Matching logic
- `salt_key` = sorted, lowercased ingredient names + `|` + strength without spaces. Example: `paracetamol|500mg`, `amoxicillin+clavulanic acid|500/125mg`. The same `makeSaltKey` function must be used everywhere (scraper, live fetch, API).
- **Find scanned product**: by `reg_no` first (unique, most reliable) → else by brand name (+ strength) → else live DRAP lookup.
- **Alternatives**: same `salt_key` AND same `dosage_form`, exclude the product itself, cheapest `price_per_unit` first (nulls last).
- **Unregistered check**: reg no not in DB and not in DRAP live → warning. Status not "Active" → warning.

## Database schema (starting point)
```sql
create table products (
  id             bigint generated always as identity primary key,
  reg_no         text unique,
  brand          text not null,
  generic        text not null,
  strength       text,
  dosage_form    text,
  salt_key       text not null,
  manufacturer   text,
  composition    text,
  status         text,                 -- 'Active' etc. from DRAP
  pack_size      int,                  -- nullable until prices decided
  mrp            numeric,              -- nullable until prices decided
  price_per_unit numeric generated always as (mrp / nullif(pack_size, 0)) stored,
  source         text default 'drap_scrape',   -- 'drap_scrape' | 'drap_live' | 'manual'
  fetched_at     timestamptz default now()
);
create index on products (salt_key);
create index on products (brand);
alter table products enable row level security;  -- only server (service role) accesses it
```

## API routes (backend)
- `POST /api/scan`: multipart form with `image`. Gemma reads the box → returns `{ pack, product, alternatives, warnings, disclaimer }`.
- `GET /api/search?q=<name>`: manual search by brand or generic → `{ product, alternatives, warnings }`.
- (nice-to-have) `POST /api/price-check`.

All routes: validate input, wrap in try/catch, return friendly JSON errors (never a raw stack trace).

### Gemma box-reading notes
- Send the image (base64 inline data) plus a prompt asking for ONLY a JSON object with: `brand, generic, strength, dosage_form, reg_no, mrp, pack_size, expiry, batch` (null when unreadable, never guess).
- Gemma may wrap output in ```json fences or add text: extract from the first `{` to the last `}` before `JSON.parse`.
- Gemma via the API may not support system instructions or JSON mode, so put all instructions in the user message.
- Resize images on the client to ~1024px wide before upload (faster, avoids size limits).
- Free tier has rate limits: during development, save one good Gemma response as a fixture and reuse it when working on other parts.

## Suggested folder structure
```
app/
  page.js                 # home: scan button + search box
  result/                 # results view (or render results on home)
  api/scan/route.js
  api/search/route.js
lib/
  supabase.js             # server-side client
  gemma.js                # readPack(image)
  drap.js                 # live DRAP fetch + parse + cache to Supabase
  medicine.js             # findProduct, findAlternatives, buildWarnings
  saltKey.js              # makeSaltKey + cleaning helpers (shared)
  i18n.js                 # English/Urdu strings
scripts/
  drap-scraper.js         # bulk pre-load → drap_products.csv
```

## Build order (one at a time, report after each)
1. Project setup (Next.js JS + Tailwind), folder structure, `.env.local.example`.
2. Supabase: give me the SQL to run; `lib/supabase.js`; a test route proving the connection.
3. Scraper in `scripts/`, sharing helpers with `lib/saltKey.js`; I run it and import the CSV.
4. `GET /api/search` + matching logic (test in Postman).
5. `lib/drap.js` live fetch + cache, plugged into search (hybrid).
6. `lib/gemma.js` + `POST /api/scan` (test with real box photos in Postman).
7. Unregistered / fake check in warnings.
8. Basic frontend: camera upload (`accept="image/*" capture="environment"`), search box, results list, warnings, disclaimer.
9. English/Urdu toggle.
10. Deploy to Vercel; check live DRAP calls work from Vercel.
11. Nice-to-haves, only if I say go.

## Don'ts
- Don't use TypeScript.
- Don't add login/auth.
- Don't invent or hard-code fake prices or medicine data.
- Don't put secrets in client code or commit `.env.local`.
- Don't spend time on fancy UI; basic is fine for now.
- Don't move to the next build step without my okay.

## Commands
```
npm run dev            # start dev server (Turbopack), http://localhost:3000
npm run build          # production build
npm start              # run the production build
npm run lint           # eslint (eslint-config-next, flat config)
```
There is no test suite / test runner in this repo.

Scraper scripts (run with Node directly, not through npm):
```
node scripts/drap-scraper.js            # bulk-scrape all GENERICS → drap_products.csv (~1.5s delay/request, slow)
node scripts/drap-scraper.js --probe "Paracetamol"   # one generic only, dumps drap-probe.json for inspection
node scripts/drap-diagnose.js           # DNS/TCP/TLS connectivity check against eapp.dra.gov.pk, no DB/API needed
```

## Current implementation state
As of the last commit, build order steps 1–4, 6, and 9 are done; step 5 (live DRAP fetch wired into search/scan) is **not yet wired in** — `lib/drap.js` currently has the fetch/parse helpers used only by `scripts/drap-scraper.js`, and `lib/medicine.js`'s `findProductFromPack` / `/api/search` only query Supabase. `buildWarnings` already accepts a `liveLookupUnavailable` flag and `i18n.js` already has the `LIVE_LOOKUP_UNAVAILABLE` string, anticipating that wiring. Don't assume live DRAP lookup works end-to-end until it's actually plugged in.

### Module map
- `src/lib/saltKey.js` — pure string helpers shared by the scraper and the live fetch: `cleanText`, `splitIngredients`, `normalizeStrength`, `normalizeDosageForm`, `makeSaltKey`, `extractStrength`, `extractPackSize`. Change matching behavior here, not in callers.
- `src/lib/drap.js` — DRAP HTTP calls (`findGenerics`, `listProductsByGeneric`, `fetchProductDetailHtml`), `parseProductDetailHtml` (HTML label/value scraping via `DETAIL_LABELS`), and `buildProductRecord` (list item + detail fields → a `products` row shape). 8s timeout via `AbortController`, used by both the scraper and (once wired) the live lookup path.
- `src/lib/medicine.js` — Supabase-backed product lookup/matching: `findProductByRegNo`, `searchProducts`, `pickBestMatch` (scored brand/generic/strength match), `findAlternatives` (same `salt_key` + `dosage_form`), `findProductFromPack`, `buildWarnings`. Also owns the `DISCLAIMER` / `DATA_NOTE` constants.
- `src/lib/gemma.js` — `readPack(base64Image, mimeType)` calls Gemma (model id in `GEMMA_MODEL`), retries up to 3x on transient errors (429/500/503), extracts the first `{...}` JSON blob from the response text, normalizes fields with `normalizePack` (treats words like "null"/"n/a"/"unknown" as absent).
- `src/lib/supabase.js` — `getSupabase()` lazily creates and caches a service-role client. Server-only; never import from a client component.
- `src/lib/i18n.js` — `t(lang, key)` for UI strings, `warningText(lang, warning)` for warning codes returned by the API, `dirFor(lang)` for `ltr`/`rtl`. Add new user-facing strings/warning codes to both `en` and `ur` in the same edit.
- `src/app/api/search/route.js`, `src/app/api/scan/route.js`, `src/app/api/test-db/route.js` — thin route handlers; all real logic lives in `lib/`.
- `src/app/page.js` — single-page client component (search form + scan upload + language toggle); shrinks images client-side to 1024px wide before POSTing to `/api/scan`. `src/components/ResultView.js` renders the API response (product, alternatives, warnings).
- `fixtures/gemma-pack.json`, `fixtures/test-box.png` — a saved real Gemma response + sample box photo, for working on downstream parts without burning Gemma free-tier rate limits.

### Conventions worth preserving
- Import alias `@/*` → `src/*` (see `jsconfig.json`); route handlers and components use it, `lib/` files use relative imports among themselves.
- `salt_key`, strength, and dosage-form normalization must only ever happen through the shared helpers in `saltKey.js` — there is deliberately one implementation, used by the scraper, the live fetch, and (via `medicine.js`) the API.
- API routes never throw raw errors to the client: every route wraps its body in try/catch and returns a plain-English `{ error }` JSON message.