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

## Appointment request — current release state

**The website is not publicly launched.** The Access-protected Cloudflare preview
is on `preview/clinic-20261014`; public production `main` is unchanged.
`config/clinic-release.json` has `releaseStatus: pending` and
`booking.enabled: false`. Do not change these settings as part of visual review.

The appointment page displays a non-delivery notice and a phone/WhatsApp
contact fallback. **Entering details into the review form does not send them
to the clinic.** No live form recipient, privacy/retention policy or delivery
authorization is currently confirmed. Never enter real patient medical
information into preview/test sessions.

A future Web3Forms transport exists behind an explicit release gate. Merely
setting `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` does not enable it. Before any
activation, record clinic approval and evidence for recipient binding,
privacy notice, retention, rate protection, and handling uncertain requests.
Client-side access keys are included in static exports; do not treat them as
secrets. Never commit live credentials or bypass release controls.

The earlier 45-versus-60-minute consultation discrepancy was resolved on
17 October 2026: the approved duration is **45 minutes**, and the website and
service metadata now agree. The current booking plan is CAPTCHA-free with no
custom 30-day Web3Forms retention setting; provider defaults and privacy
approval still need real-account checks.

See [Owner prelaunch review](docs/CLINIC_OWNER_PRELAUNCH_REVIEW_20261017.md)
for the historical audit and
[Production go-live operator checklist](docs/PRODUCTION_GO_LIVE_OPERATOR_CHECKLIST_20261017.md)
for the current actionable launch gates. Draft production
[PR #28](https://github.com/Abdudhi100/dr_olaosebikan/pull/28)
must not be merged until these gates and explicit release approval pass.

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
