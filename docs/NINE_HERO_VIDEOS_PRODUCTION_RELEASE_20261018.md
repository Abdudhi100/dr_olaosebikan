# Nine approved hero videos — release checklist

**18 October 2026 · DRAFT PR ONLY · NOT YET DEPLOYED TO PRODUCTION**

Branch: `feat/nine-hero-videos-production-20261018`. Base production
commit: `9932ad16eb1ace159fa01f0cf645946bef919e1a`.
The user's instruction is to **prepare** production video activation on a
reviewed branch and run tests, **not** merge or deploy yet.
The existing public site retains still-image hero backgrounds.

## What the staged source changes do

- Next.js includes `NEXT_PUBLIC_CLINIC_HERO_PUBLIC=1` only in an approved
  Cloudflare Pages build where `CF_PAGES=1` and `CF_PAGES_BRANCH=main`.
- `CLINIC_REVIEW_BUILD=1` on a non-production Cloudflare preview retains
  the already-established `NEXT_PUBLIC_CLINIC_HERO_PREVIEW=1` review path.
  Do not open a protected preview until Cloudflare Access is verified on the
  exact deployment URL and asset paths. These are **build-time** selections.
- The code requires `rightsApproved` plus an approved MP4 source. Visitors
  cannot force videos on via `?heroVideoReview=1` from public domains.
- Desktop video at width 768px or more; smaller mobile derivative below
  768px. Still image/poster remains for every approved video.
- Reduced-motion, Save-Data, no visibility, autoplay rejection, missing asset,
  playback error and manual Pause must preserve the still fallback.
  No controls are shown for unplayable footage.
- The clinical intake form, Web3Forms delivery, Sanity publishing, canonical
  domains and public privacy notice are unaffected.
- Emergency switch: set `CLINIC_HERO_VIDEOS_DISABLED=1` **only in Cloudflare
  Production build variables**, then rebuild; the static site reverts to
  stills without changing appointments. Restore by removing this setting
  and rebuilding after review. It is not an instant runtime kill switch.

## All nine owner-cleared media assignments

| Page | Desktop | Mobile | Fallback |
| --- | --- | --- | --- |
| Home | `home-desktop.mp4` | `home-mobile.mp4` | `/images/figma/home-hero.webp` |
| Services | `services-desktop.mp4` | `services-mobile.mp4` | `/images/figma/services-hero.webp` |
| Appointment | `appointments-desktop.mp4` | `appointments-mobile.mp4` | `appointments-poster.webp` |
| Contact & Location | `contact-desktop.mp4` | `contact-mobile.mp4` | `contact-poster.webp` |
| FAQ | `faq-desktop.mp4` | `faq-mobile.mp4` | `faq-poster.webp` |
| Insights & Media | `insights-desktop.mp4` | `insights-mobile.mp4` | `insights-poster.webp` |
| Research Publications | `publications-desktop.mp4` | `publications-mobile.mp4` | `publications-poster.webp` |
| Achievements | `achievements-desktop.mp4` | `achievements-mobile.mp4` | `achievements-poster.webp` |
| Joint Pain & Stiffness | `joint-pain-desktop.mp4` | `joint-pain-mobile.mp4` | `joint-pain-poster.webp` |

All the non-Home/Services fallbacks above live under `public/video/clinic`.
The specialist portrait and rheumatoid arthritis, gout, lupus and
autoimmune disease pages **remain still**. No unrelated footage substituted.

## Pre-merge acceptance

1. Confirm **both** CI jobs on the **exact** proposed head commit pass.
   CI's unit suite must cover all nine files/MP4 headers and missing slots,
   main/preview/local emergency gates, and the unchanged Web3Forms fail-closed
   production check. A successful CI build alone does not prove video playback.
2. Validate the actual **Access-protected preview** with
   `CLINIC_REVIEW_BUILD=1` **only in Preview**, never in Production.
   Confirm login blocking for unauthenticated viewers and all video URL
   aliases. Do not expose private patient information in tests.
3. At **390, 768, 1440 and 1920px**, examine the nine routes: poster/video,
   crop/scrim contrast, text/buttons, nav, object-fit and no overflow. Confirm
   video files play with muted inline loop and pause/play controls.
4. Test Reduce Motion, Save-Data, offscreen lazy loading, blocked autoplay,
   missing video/network failure, and pause after scroll away/back. The
   fallback images must show and accessibility/navigation must remain usable.
5. Known previous *Home and Services* review issues: the ~4 s loop has a
   visible endpoint dissolve/ghosting, and Home 390px can crop the subject.
   The existing clips are not corrected in this PR. **Owner must accept
   these exact loops/crops or request re-editing** before enabling them.
6. The owner reviews and explicitly approves the protected-preview visual
   result; separately authorizes merging the exact CI-green commit to
   production. Keep production `main` unchanged until then.
7. After merge, verify Cloudflare Pages production main deployment and
   all nine routes, media requests, and the unchanged Sanity article and
   fictional Web3Forms request workflow. Rollback first by using the
   emergency build-time media switch; if needed restore the prior production
   commit. Never treat GitHub merge as proof of a live Pages deployment.

## Source of earlier review evidence

`docs/media-selection-20261014/LOOP_CROP_REVIEW.md` documents the known
seam/crop issues. `docs/CLINIC_HERO_MEDIA.md` records owner clearance and
earlier protected preview use. The mp4 derivatives and poster files are
already committed in `public/video/clinic`; no extra paid media service or
manual asset upload is needed.
