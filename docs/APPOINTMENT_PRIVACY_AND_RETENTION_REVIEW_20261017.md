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

## Final approval decisions still required

| Decision | Proposed safe starting point | Status / evidence to collect |
| --- | --- | --- |
| Responsible clinic controller | Identify the accountable legal person or entity, privacy contact and authorized staff; do not assume that the treatment venue automatically controls this website | **Pending** — written confirmation |
| University mailbox permission | Confirm institutional mailbox policy permits private medical-clinic administrative enquiries, access controls, MFA, account longevity and staff delegation | **Pending** — authorized owner/institution |
| Purpose and legal basis | Scheduling-only, no marketing, no patient record created; determine suitable lawful basis and any conditions for handling incidental health data | **Pending** — owner/legal |
| Web3Forms retention | **Proposal:** select 30 days if the actual plan and dashboard permit it; otherwise evaluate a different provider or deliberate manual deletion workflow before launch | **Pending** — plan settings and actual deletion test |
| Email retention | **Proposal:** delete resolved scheduling emails after 30 days, subject to legitimate record-keeping/legal requirements; do not automatically delete clinical records under this rule | **Pending** — mailbox/admin permissions and written procedure |
| Access and audit | Restrict Web3Forms dashboard and institutional inbox to authorized people, enable MFA where supported, document incident response | **Pending** |
| Data processing and international transfers | Review Web3Forms processing agreement, subprocessors and transfers, Cloudflare routing and institutional email account handling; seek relevant Nigerian legal advice | **Pending** |
| Spam control | Use Web3Forms **hCaptcha** (supported on free plan) with mandatory verification in the dashboard and tested widget; honeypot only is not enough | **Pending** — screenshot of settings and valid/invalid CAPTCHA tests |
| Free plan limitations | Domain restriction / Turnstile may be paid-tier features; do not claim either is active | **Pending** — provider plan review |
| Privacy notice | Review draft with actual staff, storage, disposal, rights-request processes, international handling and consent/lawful basis | **Pending** — dated approval |
| Patient testing | Only synthetic data has been verified. Test controlled success, failure and uncertain results again once settings are finalized | **Pending** |

**Why these choices matter:** Web3Forms' [privacy policy, updated 13 July
2026](https://web3forms.com/privacy), says submission data may be retained
for a **maximum of three years** unless a shorter period applies or the
controller deletes it sooner. Its [pricing page](https://web3forms.com/pricing)
mentions configurable retention ranges; check the actual limits for this
form and plan in the dashboard rather than promising 30 days based on a
proposal. The older Web3Forms FAQ makes conflicting claims about storage;
use the newer 2026 privacy policy for planning unless the provider supplies
a newer written contract. Cloudflare incoming email forwarding and the
university inbox have their own separate retention behavior.

Web3Forms [hCaptcha documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha)
describes the free-plan hCaptcha integration and dashboard activation.
Its [honeypot documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection)
says a honeypot alone is **not recommended**. Implement provider-supported
challenge verification rather than introducing a client-only checkbox
without server validation.

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
3. Configure and test Web3Forms hCaptcha or an equally suitable provider-
   supported mechanism, including failure and repeated-submission behavior.
4. Record how old Web3Forms submissions, forwarded email copies and exported
   backups are deleted; avoid vague "deleted automatically" claims.
5. Check real operator access controls and patients' rights-request pathway.
6. Re-run unit tests, TypeScript, static export, link audit, and booking browser
   behavior; confirm form action still fails closed until all approvals exist.
7. Explicitly approve controlled enablement. **Do not change the public main
   branch or disable Cloudflare Access as part of draft review.**

The safe fallback is **contact-only appointments** until policy and
technical controls are complete.
