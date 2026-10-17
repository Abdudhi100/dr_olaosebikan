# Web3Forms appointment privacy and operational decision record

**Prepared 17 October 2026 · INTERNAL REVIEW · NOT APPROVED.**
This is a sign-off aid for the clinic operator, **not** the patient-facing
privacy notice, legal advice or authorization to collect patient information.

## Already fixed / previously accepted

- The clinic chose **no mandatory visible CAPTCHA** for the initial flow.
  Do not silently enable hCaptcha or force a paid plan.
- The clinic's preferred retention option is **Web3Forms provider default**,
  not a custom 30-day setting. Owner screenshots dated 17 October 2026 now
  show the clinic's form with **3 years selected**, but selection is not
  evidence of an approved lawful basis, deletion workflow or receiving-mailbox
  retention practice.
- Provider delivery was previously tested using **fictional** data only
  and the clinic's confirmed recipient binding. Real submissions remain OFF.
- The outgoing payload contains name, phone, consultation format and optional
  email/preferred scheduling fields; it deliberately excludes reason for
  consultation, free-text notes and all undocumented extra fields.
- Neither a Web3Forms access key nor a successful synthetic notification is
  a substitute for this policy approval.

## Actual form dashboard observations — 17 October 2026

The owner manually opened the **existing** Web3Forms account and supplied
screenshots of Form Details, Email Configuration, Spam & Security and
Advanced Options. Screenshots remain in the private conversation and MUST NOT
be uploaded to the public repository because they contain account identity
and form-specific information. The screenshots show these UI choices:

| Account field | Screenshot-observed state | Meaning |
| --- | --- | --- |
| Form | Dr Olaosebikan Appointment Form, Free plan | Correct account selected |
| Recipient Emails | `contact@drolaosebikan.com` (1/1) | Matches the clinic's approved address |
| CAPTCHA protection | **None** | Consistent with owner's no-visible-CAPTCHA preference |
| Advanced Spam Filter | **ON** | Filter toggle shown enabled |
| Spam Protection Level | **Basic** | Do not claim verified volumetric/rate-limit resilience |
| Restrict to Domains | Blank; **Pro**-only | Not available on present free plan |
| Auto Responder | **OFF** | No automated confirmation email enabled |
| Email grouping | OFF | Separate notifications expected; not tested |
| Email template | Default | Standard clinic notification |
| Data retention policy | **3 years** selected | Actual form UI observed; mailbox copies may persist separately |
| Monthly usage | **2 / 250** | Historic synthetic submissions; not a quota guarantee |

**Limitations:** Screenshots do not prove settings were persisted by pressing
Save Settings, nor actual IP-based rate limits, the provider's deletion
workflow, receiving inbox retention, account access controls, or clinic
privacy/legal signoff. A selected **3 years** is potentially disproportionate
for basic appointment scheduling unless the clinic documents why it needs
that long. The selected period should remain unchanged pending that decision,
not silently shortened or treated as approved.

The Form Details "Website URL" uses an unprefixed non-`www` address; when
this form is actually activated, update it to
`https://www.drolaosebikan.com/appointments/book` if the dashboard accepts
a full URL. This is account metadata, not proof that external submissions
are restricted to that domain.

The optional "Intro Text" control appears enabled in a Free account despite
being marked **Pro**; do not claim the paid feature is operational.
Integrations and linked account/team access were **not shown**.

**Initial release track remains CONTACT ONLY.** No Web3Forms form is rendered
in the approved-to-test website source; `booking.enabled=false`.
Do not set `retentionApproved`, `rateProtectionVerified` or
`privacyNoticeApproved` true from these screenshots.

## Current provider evidence (external documents)

1. Web3Forms homepage describes **submission retention of up to three years
   by default**, configurable as short as seven days per form, automatic
   deletion at the end of the selected period. The free dashboard's
   30-day *view* is not a deletion guarantee.
   Source: https://web3forms.com/
2. Web3Forms says it conducts **server-side spam checks by default**:
   https://docs.web3forms.com/getting-started/customizations/spam-protection
3. Web3Forms describes **temporary per-IP rate limits**, generally released
   after around an hour:
   https://docs.web3forms.com/getting-started/troubleshooting
4. Provider's honeypot help now labels this protection **deprecated and less
   effective**, so `botcheck:false` should not be described as meaningful
   independent bot protection:
   https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection
5. Provider docs say **domain allowlisting is a paid-plan feature**:
   https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain
6. An older FAQ page says submissions are not stored, conflicting with the
   more detailed current public retention description. Until the **actual
   form dashboard settings or support** establish otherwise, do not rely
   on that outdated FAQ statement:
   https://docs.web3forms.com/getting-started/faq

These are **provider-published claims**, not independently tested security
service-level guarantees or proof of the clinic's account configuration.

## Operator verification — record date, evidence and accountable person

| Decision | Evidence required | State |
| --- | --- | --- |
| Web3Forms correct form | Existing account screenshot confirms clinic form and recipient; prior fictional delivery test was owner-reported | **OBSERVED / RECIPIENT MATCHED** |
| Provider retention | Selected **3 years** confirmed on screenshot. Still need saved-setting confirmation, clinic justification, deletion/erasure workflow and owner approval | **UI OBSERVED; APPROVAL PENDING** |
| Email retention | Confirm accessible receiving-inbox retention/deletion, backups where applicable, how long enquiry emails are kept, and who can perform deletion | **PENDING** |
| Controller and contact | Record responsible clinic/legal entity, a reachable privacy contact, and authorized users of forwarded private-clinic email | **PENDING** |
| Legal basis and transparency | Clinic approves a lawful ground for collection, international processing arrangement, patient rights and incident protocol | **PENDING** |
| Spam/rate handling | Screenshot shows Advanced Spam Filter ON, Basic level, CAPTCHA None, domain restriction Pro-only. Rate limiting and contingency untested | **SETTINGS OBSERVED; APPROVAL PENDING** |
| Scope/data minimization | Continue excluding diagnosis/reason/free text, attachments, patient records, symptoms from provider requests; confirm content is administrative only | **CODE CONTROL VERIFIED; OPERATOR REVIEW PENDING** |
| Patient privacy notice | Replace the review-only copy only after complete clinic signoff, correct the public label, path, and effective wording. Current /appointment-privacy is draft/noindex | **PENDING** |
| Clinical workflow | Verify who monitors the inbox, safe response time, fee/appointment confirmation, identity checks before further medical information | **PENDING** |

## Exact release switch sequence (do NOT apply yet)

1. Clinic operator records the above evidence and signs off the final
   wording of `/appointment-privacy`; do not commit private proof.
2. The release branch is updated only with evidence-backed decisions:
   `booking.privacyNoticeApproved`,
   `booking.retentionApproved`, `booking.rateProtectionVerified`,
   `booking.privacyNoticePath="/appointment-privacy"`,
   and `booking.enabled=true`, along with factual evidence references.
   Do not invent approval.
3. The Web3Forms delivery flag and form key must be configured for the
   intended production environment only after the above approval. Test
   fictional data once, inspect transport failure/timeout outcomes and
   confirm delivery, then consider actual publication.
4. **No production merge or patient form activation without explicit final
   owner authorization.**

**Sign-off (leave blank until completed)**

- Clinic operator / controller:
- Date:
- Approved Web3Forms retention setting and basis:
- Receiving email retention and deletion practice:
- Anti-spam / quota response:
- Privacy notice version:
- Evidence location (private; not a public URL or patient record):
