# Test Checklist

## Automated

- `npm ci`
- `npm run build`
- `npm run typecheck`
- Run lint/test scripts if they are added to `package.json`.

## Static Export

- Confirm `out/` exists after build.
- Confirm `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, favicons, images, and the Google verification file are present.
- Confirm no `/publications/__placeholder` output is generated.

## Manual Desktop And Mobile Smoke Tests

- Homepage renders and primary CTAs work.
- Header desktop navigation works.
- Mobile menu opens, closes, and links navigate.
- Footer links work.
- Care-area pages render without broken sections.
- Contact links open `tel:` and `mailto:` URLs.
- WhatsApp links open `wa.me` URLs with encoded text.
- Appointment form blocks past dates.
- Appointment form shows a useful message when `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is missing.
- Appointment form keeps WhatsApp fallback visible.
- Appointment form includes the privacy warning beside the scheduling note.
- Invalid route displays the not-found page.
- Browser console has no errors during basic navigation.

## Metadata Checks

- Canonical domain is `https://www.drolaosebikan.com`.
- Open Graph image resolves.
- Sitemap URLs use the production domain.
- Robots file references the production sitemap.
