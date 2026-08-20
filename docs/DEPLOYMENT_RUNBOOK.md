# Deployment Runbook

## Cloudflare Pages Settings

- Framework preset: None or Next.js static export compatible.
- Environment variable: `SKIP_DEPENDENCY_INSTALL=true`.
- Build command: `npm ci && npm run build`.
- Output directory: `out`.
- Node.js version: `22.16.0`.
- Production branch: the approved recovery or release branch after review.

Use the custom build command so package installation is controlled by this
project. `npm ci` installs exactly from `package-lock.json`, and `npm run build`
performs the static Next.js export. The `SKIP_DEPENDENCY_INSTALL` setting keeps
Cloudflare from auto-detecting and installing obsolete Python/Django deployment
dependencies that are retained only for historical reference.

## Environment Variables

Set names only. Do not place secret values in the repository.

- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`

Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the appropriate Cloudflare Pages
Preview and Production environments. Do not expose the value in documentation,
source files, build logs, or commits.

## Preview Deployment Procedure

1. Push the reviewed branch to GitHub.
2. Let Cloudflare Pages create a preview deployment.
3. Confirm the preview build uses Node.js `22.16.0`.
4. Smoke test public routes, navigation, metadata, images, and the appointment form missing-key/configured-key behavior.
5. Confirm no Django, Render, login, register, admin, or dashboard links are exposed in public navigation.

## Production Deployment Procedure

1. Confirm content approval from the clinic.
2. Confirm `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set in Cloudflare Pages production variables.
3. Merge or promote the approved branch.
4. Deploy through Cloudflare Pages.
5. Run post-deployment smoke tests.

## Domain Attachment Procedure

1. Add `www.drolaosebikan.com` to the Cloudflare Pages project.
2. Follow Cloudflare's displayed DNS instructions.
3. Confirm DNS resolves to Cloudflare Pages.
4. Confirm HTTPS certificate status is active.
5. Confirm canonical metadata uses `https://www.drolaosebikan.com`.

## DNS Verification Checklist

- `www.drolaosebikan.com` resolves to Cloudflare Pages.
- Apex domain handling is intentional.
- HTTPS is active.
- No stale CNAME points to Render unless intentionally retained.
- `/robots.txt` and `/sitemap.xml` load on the final domain.

## Rollback Procedure

1. In Cloudflare Pages, choose the last known good deployment.
2. Promote it to production.
3. Smoke test homepage, appointment page, contact links, robots, and sitemap.
4. Record the failed deployment ID and observed issue.

## Post-Deployment Smoke Tests

- `/`
- `/about-dr-olaosebikan`
- `/appointments/book`
- Every care-area page
- `/contact`
- `/contact-location`
- `/faq`
- `/publications` if publication content is intentionally enabled
- `/publications/achievements` if achievement content is intentionally enabled
- `/robots.txt`
- `/sitemap.xml`
- `/googlef8a66bd5cc73324b.html`
- A deliberately invalid route

## Retiring The Old Render Deployment

1. Confirm Cloudflare Pages is serving the approved production site.
2. Confirm DNS no longer depends on the Render service.
3. Export any required legacy database content before shutting Render down.
4. Disable or suspend Render only after the owner approves.
5. Keep the Render URL redirected or documented so search engines and users are not confused.
