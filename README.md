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

## Appointment Form

The appointment page is static and does not save to a database. It submits directly from the browser to Web3Forms and keeps a WhatsApp fallback visible for patients.

Create a free Web3Forms access key at `https://web3forms.com/`, then configure it in one of these ways:

1. Recommended for Cloudflare Pages: add a build environment variable named `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the appropriate Preview and Production environments.
2. For simple local/static setup: place the key in `src/content/site.json` as `web3FormsAccessKey`.

Do not commit a real Web3Forms key. Because this is a static client-side form, the key is included in the exported site when configured. Use the Web3Forms dashboard spam controls and allowed-domain settings where available.

The form posts to `https://api.web3forms.com/submit` and sends these fields:

- `name`
- `phone`
- `email` (optional)
- `preferredDate`
- `preferredTime` (optional)
- `service`
- `message` (optional scheduling note only)
- `subject` (`New Appointment Request - Dr Olaosebikan Clinic`)
- `botcheck` honeypot spam-protection field

The free-text field warns patients not to include sensitive medical information.

## WhatsApp Number

Update `whatsappNumber` in `src/content/site.json` using international format without a plus sign, for example:

```json
"whatsappNumber": "2348035751154"
```

## Publications and Achievements

No legacy database export was present in the repository, so `publications.json` and `achievements.json` are empty editable arrays. Add records there and the static listing/detail pages will be generated at build time.

## Blog

The old Django blog depended on database-backed posts and CKEditor content. It is not included in the static navigation. Add static MDX or JSON-backed posts later if the blog is needed.

## Recovery Documentation

- `docs/PROJECT_STATUS.md` - current launch status and route inventory
- `docs/CONTENT_REQUIREMENTS.md` - verified content needed from the clinic
- `docs/DEPLOYMENT_RUNBOOK.md` - Cloudflare Pages deployment and Render retirement steps
- `docs/TEST_CHECKLIST.md` - manual smoke-test checklist
