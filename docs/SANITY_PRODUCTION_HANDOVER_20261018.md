# Sanity publishing — production handover after the 17 October launch

**Reviewed 18 October 2026.** This document describes the actual production
code state, distinguishes verified facts from dashboard tasks, and is deliberately
**not** a command to merge or redeploy production.

## Current verified baseline

- The clinic website is publicly deployed at
  `https://www.drolaosebikan.com/`, from GitHub `main`.
- Latest approved `main` release at the time of this handover:
  `9932ad16eb1ace159fa01f0cf645946bef919e1a`; Cloudflare Pages build
  completed successfully on 17 October 2026.
- `config/clinic-release.json` on `main`: `releaseStatus=approved`,
  `booking.enabled=true`. Live booking and domain-approved policy exist.
  **Do not import the older pending release state from the preview branch.**
- Owner's confirmed live-form decisions: Web3Forms Basic-level Advanced Spam
  Filter, **no mandatory CAPTCHA**, provider retention displays **3 years**;
  routine forwarded appointment-notification email deletion after **12 months**.
  Web3Forms retention and receiving-mailbox deletion are different controls.
  No 30-day retention change has been approved for this live configuration.
- Existing Sanity owner project ID: `zavdffj8`, dataset `production`.
  The static site already contains the publishing schemas, validation, and
  build-time published-only fetching, but **production Cloudflare environment
  variables, hosted Studio URL, and live Sanity → Cloudflare webhook have not
  been independently verified in this repository**.
- The separate protected preview remains for testing and does not supersede
  live production. The pending draft review PR #27 is not a production release.

## First: read-only CMS preflight in GitHub Actions

The workflow `.github/workflows/sanity-published-preflight.yml` is built to
query the existing **published** Sanity dataset, validate each public entry,
generate a static website locally in GitHub Actions, and check internal links
**without deploying or mutating any content**. It prints record counts only,
never drafts or confidential source records.

This is the safest first check. The same read-only workflow also
typechecks and builds the **standalone Studio locally**, without account
credentials or publishing an editor. The live published-only query on 18
October 2026 completed successfully but returned **zero** editorial entries,
**zero** research records and **zero** achievements. This is an empty CMS
state, not missing website records or proof automatic publishing works.

If it fails, inspect the failure (query
permission, schema validation, missing source/rights, or unsupported HTML)
**before setting production Cloudflare environment values**. An empty result is
a valid empty site, not proof that new publications will be automatically
published.

## Second: deploy or verify the existing Sanity Studio

The public project ID and dataset are already configured in
`studio/sanity.config.ts` and `studio/sanity.cli.ts`, so do **not** create a
new Sanity project, a new dataset, or a second public website.

Use a **new, separate working folder** in PowerShell. Do not update, overwrite
or run Git operations in the user's original `C:\Users\user\doctor_project`
checkout:

```powershell
git clone --branch main https://github.com/Abdudhi100/dr_olaosebikan.git C:\Users\user\doctor_project_launch
cd C:\Users\user\doctor_project_launch
npm ci --prefix studio --legacy-peer-deps
npm run typecheck --prefix studio
cd studio
npx sanity login
npm run deploy
```

Choose a different new folder if `doctor_project_launch` already exists.
The Studio's existing lockfile has a known transitive peer-dependency
resolver mismatch under modern npm: use the previously CI-verified
`--legacy-peer-deps` install mode. This preserves the committed lockfile;
do not use a forced dependency upgrade or regenerate it during deployment.
Longer-term dependency upgrades require separate review.

These commands require a signed-in Sanity account; they do not create a new
Sanity project or dataset. Studio deployment is an account-level change:
inspect an existing hosted Studio before accepting a new hostname.

The authenticated Sanity CLI may show an existing hosted Studio to reuse or
prompt for a unique Studio hostname. Accepting an arbitrary second hostname
would create a duplicate editor; first inspect any existing deployment in
the Sanity project dashboard at <https://www.sanity.io/manage> → project
`zavdffj8`. **Do not share sign-in tokens in chat.** When deployed, record
the actual Studio URL; never invent a `*.sanity.studio` address.

Confirm the editor shows:
- **Articles, videos & clinic news**
- **Verified research publications**
- **Verified professional achievements**

Article/video/news documents require genuine source, media rights, public-safe
content and clinical approval rules before publication. Research needs accurate
paper metadata and verifiable source. Images are Sanity media assets; full
hosted videos require approved YouTube/Vimeo metadata, captions and transcript.

## Third: enable Sanity data only after passing preflight

Cloudflare Workers & Pages → project `dr-olaosebikan-git` →
**Settings → Variables and Secrets**: inspect the **Preview** environment first.
Set all three *together*:

```
SANITY_CONTENT_MODE=sanity
SANITY_PROJECT_ID=zavdffj8
SANITY_DATASET=production
```

The existing dataset was reported public for approved CMS content. Its
published query should not need a secret API token. Do not put Sanity
write tokens or private clinic data into frontend environment variables.

Redeploy the **Access-protected preview** to check the published content
before copying those same three values into **Production** and initiating an
approved production redeploy. A successful Cloudflare webhook POST or build
trigger does NOT establish completed deployment.

## Fourth: automatically publish and withdraw content

After the production Pages build with `SANITY_CONTENT_MODE=sanity` is
verified, create a **Cloudflare Pages Deploy Hook** in the existing project
with branch **main** (not the protected review branch); its URL is a
sensitive deployment trigger, so never put it in GitHub, Sanity document
content, chat screenshots or emails.

In Sanity Manage → project `zavdffj8` → API → Webhooks:

- Destination: the private Cloudflare Pages Deploy Hook URL, method POST.
- Dataset: `production`; events: published document Create, Update,
  Delete; avoid draft/versions events.
- Filter expression from `publishing/sanity-webhook-filter.groq`:

```groq
_type in ["editorialEntry", "researchPublication", "professionalAchievement"]
```

Do **not** filter only `publicationStatus == "ready"`, because unpublishing
or deleting records must also cause a rebuild to remove pages and sitemap
links. A webhook does not instantly update a static site; it starts a build.

Make one **genuine, owner-approved, publicly safe** content change and
confirm actual deployment, public URL and metadata. Then unpublish a
disposable approved nonclinical record and confirm a fresh build removes the
detail page and sitemap entry. Never use real patients or false publications
for this test.

## Fifth: weekly operating practice

In the hosted Studio, select Article, Video, News, Research, or Achievement.
Create a draft, add genuine source and rights evidence, obtain the specific
clinical/content approval required by the schema, mark Ready, and Publish.
Check Cloudflare's new deployment ends in **Success** before considering it
live. For corrections or withdrawal, check the old URL is removed in the
current production deployment.

Sanity owns public editorial content only; clinic contacts, services,
medical details and appointment data remain outside the editorial dataset.

## Outstanding evidence before calling CMS finished

- The **actual** hosted Studio URL and an authenticated editor login.
- Evidence the `production` dataset is readable by Cloudflare as published.
- Preview/production environment variable screenshots (redact secrets).
- Sanity webhook and matching Cloudflare production Deploy Hook saved.
- Successful published change and removal on the live domain.

No further production-source merge or booking/retention change is required to
create Sanity's CMS integration. Keep rollback to the previous successful
Cloudflare production deployment available.

Official documentation:
- Sanity Studio deployment: https://www.sanity.io/docs/studio/deployment
- Cloudflare Pages Deploy Hooks: https://developers.cloudflare.com/pages/configuration/deploy-hooks/
