# Hero video and Resources checkpoint ? 13 October 2026

Implementation base: `58fb1251ecc7527009659dfbd42aa273c9db72c9`; branch `fix/figma-fidelity-continuation-20261012`; draft PR #6.

Resources now exposes Insights & Media, Research & Publications, and Achievements & Recognitions on desktop, mobile and footer even when collections are empty. Content/publication rules are unchanged. The desktop disclosure uses ordinary links and native button keyboard behavior, Escape focus return, outside-click and focus-leave dismissal.

## Media boundary and page map

`src/lib/hero-media.ts` is the central selection and rights gate. `ClinicHeroVideo` renders existing posters and scrims first, then defers muted inline looping playback until intersection. Reduced motion and supported data-saving preferences suppress source creation/download. Playback failure or denied autoplay leaves the poster and removes the unavailable control. There is no provider, tracking, browser storage or patient-data integration.

| Existing hero | Selection / state |
|---|---|
| Home `/` | Existing neck poster and recovered six-second silent 720p neck clip, local review only |
| Services `/services` | Existing neck/shoulder poster and matching outdoor original, local review only |
| Specialist | Missing suitable professional-setting footage; genuine portrait and current hero preserved |
| Appointment booking | Missing consultation-preparation footage; form and heading preserved |
| Contact/location | Missing verified setting footage; existing background preserved |
| FAQ | Missing suitable educational footage; existing background preserved |
| Insights & Media | Missing suitable decorative educational/research footage; interviews are not decorative assets |
| Publications / Achievements | Missing scholarly/professional footage; existing backgrounds preserved |
| Clinical service pages | Knee assessment is a potential relevant candidate, but page-specific selection/composition and rights remain unresolved |
| Utility/error/detail pages | No new hero sections added |

Unapproved sources are never selected on a public hostname, including a preview hostname. Local review requires BOTH a loopback hostname AND `?heroVideoReview=1`. No video binaries were placed in public, out, Git or the review ZIP. When rights and final assets are approved, an explicit `approvedSource` and `rightsApproved` change is required. No asset permission is implied by this implementation.

## Local review

After building, run `node scripts/serve-hero-review.cjs "<absolute prepared neck-preview-720.mp4 path>" "<absolute 7297881-hd_1280_720_30fps.mp4 path>"`.

Open `http://127.0.0.1:4178/?heroVideoReview=1` and `http://127.0.0.1:4178/services?heroVideoReview=1`. Without the query, the ordinary poster-only page is shown. The server binds only 127.0.0.1, accepts only GET/HEAD, serves only two explicit media paths plus the static export, supports byte ranges, and uses no-store/noindex. It does not create a hosted preview.

## Performance and remaining asset preparation

The existing Home derivative is 736,062 bytes, six seconds, 1280?720 H.264 with no audio. The Services local-review original is 5,578,837 bytes and 16.383 seconds with an unused AAC track; this is NOT a release-optimized asset. A short silent 480/720p derivative, loop seam review and mobile crop acceptance remain necessary before release. No encoder was available in the checked tools/known locations; no package or system configuration was changed. WebM alternatives are optional, not yet generated. These are actual remaining preparation items, not completed optimizations.

No footage exists for several requested subjects. Their asset-dependent work is deliberately held, rather than using interviews, anatomical diagrams or unrelated stock indiscriminately. Home footage illustrates neck discomfort; its poster match does not establish that it is the desired long-term welcoming clinical subject.

For approved final assets, keep binaries outside Git and prefer R2 with a controlled custom domain and versioned object names/cache headers. [Cloudflare documents R2 as asset storage for Pages](https://developers.cloudflare.com/pages/tutorials/use-r2-as-static-asset-storage-for-pages/). Pages has a [25 MiB individual asset limit](https://developers.cloudflare.com/pages/platform/limits/), exceeded by one recovered interview. [Stream has paid storage/delivery pricing](https://developers.cloudflare.com/stream/pricing/); it is unnecessary to provision a paid streaming service for these two short decorative loops now. No R2 bucket, Stream subscription, custom domain or account setting was created/changed. Hosting cost/permissions must be approved before activation.

## Release gates

Usage rights and final subject/crop approval remain open. Existing clinical/contact/privacy/booking release gates, Sanity plan confirmation, automatic hosted publishing/withdrawal and hosted acceptance are not resolved by these local checks. Booking remains mock/non-network. Production is unchanged; PR #6 must remain draft. No patient submission was made.

## Fresh verification

Node 22.16.0: 60 unit tests, typecheck, 21-page default static build, 68 route/viewport checks, 40 populated editorial browser checks with publication/withdrawal exports, 13 video/navigation scenarios and git diff --check passed. The withdrawal test now correctly retains empty Resources destinations while still checking removal of withdrawn content and sitemap entries. Local evidence and offline gallery: visual-review-codex-20261012-video-resources/. No hosted or real-device acceptance is claimed.
