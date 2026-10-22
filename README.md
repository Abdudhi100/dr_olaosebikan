# Dr Olaosebikan Clinic Static Website

This repository now builds the public clinic website as a static Next.js site for Cloudflare Pages. The production path no longer requires Django, Render, PostgreSQL, Django auth, Django admin, or database-backed appointments.

## Commands

Install dependencies:

```bash
npm ci
```

Run locally:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Cloudflare Pages settings:

```text
Environment variable: SKIP_DEPENDENCY_INSTALL=true
Build command: npm ci && npm run build
Output directory: out
Node.js version: 22.16.0
```

The repository includes `.node-version` with the Node.js version previously
proven in Cloudflare Pages. `SKIP_DEPENDENCY_INSTALL=true` prevents Cloudflare
from trying to infer and install obsolete Python/Django dependencies from
historical files. The custom build command runs the dependency install explicitly
with `npm ci`, then creates the static export with `npm run build`.

## Editing Clinic Content

Most public content is stored in JSON:

- `src/content/site.json` - clinic name, phone, email, address, WhatsApp number, SEO defaults, Web3Forms key placeholder
- `src/content/doctor.json` - active doctor profile
- `src/content/services.json` - appointment service/complaint options
- `src/content/pages.json` - about page and care-area pages
- `src/content/faqs.json` - FAQ content and FAQPage structured data
- `src/content/publications.json` - publication listing and detail pages
- `src/content/achievements.json` - achievements timeline

Images and favicons live in `public/`. The Google verification file is available at `/googlef8a66bd5cc73324b.html`.

## Current production status (18 October 2026)

**Public website is already deployed:** https://www.drolaosebikan.com/ from
GitHub `main`. The 17 October 2026 owner-approved release is recorded in
`config/clinic-release.json` as `releaseStatus: approved` and
`booking.enabled: true`. The earlier Access-protected review branch
`preview/clinic-20261014` is **not** the production source and must not be
merged wholesale to `main`.

The production appointment form uses Web3Forms, with the verified
`contact@drolaosebikan.com` email routing into the authorized clinic
receiving inbox. The owner chose Web3Forms' displayed 3-year provider setting,
no compulsory visual CAPTCHA, and removal of routine forwarded appointment
emails after 12 months, subject to appropriate clinical/legal record retention.
Cloudflare and Web3Forms delivery were tested with fictional data prior to
launch. Do not configure a competing 30-day retention rule or enable dormant
hCaptcha code without a new explicit owner decision. Contact details, clinical
copy and 45-minute appointment duration are approved in the release evidence.

Sanity Studio is **separate** from patient appointments. The existing owner
project is `zavdffj8`, dataset `production`, with published-only website
content validation. The hosted Studio URL, actual Cloudflare CMS environment,
and automatic rebuild webhook remain to be verified. Use
[Sanity production handover](docs/SANITY_PRODUCTION_HANDOVER_20261018.md)
and the read-only published-content GitHub preflight before configuring live
CMS rebuilds. Never store patient records or private sign-off documents in
this public editorial dataset.

## WhatsApp Number

Update `whatsappNumber` in `src/content/site.json` using international format without a plus sign, for example:

```json
"whatsappNumber": "2348035751154"
```

## Publications and Achievements

No legacy database export was present, so the current publication and achievement
arrays are empty. Add records only after verifying their source and approval;
static detail pages are generated at build time for published records.

## Blog

The old Django blog depended on database-backed posts and CKEditor content. It is not included in the static navigation. Add static MDX or JSON-backed posts later if the blog is needed.

## Recovery Documentation

- `docs/PROJECT_STATUS.md` - current launch status and route inventory
- `docs/CONTENT_REQUIREMENTS.md` - verified content needed from the clinic
- `docs/DEPLOYMENT_RUNBOOK.md` - Cloudflare Pages deployment and Render retirement steps
- `docs/TEST_CHECKLIST.md` - manual smoke-test checklist

## V12 editorial publishing (review implementation)

Owner-managed weekly articles, videos and genuine news use a separate hosted Sanity Studio and build-time static export. Default CMS mode is disabled until account setup; `/insights` is an honest, unindexed empty page, hidden from main navigation. See [V12 publishing handover](docs/V12_PUBLISHING_HANDOVER.md) for setup, release checks, weekly operation and withdrawal acceptance. The editorial production CMS and webhook remain unprovisioned; the Insights
page is an honest, unindexed empty state, but **Insights & Media is linked from
the Resources navigation** in the current preview.

Run `npm ci`, `npm test`, `npm run typecheck`, and `npm run test:export`. Install Studio separately with `npm ci --prefix studio`; it requires Node 22.12 or newer. Generated content snapshots and active detail routes are intentionally ignored and recreated before builds.
