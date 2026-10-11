# V12 publishing implementation — review handover

Status: code implemented and tested locally; **not a live CMS or production deployment**. No genuine weekly content has been supplied or published. Owner: Dhikrullah Abdullah manages weekly editorial publication. Clinical claims require genuine written clinician approval for the exact content version.

## Continuity and scope

The continuation uses `ui/refactoring-ui-phase-1` at `14ed0ee00c8c17c25c617c25c9eeb3b40c956821`, the latest recovered remote source. It preserves its existing accessibility, JSON-LD escaping, reserved publication slugs and Web3Forms booking transport. It does not claim to contain later local M1–M5 changes that were unavailable in the recovered repository. The V12 request supersedes the previous no-CMS instruction only for public editorial publishing.

Design source: [existing Figma V12 hub](https://www.figma.com/design/r95tId7u6GFLycP47UroFM?node-id=549-4015) and [V12.2 responsive continuation](https://www.figma.com/design/r95tId7u6GFLycP47UroFM?node-id=557-4390). The new Insights routes use the approved teal/paper treatment, self-hosted Inter and the actual Figma clinic symbol. Existing pages retain their recovered implementation. The publishing mock represents hosted Sanity Studio, not a separate custom dashboard.

## Implemented

| Area | Behaviour |
| --- | --- |
| Hosted editor | Separate `studio/` project: articles, videos, news, research publications and achievements; manual publication, no patient records. |
| Release gate | Publish action requires Ready status. Document validation checks fields, rights, sources, public-safe confirmation and clinical approval. The build runs the same checks against published API documents. |
| Approval version | SHA-256 fingerprint of actual public content. Public content changes invalidate recorded approval. Studio shows the current fingerprint; enter the value the clinician actually approved in independent written evidence. |
| Public routes | `/insights`, `/insights/articles/[slug]`, `/insights/videos/[slug]`, `/insights/news/[slug]`; research retains `/publications/[slug]`, achievements retain the existing list route. |
| Static generation | Prebuild queries the live Sanity API with explicit published perspective and field projection. Invalid Ready content or query failures stop the build. Next 15 rejects empty dynamic lists, so only formats with real eligible entries get generated route files. |
| Empty content | Honest hub, noindex, no main navigation link or sitemap entry. No example article routes or fabricated media. Empty research/achievement links remain hidden. |
| Rendering | Text-only Portable Text blocks, headings, single-level lists, bold/italic and validated HTTPS links. No arbitrary HTML or embed code. |
| Video | Matching YouTube/Vimeo source and ID; real duration/upload date/speaker; rights-cleared Sanity thumbnail, confirmed captions and human-reviewed transcript; external player loads on visitor action. |
| SEO | Actual authors, publication/update dates, canonical URLs and sources. Article, NewsArticle or VideoObject schema; no false doctor-author fallback. Existing undated pages omit sitemap lastmod. |
| Withdrawal | Every build queries current published state, clears the generated `out/` directory, then regenerates routes, navigation and sitemap. Next export alone can retain stale files; explicit cleanup prevents them surviving withdrawal. Unpublish/delete must trigger a successful rebuild before live removal is claimed. |

## Setup — owner action and subsequent connection

1. Create or select the **owner's Sanity project**, choose dataset and verify its visibility/plan. Record project ID and dataset name. Do not buy or assume a paid plan. The economical public dataset can contain only public-safe text/assets. Authenticated Studio does not make dataset contents confidential.
2. Keep private clinical approval notes, written sign-offs and permissions documents in separately access-controlled storage. Sanity evidence fields accept non-secret identifiers (`APPROVAL-2026-001`), not signed/private URLs. A required checkbox and reference are process checks, not independent authentication of the clinician.
3. Install root dependencies with `npm ci`; install Studio separately with `npm ci --prefix studio`. Studio needs Node **22.12 or newer**. Node 24 was used for these checks. Copy `studio/.env.example` into an ignored Studio environment file and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. Run `npm run dev --prefix studio` for account-connected review, then deploy Studio from the owner's authenticated account after approval.
4. In the approved Cloudflare Pages branch/environment, set `SANITY_CONTENT_MODE=sanity`, `SANITY_PROJECT_ID` and `SANITY_DATASET`. Public published queries need no token. A genuinely private dataset needs a **build-only** read token in `SANITY_API_READ_TOKEN`; never use `NEXT_PUBLIC_` for it. Partial settings fail closed. Default disabled mode makes an empty unindexed hub.
5. Keep Cloudflare build command `npm run build` and output directory `out`. Preserve the working Web3Forms environment settings. Set Node 24 (or an explicitly verified supported version). There is no Next server endpoint, ISR, authenticated public dashboard or CMS preview API.
6. Create a Cloudflare Pages deploy hook selecting the **approved branch**. Its unique URL is a secret. Configure the Sanity webhook in the matching dataset: POST to that hook; enable **Create, Update and Delete**; leave draft/version triggers disabled; use `publishing/sanity-webhook-filter.groq`. Before/after checks ensure ready-to-withdrawn transitions and deletion of a published Ready document also rebuild.
7. Validate the filter with the real project's webhook tester: published create/update/delete and unpublish should fire; draft saves, release-version edits and unrelated types should not. Then publish one genuine approved entry in an isolated review dataset/branch, verify build completion and the actual preview page before enabling production publication. Do not import synthetic test fixtures.
8. Enable failure notifications in the actual build/account configuration. A successful webhook HTTP response is not proof of build completion or live publication. Failed builds keep the preceding deployment; reconcile manually, then retry a fresh build.

## Weekly owner workflow

1. Collect original content, sources and media rights. Choose Article, Video or News and one controlled topic. Add the actual author/role, summary, body, sources and truthful search metadata.
2. Add accurate publication time in Lagos WAT (UTC+1). Set `modifiedAt` only for a meaningful public update. Future publication dates are blocked; scheduling is outside this MVP.
3. For articles/videos or clinical news, send the exact content and displayed fingerprint to an identified qualified clinician. Obtain written approval, verify credentials, and record reviewer/date/non-secret evidence reference plus the approved fingerprint. Any public content edit requires new approval.
4. Confirm public-safe content and media rights. Set release status Ready. Resolve validation errors, then Publish.
5. Check Cloudflare build status, open the live URL, and verify author, dates, review, sources, media accessibility and sitemap. Record the verified live URL and deployment. Weekly publishing alone does not guarantee Google rankings.
6. For corrections, update the substantive date and correction note, obtain new clinical sign-off when required, publish and verify the new deployment.
7. To withdraw, use Unpublish (published perspective) or delete the published document, confirm the removal build succeeded, check the canonical detail URL returns **404**, and verify cards/navigation/sitemap no longer refer to it. Preserve `out/404.html`; do not add an SPA catch-all. Old deployment/preview URLs need separate review and removal when relevant.

## Validation evidence and remaining limits

- `npm test`: 27 checks, including review-version invalidation, draft/version exclusion, invalid API writes, duplicate paths, unsafe URLs, impossible/future dates, rights, video accessibility and query failure.
- `npm run test:export`: synthetic article/video/news/research static pages, metadata/schema, escaped script-like text, withheld evidence references, empty state and withdrawal. A seeded stale export file is also removed by the explicit build cleanup. The script restores the configured real snapshot and rebuilds in `finally`; final default export contains no fixtures.
- Root and Studio type checks and Studio local bundle build pass. The Studio build used a clearly synthetic project identifier; no account provisioning, login, deployment or invitations occurred.
- Public-site production dependency audit is clean after a compatible Next 15.5.27 patch and PostCSS override. Studio's toolchain still reports transitive npm advisories (including braces/sprintf-js/uuid). No forced major downgrade or unverified major override was applied. Review those advisories before hosted Studio deployment; Studio dependencies are not installed by or bundled into the public Next export. The root Tailwind development toolchain also has upstream advisories; that audit is separate from the public production-dependency result.
- Actual Sanity auth/roles, independent approval evidence, dataset confidentiality, webhook deliveries, Cloudflare failure notifications and live HTTP removal need account-connected acceptance checks. No claim that these are verified.
- Populated article/video/news browser checks also passed at 390, 768, 1440 and 1920 pixels, with one H1, no horizontal overflow, expected review context and functioning video load controls. External thumbnail/player responses were mocked; real provider playback was not tested. Synthetic article screenshots were visually inspected.
- Empty-hub browser checks passed at 390, 768, 1440 and 1920: no horizontal overflow, correct single heading/noindex, actual logo load, functioning category anchors, menu Escape/focus restoration, reduced motion and existing booking/homepage smoke checks. Mobile and desktop screenshots were visually inspected. See `v12-review/`.

## Files and commands

| Purpose | Location |
| --- | --- |
| Shared release rules and fingerprint | `shared/publishing-policy.mjs` |
| Published content query and snapshot preparation | `scripts/prepare-editorial.mjs`; output cleanup in `scripts/clean-static-export.mjs` |
| Public templates and responsive chrome | `src/components/insights/`, `src/app/insights/page.tsx` |
| Conditional detail-route templates | `src/editorial-routes/` (generated copies are ignored) |
| Hosted editor, schemas and Publish guard | `studio/` |
| Environment examples | `.env.publishing.example`, `studio/.env.example` |
| Website checks | `npm test`, `npm run typecheck`, `npm run test:export` |
| Studio checks | `npm run typecheck --prefix studio`, `npm run build --prefix studio` (requires project/dataset environment values) |

Official references used for this implementation: [Sanity installation](https://www.sanity.io/docs/studio/installation), [published perspectives](https://www.sanity.io/docs/content-lake/perspectives), [query API](https://www.sanity.io/docs/http-reference/query), [Studio validation versus Content Lake](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake), [webhook filters](https://www.sanity.io/docs/developer-guides/filters-in-groq-powered-webhooks), [Cloudflare deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [Cloudflare 404 behaviour](https://developers.cloudflare.com/pages/configuration/serving-pages/).
