# Hero media continuation — 14 October 2026

Base: e3c072f8d96664c06c0b2b9db9a929cec927f1a0. Branch: fix/figma-fidelity-continuation-20261012. Draft PR #6.

## Implemented

Four silent H.264/yuv420p/25fps fast-start local review derivatives: Home desktop 359,994 bytes (1280×720), mobile 140,965 bytes (854×480); Services desktop 960,186 bytes (1280×720), mobile 410,420 bytes (854×480). Originals are preserved. Home is approximately 4.04 seconds; Services 3.84 seconds. A 0.16-second dissolve is visible on close inspection; final loop/crop acceptance remains an owner review item, not a seamless-loop claim. Original Home is 3,162,708 bytes with audio; Services is 5,578,837 bytes with audio. Encoding commands, source/output hashes and FFprobe streams are in ENCODING_FINAL_RESULTS.json.

The reusable component is integrated into 14 existing hero routes. Home and Services have matching review footage. The remaining 12 slots retain their existing backgrounds/portrait and expose no fake playback button. No new hero sections, clinical copy or invented clinic imagery were added. Mobile sources are selected below 768 pixels. Pause preference survives leaving and re-entering the viewport. Reduced motion, Save-Data, deferred loading, muted inline playback, failure fallback and public rights gates remain enforced.

## Page media register

| Page | Status / required asset |
|---|---|
| Home | Neck-discomfort footage matches current poster; local review only; confirm long-term subject and rights |
| Services | Outdoor neck/shoulder footage matches current poster; local review only; confirm rights |
| Specialist | Missing professional setting footage and approved poster; genuine portrait preserved |
| Appointment | Missing consultation preparation footage and approved poster; booking form untouched |
| Contact & Location | Missing verified setting footage and approved poster |
| FAQ | Missing suitable educational footage and approved poster |
| Insights & Media | Missing decorative research/education footage and approved poster |
| Publications | Missing scholarly footage and approved poster |
| Achievements | Missing professional footage and approved poster |
| Joint pain, rheumatoid arthritis, gout, lupus, autoimmune disease pages | Five individually mapped slots; condition-specific selection and poster approval missing |

## Follow-up — 16 October 2026

Secondary video heroes now share the Homepage's transparent header overlay and full-bleed media layering. The appointment breadcrumb and heading are inside the video host so the background also reaches behind the navigation. Specialist and non-joint condition heroes reuse the existing Services background in the explicitly gated preview build; their existing non-preview backgrounds remain unchanged. Video sizing uses full-container cover, and viewport resizing reselects the mobile source below 768 pixels. No new media, booking behavior, or release-gate configuration was added.

Utility/error pages receive no new motion. Recovered interviews require editorial review/captions/transcripts/permissions and are not substituted as decorative backgrounds. The knee assessment clip is only a potential relevant clinical candidate, not an approved assignment. The complete original inventory and project-location search are included in the review package.

## Review

Open the package index.html for offline videos and screenshots. For live page comparisons after a build:

    node scripts/serve-hero-review.cjs --media-dir visual-review-codex-20261013-video-completion/media-final

Then open http://127.0.0.1:4178/__hero-review. The gallery provides named pages, 390/768/1440/1920 widths, and poster/video comparison. It binds loopback only and serves GET/HEAD with no-store/noindex. Ordinary pages remain poster-only. Local playback requires a loopback hostname plus heroVideoReview=1. No video binaries enter Git, public or out. The local review ZIP contains the four optimized clips; it is not a publication licence.

## Rights and release checklist

For EACH source, record source URL/creator, licence/version and acquisition evidence; commercial/web/display rights; model/property consent where applicable; editorial/clinical suitability; approved crop/poster/loop; approver/date and restrictions/expiry. All public video approvals remain pending. File possession and stock-like appearance do not establish rights. The original inventory identifies filenames and recovered provenance, not proven licence grants.

External approvedSource/approvedMobileSource URLs are supported by configuration. R2 with versioned objects is a possible delivery option after cost/rights approval; no bucket, paid service or account configuration was provisioned. FFmpeg was acquired as a project-local portable build from gyan.dev (linked by ffmpeg.org); published checksum was verified. No persistent PATH or package changes.

## Cloudflare

Read-only evidence identifies an intentional release gate in automatic preview deployment 36a51f93-9376-41b3-be5b-44c330892d7e. Node 22.16.0/npm 10.9.2 and npm ci succeeded; Next configuration rejected the pending release. The existing project is dr-olaosebikan-git, production branch main. Config has privatePreviewAccessVerified=false and no production branch/evidence binding. Do not bypass the gate. Current Access protection is not freshly verified by this run.

Before a future preview: verify the exact Access application/policy and deny unauthenticated access to the preview and assets; record dated evidence and the actual main production-branch binding; approve only the non-production review build; retain mock booking and noindex; verify generated output contains no credentials; deploy only the authorized preview branch; repeat authenticated page/media checks and unauthenticated blocking. Keep production domains/settings unchanged. The Sanity dispatcher stays inactive pending signing, branch binding, idempotency and operational review. No public deployment, patient submission or production routing change occurred.

## Verification and limits

See the current review package for final logs and screenshots. Earlier reports remain historical and unchanged. Native Home 315:911 and Services 412:1959 were freshly inspected; existing native frames remain the visual references. Hero geometry, typography and posters were retained. Moving subject/crop and the short loop dissolve require human acceptance; populated editorial, real devices, hosted acceptance and rights approval are distinct gates. Clinical/contact/privacy approvals, Sanity plan and hosted automation remain open.

## Final command results — 14 October 2026

Node 22.16.0, npm 10.9.2 from the previously acquired portable runtime.

| Command | Exit | Actual result |
|---|---:|---|
| npm.cmd test | 0 | 62 tests passed |
| npm.cmd run typecheck -- --incremental false | 0 | Typecheck passed |
| npm.cmd run build | 0 | 21 static pages |
| node scripts/verify-clinic-browser.cjs | 0 | 68 route/viewport checks and interactions/privacy passed |
| node scripts/verify-hero-resources.cjs --media-dir visual-review-codex-20261013-video-completion/media-final | 0 | 14 scenarios plus comparison-gallery assertions passed |
| npm.cmd run test:export (CLINIC_TEST_POPULATED_BROWSER=1) | 0 | 40 populated browser checks, withdrawal, empty hub, navigation and sitemap checks passed; default export restored |
| git diff --check | 0 | No whitespace errors |

The ACCEPTED_* logs and accepted-site screenshots follow restoration of five corrupted punctuation occurrences in three files. FINAL_* logs/captures preceded that correction and are preserved as earlier evidence. Video and populated-content tests passed before this punctuation-only correction; they were not unnecessarily repeated. No transport, data mapping or editorial-policy changes occurred. No external requests or client errors were observed in the video/full-site harnesses.

Protected-file comparison: 398 tracked baseline files checked; 12 changed (11 application/test/review-server files plus this documentation), 386 unchanged. Public assets, clinical content JSON, booking form/validation/transport, dependency manifests, release configuration and deployment configuration remain byte-identical. Existing untracked owner files and the original workspace were not edited. Original media source hashes were rechecked.

Visual inspection: Home mobile and Services desktop retain native text/scrim positioning; motion changes subject position and the narrow Home crop remains deliberately tight. Paused, reduced-motion, Save-Data, failed playback and denied autoplay captures are included. Secondary pages retain their previous truthful copy and extra FAQ content; native total page heights are not a pixel-fidelity acceptance metric. No pixel-perfect, screen-reader, real-device, hosted-delivery or rights acceptance is claimed.

Remaining next action: owner review of the four clips/crops/dissolves; obtain suitable footage and posters for the 12 missing slots and record per-asset permissions. Then verify the current Cloudflare Access boundary and approve a branch-bound protected preview. Keep public playback, patient delivery and the Sanity dispatcher inactive until their independent gates are satisfied.

## Owner-authorized protected preview — 16 October 2026

The owner has explicitly confirmed that the supplied video assets are legally cleared and authorized their use on the website. This supersedes the historical rights-pending statements above for these supplied assets; no further media licensing research is requested. Playback is limited to the protected non-production preview. Production remains behind the existing release gate, and patient booking remains disabled.

The static export includes responsive desktop/mobile videos for Home, Services, Appointments, Contact & Location, FAQ, Insights, Publications, Achievements and Joint Pain. The optimized assets are served from `public/video/clinic` using the existing Cloudflare Pages setup. No paid media service or separate storage service was added. Other condition pages and the Specialist page retain their existing hero fallback rather than reusing footage without an appropriate match. Footage remains unassigned for Specialist, Rheumatoid Arthritis, Gout, Lupus and Autoimmune Disease.

The target preview branch is `preview/clinic-20261014`, with branch alias [preview-clinic-20261014.dr-olaosebikan-git.pages.dev](https://preview-clinic-20261014.dr-olaosebikan-git.pages.dev). Cloudflare deployed commit `9230782` successfully (deployment `64c12f72`). The latest preview requires the existing `CLINIC_REVIEW_BUILD=1` setting plus the recorded non-production branch and verified Access gate; the production branch remains `main`. Draft PR #9's failed deployment used a review-branch checkpoint that lacked the verified preview-gate configuration. The target preview branch includes that configuration and the PR changes.

Authenticated hosted-browser verification confirmed actual playback for all nine mapped pages at 390px and 1440px (18 checks), with muted looping playback and working pause/resume controls. Reduced motion and an unmapped condition route produced no video; there were no page errors or external requests. Unauthenticated requests to both the preview page and a video asset returned HTTP 302 to Cloudflare Access. The existing Access protection remains in place; production and patient-booking configuration were not changed.
