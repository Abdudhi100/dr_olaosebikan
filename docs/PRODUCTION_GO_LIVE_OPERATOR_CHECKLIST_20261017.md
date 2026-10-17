# Dr Olaosebikan — owner-operated production go-live checklist

**Updated 17 October 2026. Status: NOT APPROVED / DO NOT DEPLOY.**
Source: [draft release PR #28](https://github.com/Abdudhi100/dr_olaosebikan/pull/28).
Use this practical sequence with the real Cloudflare, Web3Forms and Sanity
accounts. Do not place passwords, webhook URLs, university-mailbox destination
addresses, session cookies, or private patient details in GitHub.

## Verified since the checklist was drafted

- **Current release candidate:** `release/clinic-v1-readiness-20261017`
  commit `a847bc11e85683b316db8653a9db37829db85c97` before
  documentation/evidence updates, draft PR #28, all two CI jobs passed.
  Review this PR's latest CI again after any new commit. Production `main`
  remains `aad73438939ecd2cf6d48a4bf0bd736852923b9d`.
- **Cloudflare Pages:** authenticated dashboard confirmed `main` production
  branch, `npm ci && npm run build`, output `out`,
  `SKIP_DEPENDENCY_INSTALL=true`, runtime Node 22.16.0 in the build log.
  Release candidate was successfully deployed to protected preview
  `https://b32ce493.dr-olaosebikan-git.pages.dev/` (commit `a847bc1`);
  unauthenticated requests receive the Access login.
- **Domains completed:** both custom domains Active, SSL certificates Active;
  saved zone rule `Canonical apex to www` is enabled (301,
  `https://drolaosebikan.com/*` →
  `https://www.drolaosebikan.com/${1}`, preserve query on).
  Test browser navigations from apex HTTPS and HTTP reached secure www and
  preserved path/query. Zone `Always Use HTTPS` was enabled and confirmed.
  `canonicalDomainConfirmed=true` now records this domain-only evidence;
  it is not launch approval. Minimum TLS was previously shown as TLS 1.0,
  and HSTS was not changed.
- **Authenticated hosted acceptance:** homepage, Services, About,
  Booking, Contact, FAQ, Insights and one condition page navigated
  successfully; contact details, duration (45 minutes) and fail-closed
  booking controls verified. Videos were not seen in this preview because
  the `NEXT_PUBLIC_CLINIC_HERO_PREVIEW` switch gates decorative footage;
  the approved stills are a legitimate fallback, not a proven media failure.
- **Responsive evidence:** `docs/figma-review/browser-results.json` records
  17 local exported routes × four widths (390, 768, 1440 and 1920 px),
  with no horizontal overflow/broken images, plus a mobile navigation
  interaction test in `scripts/verify-clinic-browser.cjs`. These results
  describe an earlier local export; latest hosted real-phone owner acceptance
  remains outstanding.
- **Booking and privacy:** real submissions are still **off**.
  Web3Forms provider documentation says server-side spam checking and
  IP-based rate limits apply, but the actual form's account settings,
  retention, authorized mailbox handling and controller approval have
  **not** been authenticated or accepted.
  See `docs/BOOKING_PRIVACY_OPERATOR_DECISION_20261017.md`.

## Already completed in source / do not redo without a changed requirement

- 45-minute consultation length now agrees across public page and service data.
- Professional description, clinical wording, media and public contact details
  recorded as owner-approved in `config/clinic-release.json`.
- Owner confirmed `contact@drolaosebikan.com` email reception and a fictional
  Web3Forms → Cloudflare Email Routing → receiving mailbox test.
- CI for original release snapshot `a935b3875c253ad69e03916071eb1498ede51e73`
  succeeded: root tests, TypeScript, static export, links, Studio build,
  simulated publish and withdrawal. Check this PR's latest CI after any edit.
- User experience choice: **no mandatory hCaptcha** and **no custom 30-day**
  submission-retention setting. These are not reasons to delay launch;
  accurately documenting and verifying provider/mailbox defaults still matters.

## A. Accept the latest protected visual preview

1. Cloudflare → Workers & Pages → existing `dr-olaosebikan-git` project.
2. Inspect the most recent deployment of `preview/clinic-20261014`. The
   owner previously protected the preview with Access. Read-only external
   checks on 17 October encountered `login_required` for
   `https://preview-clinic-20261014.dr-olaosebikan-git.pages.dev/`.
   Verify in the authenticated dashboard that the **latest target commit**
   was actually built and that the Access policy covers every preview alias.
3. Test phone and desktop on homepage, services, rheumatologist profile,
   appointment page, contact, FAQ, insights and clinical-condition pages.
   Check navigation, WhatsApp/telephone/mailto links, hero video playback,
   media rights, 45-minute details, mobile overflow, keyboard and contrast.
4. Screenshot/record acceptance of the hosted version, not just local CI.

## B. Check Cloudflare Pages build and domain

1. Check this project's production branch is **`main`**. Existing output
   `out`, Node **22.16.0**, build **`npm ci && npm run build`**,
   `SKIP_DEPENDENCY_INSTALL=true`. Verify production environment settings.
   **Never set `CLINIC_REVIEW_BUILD=1` in Production.**
2. Both https://www.drolaosebikan.com/ and https://drolaosebikan.com/
   were accessible in external checks on 17 October. But the apex returned
   its own page rather than forwarding to the canonical `www` hostname.
3. To fix in the Cloudflare zone, review existing rules then create a
   **Rules → Redirect Rules → Single Redirect** rule using the documented
   wildcard example:

   | Field | Intended configuration |
   | --- | --- |
   | Request URL | `https://drolaosebikan.com/*` |
   | Target URL | `https://www.drolaosebikan.com/${1}` |
   | Status | `301` permanent |
   | Preserve query string | **Enabled** |

   Also check that HTTP → HTTPS is handled (for instance, existing
   Cloudflare HTTPS redirect setting) and does not form a loop. Keep paths,
   trailing slash and queries intact. Do NOT redirect `www` back to apex.
   Cloudflare's official example:
   https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-root-to-www/
4. Validate browser redirects for both root and a real detail path with
   query parameters; check certificates, canonical tags, og images, sitemap
   and `robots.txt`. Record evidence before changing
   `canonicalDomainConfirmed` from false.

## C. Decide first-launch appointment mode

### Online booking requests (preferred only after operator approvals)

- Open the real Web3Forms form settings and **record** the selected spam
  filtering and provider-default retention. No mandatory challenge is
  requested. Public Web3Forms policy describes default retention of **up to
  three years**. The free dashboard's **30-day submission-history view is
  not proof of deletion**. Approve a purpose-based reasonable retention
  decision, an erasure process, and separate receiving-inbox procedures.
- Review the designated clinic contact/controller, authorized receiving
  staff, institution mailbox permissions, MFA, legal processing basis,
  clinic reply process, incidental medical disclosures and cross-border
  handling. Have the responsible operator approve a factual privacy notice;
  remove the `PRELAUNCH REVIEW / NOT YET APPROVED` label only after actual
  approval. Do not claim provider/mailbox settings that are not verified.
- Configure the public Web3Forms access key in the correct **Production**
  environment (it is a public form identifier, not a private server secret).
  Confirm it is bound to the approved clinic recipient.
- After approval, update release JSON with real evidence:
  `booking.enabled=true`, `booking.privacyNoticeApproved=true`,
  `booking.retentionApproved=true`, `booking.rateProtectionVerified=true`,
  `booking.privacyNoticePath=/appointment-privacy`, and related
  `evidenceReferences`. Keep the public form disabled until then.
- Test synthetic accepted/rejected/unconfirmed delivery, throttling/spam
  response, duplicate prevention and forwarded mailbox receipt. Confirm
  submitted data does not contain clinical-reason/freeform-note fields.

### Contact-only launch (smaller launch scope)

- Keep `booking.enabled=false`. Verify that every contact CTA reliably
  shows a clear phone, WhatsApp and email option; no disabled button should
  imply it sent a request. After acceptance set
  `booking.contactOnlyFallbackApproved=true` and record evidence.
  Do not say the appointment form works online when it is disabled.
- Bookings can be added through a subsequent separate approved release.

## D. Editorial CMS decision

- For day-one weekly publishing: confirm real **hosted Studio URL** for
  existing Sanity project `zavdffj8`, dataset `production`, editor
  access and published-only queries. In Cloudflare, verify
  `SANITY_CONTENT_MODE=sanity`, `SANITY_PROJECT_ID=zavdffj8`, and
  `SANITY_DATASET=production` for the intended environment. Configure a
  private preview deploy hook and published Create/Update/Delete events,
  and test real owner-approved publish and withdrawal. **Never commit a
  deploy-hook URL** or a Sanity author token.
- If day-one publishing is not critical, explicitly accept the existing
  honest empty-state Insights approach. Defer Studio hosting, webhooks
  and publishing integration to their own post-launch release.

## E. Release trigger and rollback

1. Record authenticated preview screenshots and exact deployment commit.
2. Record verified domain, appointment mode, any relevant privacy/CMS
   sign-offs, and the fully green latest PR checks.
3. Update `config/clinic-release.json` only when each real gate is met:
   currently `releaseStatus=pending`,
   `canonicalDomainConfirmed=false`,
   `booking.enabled=false`,
   `booking.contactOnlyFallbackApproved=false`.
   The build blocks an unapproved production release.
4. Record owner-authorized `releaseStatus=approved` and the evidence;
   review final CI. Then and only then merge [PR #28](https://github.com/Abdudhi100/dr_olaosebikan/pull/28)
   to `main`, whose deployment can be automatic. This document is NOT
   that approval.
5. Confirm www HTTPS, apex 301, full site routes, contact actions,
   actual authorized form submissions if enabled, sitemap/indexability,
   Sanity if enabled, and error/rollback behavior immediately on the live
   deployment.
6. Old production commit: `aad73438939ecd2cf6d48a4bf0bd736852923b9d`.
   Keep an accessible previous Cloudflare Pages production deployment and
   prepare rollback/redeploy through the account. A source revert is not
   an acceptable unplanned substitute for an authenticated Cloudflare
   rollback test.

**Current limitation:** Cloudflare dashboard and Access-authenticated preview have now been examined, but Web3Forms and Sanity account settings have not been verified live. Actual latest-hosted phone-viewport/video playback signoff and patient-data retention/privacy approval remain missing. Only a duly authorized clinic operator may confirm those operational decisions; preserve evidence without exposing patient data or credentials.
