# Dr Olaosebikan clinic — Web3Forms appointment verification

**Prepared 17 October 2026 · Do not use real patient information during testing.**

## What exists today

- The historic production `main` form uses a client-side POST to
  `https://api.web3forms.com/submit` with `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.
  It does not automatically imply a configured recipient in today's preview.
- The Access-protected preview has a more careful form with explicit field
  validation, narrow provider payload, no browser storage, retry protection,
  timeout/ambiguous-delivery handling, and a phone/WhatsApp fallback.
- `config/clinic-release.json` currently has `booking.enabled: false`.
  The live transport requires owner-approved recipient binding, privacy notice,
  retention, anti-abuse/rate protection and a controlled release.
- Incoming email routing has been reported verified for
  **contact@drolaosebikan.com**. That is NOT proof Web3Forms has a key
  bound to the same alias, or that a Web3Forms notification reaches its destination.
- Automated synthetic Web3Forms provider tests exercise the request/response
  contract with a fake key and fake network responses. They **never send email**.

## Phase A — provider email binding (owner-assisted)

1. Visit https://web3forms.com and create/verify a form access key for
   **contact@drolaosebikan.com**, or verify that an existing Web3Forms form
   has this exact recipient configured. Do not assume the historical form key
   still sends to the right inbox.
2. Follow Web3Forms' confirmation/verification message through Cloudflare Email
   Routing to the confirmed university destination. Check junk/spam.
3. Confirm in the Web3Forms settings that the intended receiver is the public
   clinic alias and review anti-spam protections (Web3Forms server-side checks,
   honeypot and hCaptcha where available). Domain restrictions might depend
   on the chosen plan. Do not claim a setting is enabled before verifying it.
4. Store the chosen access key in an appropriate Cloudflare **Preview**
   environment variable `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` only once a
   controlled live test is authorized. The Web3Forms access key is a public
   form identifier in client-side use, not a server-side secret, but avoid
   committing it in this public GitHub repository.
5. Do not change production `main`, `CLINIC_RELEASE`, `booking.enabled`,
   or preview Access permissions merely to make the provider test run.

## Phase B — first genuine provider notification, fictional data only

Use a separately approved test route or controlled browser test from the
authenticated preview once the test access key and safeguards are ready.
Use plainly fictional information; do not use an actual patient's name,
number, email, symptoms or records. Example values:

| Field | Synthetic value |
| --- | --- |
| Name | SYNTHETIC CLINIC TEST — NOT A PATIENT |
| Phone | +1 202 555 0147 (reserved fictitious number) |
| Consultation type | Virtual |
| Reason | Leave blank |
| Preferred date/time | Leave blank |
| Email | Leave blank |
| Booking note | SYNTHETIC TEST — DO NOT SCHEDULE |
| Subject | SYNTHETIC WEB3FORMS DELIVERY TEST |

The request should be submitted only **once** from the browser. Verify
Web3Forms' API response and actual receipt in the university destination
after Cloudflare forwarding; capture a timestamp and harmless test identifier,
not patient data. A provider JSON `success:true` response alone is **not**
proof the email reached the inbox. Check spam/junk and Web3Forms suppression
if necessary.

## Phase C — approval for real enquiries

These tasks are separate from the synthetic test:

- Approve an understandable clinic privacy notice that explains what is
  collected and transmitted, which third parties process or forward it,
  purpose, retention/deletion process, contact rights and international
  processing considerations as applicable. Obtain qualified legal/privacy
  review for Nigerian data-protection compliance where appropriate.
- Recognize that even a rheumatology **reason for consultation** may reveal
  sensitive health information. Limit free-text fields and ensure staff have
  an appropriate secure medical-record channel outside Web3Forms email.
- Confirm that the institutional destination mailbox is permitted to receive
  external clinic appointment enquiries and has appropriate access controls,
  MFA, retention and delegation practices.
- Decide whether form delivery is truly needed or if direct phone/WhatsApp/
  email with clear instructions is sufficient for first launch.
- Enable appropriate spam protection and confirm provider recipient settings;
  test honest acknowledgement vs failure/timeout, duplicate protection and
  contact-only fallback in the approved release.
- Keep `booking.enabled:false` until privacy, recipient, rate-protection and
  retention checks are evidenced. Public launch is a separate explicit action.

## Automated test

`npm test` includes `scripts/web3forms-contract.test.mjs`. It asserts:
allowlisted payload fields, exact client-side endpoint, one submission,
strict approval gates, correct handling of provider errors or ambiguous
responses, and disabled current release. This is not a live recipient test.

**Current state:** Web3Forms LIVE DELIVERY NOT YET VERIFIED; DO NOT ENABLE.
