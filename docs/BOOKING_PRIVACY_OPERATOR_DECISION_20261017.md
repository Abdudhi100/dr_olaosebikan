# Web3Forms appointment privacy and operational decision record

**Prepared 17 October 2026 · INTERNAL REVIEW · NOT APPROVED.**
This is a sign-off aid for the clinic operator, **not** the patient-facing
privacy notice, legal advice or authorization to collect patient information.

## Already fixed / previously accepted

- The clinic chose **no mandatory visible CAPTCHA** for the initial flow.
  Do not silently enable hCaptcha or force a paid plan.
- The clinic's preferred retention option is **Web3Forms provider default**,
  not a custom 30-day setting. This preference is not evidence that the
  actual form account still uses the default or that the clinic has approved
  a lawful retention and deletion practice.
- Provider delivery was previously tested using **fictional** data only
  and the clinic's confirmed recipient binding. Real submissions remain OFF.
- The outgoing payload contains name, phone, consultation format and optional
  email/preferred scheduling fields; it deliberately excludes reason for
  consultation, free-text notes and all undocumented extra fields.
- Neither a Web3Forms access key nor a successful synthetic notification is
  a substitute for this policy approval.

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
| Web3Forms correct form | Open the actual form dashboard; verify clinic name, destination, and recipient without exposing access keys or patient messages | **PENDING** |
| Provider retention | Record actual form retention selection, whether provider default remains active and provider deletion/erasure pathway. Acknowledge the possible three-year period explicitly | **PENDING** |
| Email retention | Confirm accessible receiving-inbox retention/deletion, backups where applicable, how long enquiry emails are kept, and who can perform deletion | **PENDING** |
| Controller and contact | Record responsible clinic/legal entity, a reachable privacy contact, and authorized users of forwarded private-clinic email | **PENDING** |
| Legal basis and transparency | Clinic approves a lawful ground for collection, international processing arrangement, patient rights and incident protocol | **PENDING** |
| Spam/rate handling | Verify provider's actual account-selected protections (not just published general policy), observe provider alert/quota availability and define a response to spam or quota exhaustion. No mandatory CAPTCHA by preference | **PENDING** |
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
