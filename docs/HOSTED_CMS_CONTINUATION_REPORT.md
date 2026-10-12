# Protected preview and real CMS continuation

12 October 2026. Resumed from `dc43003da87666ce5c56db1f27fb3476c8825df5` in the recovered isolated checkout. This report supplements the preserved earlier evidence; its historical results are not rewritten.

The protected preview and real nonmedical create/publish/build/deploy/verify/withdraw cycle passed. The current preview is https://952ead69.dr-olaosebikan-git.pages.dev, with stable review alias https://review-dc43003-cms.dr-olaosebikan-git.pages.dev. Both require the owner's Cloudflare Access sign-in. PR #2 remains draft: https://github.com/Abdudhi100/dr_olaosebikan/pull/2.

## Account and production boundary

- Cloudflare account `93ea26958f716fb50ef1022a81846d9b`; existing Pages project `dr-olaosebikan-git`; verified production branch `main`.
- Production deployment remains `716b93d3-95f3-4940-b7fb-b23be891e63c`, commit `aad73438939ecd2cf6d48a4bf0bd736852923b9d`. Custom domains remain `drolaosebikan.com` and `www.drolaosebikan.com`.
- Production configuration/source/domain fingerprint remains `4383b481b735267a8337fcdfb2aaa96dbe8db6de4762f70fdacf4688dc0cf330`. No project configuration, DNS, production environment variables or provider settings were changed.
- Actual unauthenticated requests receive HTTP 302 to the Pages-managed Access login; the authenticated owner browser receives HTTP 200. The account-wide Access applications API returns an empty list, which does not expose this Pages-managed boundary. This is not a claim to have independently inspected every identity rule or tested another authenticated identity.
- The preview artifact returns `X-Robots-Tag: noindex, nofollow, noarchive`; its artifact-only robots.txt disallows all crawlers. Production robots/header files were unchanged.

## Real Sanity demonstration

The owner-selected project is **Dr Olaosebikan Clinic**, ID `zavdffj8`, public dataset `production`. This dataset name does not connect it to the production website. The existing production Pages environment has no Sanity configuration. Saved owner authentication was used without exporting credentials to source, artifacts or logs. No paid feature or upgrade was enabled; the subscription plan is not independently verified by the returned project metadata.

Created exactly one nonmedical news draft, `drafts.clinic-review-nonmedical-dc43003-20261012`. The item states that it is a temporary technical publishing demonstration, contains no patient information or clinical advice, and uses no media. It passed the existing release policy without invented clinician approval. Sanity Actions published it at 04:37 UTC, transaction `cGeHeYc211LPnLYKCRum0C`; a public query returned its published ID and the eligible detail route `/insights/news/nonmedical-publishing-demonstration-20261012`.

The first real-content build failed because GROQ returned absent optional fields as null. Fixtures had omitted those fields. The correction normalizes missing object fields before policy validation, fingerprinting and generation, while retaining invalid array items for rejection. A regression test proves approved fingerprints remain consistent and required missing fields/invalid body items still fail closed. No type-check bypass was added.

The successful published build was uploaded only to preview branch `review-dc43003-cms`, deployment `0d7889d7-5b70-4c15-9527-f13c389be269`. Hosted checks verified the item body, Insights listing and sitemap. Sanity Actions then withdrew it at 04:45 UTC, transaction `cGeHeYc211LPnLYKCRuyu2`; the public query became empty. The CMS retains its unpublished draft for review.

A clean CMS-connected rebuild produced no demonstration detail route. Deployment `952ead69-684d-476e-b673-f2ba405fef55` replaced the review alias. The detail now returns 404, Insights has its empty state and the sitemap excludes the item. The superseded demonstration deployment was deleted after checking its exact preview branch/ID and the unchanged production deployment. A browser check with cache disabled confirmed the old unique deployment URL returns 404 / Deployment Not Found. Screenshots and transaction evidence are preserved.

This was a **manual authenticated CMS-to-protected-preview cycle** using the real Content Lake and real Pages deployments. No publish-triggered webhook or automatic deployment pipeline is configured. No production CMS routing was activated.

## Fresh checks and limits

Runtime: existing portable Node 22.16.0 / npm 10.9.2. Executable: `audit-artifacts/clinic-v2-m1-closeout/runtime/node-v22.16.0-win-x64/node.exe`. Wrangler 4.149.0 was reused from the existing local cache; no project dependencies or persistent system settings changed.

| Check | Actual result |
| --- | --- |
| `npm.cmd test` | Exit 0; 52 tests passed, including the new null-projection regression |
| `SANITY_CONTENT_MODE=sanity ... npm.cmd run typecheck -- --incremental false` | Exit 0 with real published CMS content |
| Protected review `npm.cmd run build`, published phase | First exit 1 exposed null fields; corrected build exit 0 |
| Protected review `npm.cmd run build`, withdrawn phase | Exit 0; demonstration detail absent |
| Default-mode `npm.cmd run typecheck -- --incremental false` after withdrawal | Exit 0; current empty-content route types regenerated |
| Published hosted browser checks | Exit 0; 32 route/viewport checks |
| Withdrawn hosted browser checks | Exit 0; 32 route/viewport checks |
| Final alias, retirement and unauthenticated boundary check | Exit 0 with browser cache disabled |
| `git diff --check` | Passed |

Hosted coverage: `/`, `/services`, `/about-dr-olaosebikan`, `/appointments/book`, `/contact-location`, `/faq`, `/insights` and the demonstration detail, each at 390/768/1440/1920. Checks covered status, one H1, metadata, no horizontal overflow, image loading, noindex headers, mobile navigation/Escape/focus restoration and in-memory booking preference handoff without URL data. No form submit button was clicked. Browser checks recorded zero POST requests and no page errors. Patient delivery stays disabled.

The initial published full-page captures did not wait for asynchronous off-screen image decoding. Some show temporarily blank media areas despite successful image loads. They remain as original evidence. Supplemental published homepage captures and the final withdrawn set wait for decoding; a scrolled viewport capture confirms media painting. No application media/crop/layout correction was made. Automated dimensions and visual inspection are not owner Figma acceptance or a complete assistive-technology audit.

Earlier 51-test, Studio, 68 default-route and 40 populated-fixture browser results are reused as prior evidence, not claimed as new runs. No broad M1-M5 audit or provider experiment was repeated. Nonfatal build warnings about multiple workspace lockfiles remain recorded.

## Exact change scope and next action

Application integration commit: `dbc1c5b7ab45776009c089a6d5212f366803acd8`. Runtime source delta: `scripts/prepare-editorial.mjs`; regression test: `scripts/publishing-policy.test.mjs`; this report is the documentation addition. Accepted page components, styles, original/review media, booking, provider, content JSON, dependencies and release configuration are unchanged from dc43003. The original workspace remains untouched.

For each preview build, only verified Access evidence and actual production branch were temporarily recorded in the build configuration; the file was restored byte-for-byte in finally. All clinical/media/booking release flags remained false. Artifact-only changes were `_headers` and `robots.txt`. Public project/dataset IDs were saved in ignored `studio/.env.local`; it contains no credential. Root CMS ingestion remains opt-in.

Remaining release gates: owner approval of professional claims, clinical wording, contacts/domain and media rights/placements; privacy, retention, recipient binding, abuse controls and end-to-end patient delivery (or approved contact-only behavior); hosted visual acceptance; confirmation of the intended Sanity Free subscription and a securely scoped automatic publishing/deployment workflow if required. No approval was inferred from successful technical checks.

Next action: review the protected preview and checked continuation package, record the outstanding approvals, then configure only the approved publishing/release path. Keep PR #2 draft and production unchanged until those conditions are met.
