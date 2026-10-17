# Dr Olaosebikan — Sanity CMS and Cloudflare Pages launch handover

**17 October 2026 — staged configuration, not production approval.**

## Verified project continuity

- Sanity owner project: **`zavdffj8`**; dataset **`production`**, public published content only.
- Existing real Sanity publish → manual Cloudflare deploy → verification → withdrawal
  was previously completed by the owner. **The automatic published-content
  webhook and current live Studio URL are not yet verified.**
- GitHub: `Abdudhi100/dr_olaosebikan`; existing protected preview branch
  `preview/clinic-20261014`, production `main`.
- Pages project: `dr-olaosebikan-git`, static output `out`,
  `npm ci && npm run build`, Node `22.16.0`.
- No separate Sanity project or premium plan is required. Sanity Studio is
  a standalone app under `studio/`. Do not mount the editor publicly in the clinic website.
- The existing shared policy prevents publishing unapproved clinical work,
  unsafe links/media, unverified publications and unauthorized achievements.
  Written clinician approval must be genuine for each exact content fingerprint.

## 1. Confirm an editing interface

From an authenticated local terminal with Node 22.16 or newer, in this repo:

```powershell
npm ci --prefix studio
npm run typecheck --prefix studio
npm run build --prefix studio
npm run deploy --prefix studio
```

Sanity Studio project and CLI files now default to `zavdffj8` and
`production` (both are non-secret public identifiers). The CLI will ask
the signed-in account to pick or create a Studio deployment hostname. If one
already exists, reuse it: avoid a duplicate dashboard. Save the actual
`https://<chosen-hostname>.sanity.studio` URL in the owner's private
operating notes. If no account session exists, first run
`npx sanity login` from the `studio/` directory. Do not share passwords
or login tokens.

**Important:** Studio sign-in privileges and editing permissions do not mean
every Sanity document is publicly safe. This project uses a public dataset and
must never store patient names, test results, signed permission documents,
private approval evidence or appointment records.

## 2. Enable CMS data in Cloudflare Pages

In the **existing** Pages project `dr-olaosebikan-git` → Settings →
Variables and secrets, configure both Preview and, after approval,
Production environments:

| Variable | Value |
| --- | --- |
| `SANITY_CONTENT_MODE` | `sanity` |
| `SANITY_PROJECT_ID` | `zavdffj8` |
| `SANITY_DATASET` | `production` |

The dataset was created public, so the published perspective does not
require `SANITY_API_READ_TOKEN`. Never configure read/write authoring tokens
as `NEXT_PUBLIC_...`. No automatic changes to Cloudflare have been made
by this commit; owner must verify actual dashboard values.

Existing build-time `scripts/prepare-editorial.mjs` queries
`_type` in editorialEntry, researchPublication and professionalAchievement,
excludes drafts/versions and checks all source data using shared publishing
policy. Any malformed API response, CMS error or unsafe published content
**fails the new build** instead of publishing partial or fabricated content.
Existing successful Pages deployment stays available if a new build fails.

## 3. Automatically rebuild on Sanity publishing

**Never place a Cloudflare Deploy Hook URL in this public repository.**
Cloudflare's Deploy Hooks are effectively bearer secrets.

1. In Cloudflare Workers & Pages → `dr-olaosebikan-git` → Settings → Builds →
   **Add deploy hook**. Select exactly the correct branch:
   initially `preview/clinic-20261014` for tests, later `main` for
   production publication.
2. In <https://www.sanity.io/manage> choose `zavdffj8` → API → Webhooks.
   Add an outgoing webhook with method **POST**, request URL equal to the
   hook from step 1, dataset `production`, and Create / Update / Delete
   events enabled.
3. Paste the predicate in `publishing/sanity-webhook-filter.groq` into
   Sanity's Filter field. Never include `*[` or `]`; don't filter by
   `publicationStatus == "ready"` because withdrawn/deleted documents also
   need removal builds.
4. Keep **draft and release-version events OFF**; Sanity's default published
   events are sufficient. Projection should contain no patient or private
   content. A constant small payload such as `{"source": "clinic-publishing"}`
   is adequate for Cloudflare, which merely needs a POST trigger.
5. Save. Trigger a Sanity **published** Create/Update or Delete event for
   a genuine owner-approved entry and confirm Cloudflare deploy succeeded.
   Cloudflare hook HTTP 200 is **not proof** the website build succeeded.
6. Verify the resulting full-URL detail page, home cards, metadata,
   sitemap, and no stale withdrawn records. For an unpublish, verify the
   removed detail URL really returns 404 on the current deployment.
7. On launch, make the production webhook target the **main branch** hook.
   Disable the temporary Preview hook if not required. Never reuse the
   Preview-only hook as a production trigger.

Cloudflare documentation: <https://developers.cloudflare.com/pages/configuration/deploy-hooks/>  
Sanity docs: <https://www.sanity.io/docs/content-lake/webhooks>

## 4. Owner's weekly publishing process

Articles, videos and clinic news → `editorialEntry` in Studio.
Verified research → `researchPublication`.
Verified awards, milestones and recognitions → `professionalAchievement`.
For images use Sanity image uploads. Videos in this MVP use a real approved
YouTube or Vimeo URL plus ID, captions, transcript and rights-cleared poster,
not an arbitrary raw upload that the frontend cannot display.

Do not mark Ready / Publish unless exact source, media rights and approval
status is recorded. Medical articles and videos require specific review
with matching content SHA-256 fingerprint and non-secret evidence reference.
A nonclinical announcement can use its permitted review-exemption pathway.
After publishing, confirm the complete build and live page; if withdrawn,
confirm the live URL is removed.

## 5. Before promoting the protected preview to production

The `main` branch currently has **not** received the reviewed website
design and safety changes. Merging into `main` would start a public Pages
deployment. Therefore do NOT merge preview→main until:
- owner visually accepts the authenticated preview and its actual content;
- `www.drolaosebikan.com` custom domain, apex redirect, HTTPS, canonical,
  DNS and robot indexing behavior are verified;
- Sanity's hosted Studio and automatic publish/unpublish build work with
  **published-only** content;
- clinic owner confirms retention/deletion rules and Web3Forms spam controls;
- legal/privacy notice is finalized and displayed without DRAFT label;
- decide between **contact-only launch** and **approved live appointment form**;
- confirm any form sends administrative details only and that the clinic
  controls the university inbox;
- release configuration and verification references are updated coherently,
  CI is green, rollback point is recorded, and release owner explicitly
  approves the actual live deployment.

For contact-only launch, leave `booking.enabled:false` and approve the
working phone/email/WhatsApp fallback; the existing general release gate
supports this. For online booking, finish hCaptcha, a verified retention
policy and approved privacy notice first; only then enable real transport.
The synthetic site→Web3Forms→Email Routing→university inbox test is already
complete, but it is not proof of compliance or consent for patient data.

No deployment or live CMS account action has been carried out by this file.
