# Appointment privacy and retention decision pack — owner review

Prepared: 17 October 2026. **Status: DRAFT. Not clinical, legal or owner
approval. Never interpret this document as permission to enable booking.**

## Current verified technical situation

- Protected website, Web3Forms, Cloudflare Email Routing and the approved
  institutional destination delivered the **fictional** appointment test;
  owner confirmed receipt. This does not confirm a compliant patient workflow.
- Official public inbox: `contact@drolaosebikan.com`. The personal
  forwarding destination is not needed in public code or published policies.
- Release flags `booking.enabled: false`,
  `booking.privacyNoticeApproved: false`, `booking.retentionApproved: false`
  and `booking.rateProtectionVerified: false` remain in the repository.
  Changing Cloudflare environment variables alone cannot activate delivery.
- A **non-indexed, clearly labelled draft** is available at
  `/appointment-privacy` on the protected review site, linked from the
  appointment page for the owner's review. It is not a finalized promise to
  patients.

## Data minimization implemented now

The eventual Web3Forms POST payload contains only:

- Full name, telephone number, and virtual/in-person consultation type.
- Optional preferred date and time (Lagos/WAT) and optional contact email.
- Public Web3Forms form identifier, static subject, static sender label and
  a bot-check field.

The **clinical reason** and **free-text booking note** remain optional local
UI preferences and **are no longer transmitted** to Web3Forms. The user-facing
explanation clearly distinguishes these local entries from the actual email.
Do not add diagnosis, complaints, laboratory details or other sensitive data
to notification subjects, recipient addresses or URLs.

This is privacy-by-design risk reduction, not a guarantee visitors cannot
voluntarily provide sensitive details in a contact name or email.

## Owner's revised preference — no mandatory CAPTCHA or custom 30-day retention

On 17 October 2026 the owner explicitly preferred a frictionless form with
**no visible hCaptcha** and **no custom 30-day Web3Forms retention setting**.
This supersedes the earlier working proposal. The standard booking component
has been disconnected from the optional hCaptcha challenge; it therefore will
not require one if a future release separately enables booking. Existing
optional hCaptcha code is dormant for a possible later opt-in. The owner
previously confirmed administrative use of the university receiving mailbox;
its operator access, deletion and security practices still require review.

The provider publicly states that form-submission data is retained **up to
three years by default** unless deleted earlier or a shorter period is
selected. The free plan's **30-day history** is a dashboard viewing period,
**not** automatic deletion after 30 days. Our actual Web3Forms account
setting remains unverified. The forwarding inbox, trash and backups have
separate policies. No 30-day guarantee should be presented to patients.
The release configuration now uses `retentionTargetDays: null` to express
that no custom period has been selected, while leaving
`retentionApproved: false`. Nigerian data protection law requires retention
to be no longer than necessary for a lawful purpose, so we still need an
honest purpose-based retention decision before accepting live enquiries.

Web3Forms says it performs server-side spam checks on all submissions and
advertises free-plan spam controls. These defaults may offer a low-friction
starting point but cannot be assumed effective for this specific form.
The existing `botcheck: false` payload does not by itself prove meaningful
spam protection. The free plan's 250 monthly submissions can be exhausted
by spam. Review the actual settings, run synthetic acceptance/rejection tests,
and decide how to respond if abusive submissions occur. Keep
`rateProtectionVerified: false` pending that review.

Sources: [Web3Forms privacy](https://web3forms.com/privacy),
[pricing](https://web3forms.com/pricing),
[default server-side spam screening](https://docs.web3forms.com/getting-started/customizations/spam-protection)
and [Nigeria Data Protection Act 2023](https://ndpc.gov.ng/download/nigeria-data-protection-act-2023).

## Final approval decisions still required

| Decision | Proposed safe starting point | Status / evidence to collect |
| --- | --- | --- |
| Responsible clinic controller | Identify the accountable legal person or entity, privacy contact and authorized staff; do not assume that the treatment venue automatically controls this website | **Pending** — written confirmation |
| University mailbox permission | Confirm institutional mailbox policy permits private medical-clinic administrative enquiries, access controls, MFA, account longevity and staff delegation | **Pending** — authorized owner/institution |
| Purpose and legal basis | Scheduling-only, no marketing, no patient record created; determine suitable lawful basis and any conditions for handling incidental health data | **Pending** — owner/legal |
| Web3Forms retention | Prefer provider default; do not configure 30 days solely for this project | **Pending** — verify real account default, necessity, purpose and deletion options |
| Email retention | Review actual university mailbox retention independently | **Pending** — staff/admin and deletion procedure |
| Access and audit | Restrict Web3Forms dashboard and institutional inbox to authorized people, enable MFA where supported, document incident response | **Pending** |
| Data processing and international transfers | Review Web3Forms processing agreement, subprocessors and transfers, Cloudflare routing and institutional email account handling; seek relevant Nigerian legal advice | **Pending** |
| Spam control | No mandatory visible CAPTCHA; evaluate provider default filtering and basic botcheck without assuming strong protection | **Pending** — actual settings and synthetic abuse checks |
| Free plan limitations | Domain restriction / Turnstile may be paid-tier features; do not claim either is active | **Pending** — provider plan review |
| Privacy notice | Review draft with actual staff, storage, disposal, rights-request processes, international handling and consent/lawful basis | **Pending** — dated approval |
| Patient testing | Only synthetic data has been verified. Test controlled success, failure and uncertain results again once settings are finalized | **Pending** |

**Why these choices matter:** Web3Forms' [privacy policy, updated 13 July
2026](https://web3forms.com/privacy), says submission data may be retained
for a **maximum of three years** unless a shorter period applies or the
controller deletes it sooner. Its [pricing page](https://web3forms.com/pricing)
mentions configurable retention ranges; confirm the active form default
before publishing a factual notice. Do not confuse 30-day dashboard history
with a 30-day deletion setting. The older Web3Forms FAQ makes conflicting claims about storage;
use the newer 2026 privacy policy for planning unless the provider supplies
a newer written contract. Cloudflare incoming email forwarding and the
university inbox have their own separate retention behavior.

Web3Forms [hCaptcha documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha)
describes the free-plan hCaptcha integration and dashboard activation.
Its [honeypot documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection)
says a honeypot alone is **not recommended**. A visible challenge is a fallback option if spam becomes a problem,
not a mandatory requirement in the currently chosen launch design.

Applicable Nigerian reference materials include the
[Nigeria Data Protection Act 2023](https://ndpc.gov.ng/download/nigeria-data-protection-act-2023)
and [NDPC GAID 2025](https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf).
Review whether the data controller requires a DPO/contact, impact assessment,
specific legal bases or transfer safeguards; do not use this checklist
as a substitute for a professional privacy/compliance determination.

## Checklist before considering live booking

1. Obtain owner/clinic confirmation for every outstanding decision above,
   especially the university mailbox permission and actual retention.
2. Edit `/appointment-privacy` into a final factual, approved notice; only
   then set the appropriate privacy notice path in release config.
3. Inspect the active Web3Forms default spam controls, test acceptance and
   rejection with fictional data, and agree how to handle abuse. No visible
   hCaptcha is required by the owner's present preference.
4. Confirm and justify the actual provider-default retention (up to three
   years) and independently document mailbox and exported-copy deletion;
   do not imply free dashboard history controls erasure.
5. Check real operator access controls and patients' rights-request pathway.
6. Re-run unit tests, TypeScript, static export, link audit, and booking browser
   behavior; confirm form action still fails closed until all approvals exist.
7. Explicitly approve controlled enablement. **Do not change the public main
   branch or disable Cloudflare Access as part of draft review.**

The safe fallback is **contact-only appointments** until policy and
technical controls are complete.
