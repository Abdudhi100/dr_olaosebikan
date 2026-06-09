# Dr Olaosebikan Clinic Static Website

This repository now builds the public clinic website as a static Next.js site for Cloudflare Pages. The production path no longer requires Django, Render, PostgreSQL, Django auth, Django admin, or database-backed appointments.

## Commands

Install dependencies:

```bash
npm install
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
Build command: npm run build
Output directory: out
Node.js version: 20 or newer
```

## Editing Clinic Content

Most public content is stored in JSON:

- `src/content/site.json` - clinic name, phone, email, address, WhatsApp number, SEO defaults, form action
- `src/content/doctor.json` - active doctor profile
- `src/content/services.json` - appointment service/complaint options
- `src/content/pages.json` - about page and care-area pages
- `src/content/faqs.json` - FAQ content and FAQPage structured data
- `src/content/publications.json` - publication listing and detail pages
- `src/content/achievements.json` - achievements timeline

Images and favicons live in `public/`. The Google verification file is available at `/googlef8a66bd5cc73324b.html`.

## Appointment Form

The appointment page is static and does not save to a database. By default, submitting the form opens a pre-filled WhatsApp message.

To use a form handler such as Formspree, Basin, Tally, or a Cloudflare Pages Function endpoint, set `appointmentFormAction` in `src/content/site.json` to the provider URL. The form uses standard `POST` fields:

- `name`
- `phone`
- `email`
- `preferredDate`
- `preferredTime`
- `service`
- `message`

## WhatsApp Number

Update `whatsappNumber` in `src/content/site.json` using international format without a plus sign, for example:

```json
"whatsappNumber": "2348035751154"
```

## Publications and Achievements

No legacy database export was present in the repository, so `publications.json` and `achievements.json` are empty editable arrays. Add records there and the static listing/detail pages will be generated at build time.

## Blog

The old Django blog depended on database-backed posts and CKEditor content. It is not included in the static navigation. Add static MDX or JSON-backed posts later if the blog is needed.
