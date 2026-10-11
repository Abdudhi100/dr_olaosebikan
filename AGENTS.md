# Project Guidance

This repository contains legacy Django code, but the approved public production architecture is the static Next.js site.

## Current Source Of Truth

- Build from `src/app`, `src/components`, `src/content`, `src/lib`, and `public`.
- Deploy with Cloudflare Pages using `npm run build` and output directory `out`.
- Keep public content in `src/content/*.json`.
- Keep images and favicons in `public`.

## Recovery Rules

- Do not restore or extend Django for public production work unless it is only used as a reference for verified content.
- Do not add patient accounts, dashboards, Django admin, database appointments, payment processing, or medical-record storage.
- The owner's V12 instruction authorises a separate hosted Sanity Studio for public editorial content. It supersedes the former no-CMS rule only for that scope. Keep the clinic site a static export; no clinical records or private approval evidence in the CMS dataset.
- Do not commit real secrets. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` belongs in Cloudflare Pages environment variables.
- Do not invent qualifications, publications, awards, clinic details, testimonials, or medical claims.
- Keep changes small, static-export compatible, and easy to review.
