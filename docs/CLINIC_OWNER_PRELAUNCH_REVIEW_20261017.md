# Dr. Hakeem Olaosebikan clinic — owner prelaunch review

**Prepared:** 17 October 2026  
**Scope:** Source audit of the current Access-protected Next.js/Cloudflare preview.
This is not clinical, legal, licensing or owner approval. No public publication
or patient-data delivery is authorized by this document.

## Verified technical state

- Preview source: `preview/clinic-20261014`; production source: `main`.
- Production gate: `config/clinic-release.json` specifies
  `releaseStatus: "pending"` and `booking.enabled: false`.
- Protected preview Access verification has evidence logged. Do not disable or
  weaken this protection to make hosted screenshots easier.
- CI: unit tests, TypeScript, static export and post-build link validation;
  latest completed browser audit checked 17 routes × 4 widths (390, 768,
  1440, 1920), plus interaction/privacy tests.
- The browser audit exercises **local static exports**. Final hosted
  Cloudflare Access visual approval by the owner is still needed.

## Owner decisions still outstanding

Use a dated confirmation plus a source/reference for every release switch.
Do **not** mark a field approved simply because the page looks finished.

| Priority | Decision and exact current source | Needed owner confirmation |
| --- | --- | --- |
| Required | **Professional credentials:** the Homepage says “Associate Professor and Senior Consultant Rheumatologist”; `src/content/doctor.json` records “Consultant Physician”, experience “10”, and a generic professional-networks membership description. | Confirm exact public titles, qualifications, affiliations, experience wording, and permitted portrait/bio before setting `professionalClaimsVerified`. Multiple titles can be valid; the question is source verification, not assumed falsity. |
| Required | **Consultation length conflict:** visible Homepage and `ClinicSections.tsx` FAQ say **one-hour** appointments, but all six `src/content/services.json` records contain `durationMinutes: 45`. | State which duration is accurate for each consultation type. Correct the source(s) and test the preview. Public release is now blocked if this mismatch persists. Do not guess or silently replace 45 with 60. |
| Required | **Contact:** `src/content/site.json` includes `+2348035751154`, `2348035751154` for WhatsApp, `hakeemolaosebikan37@gmail.com`, and Maryamville Medical Center, **144 Bode Thomas Road, Surulere, Lagos**. | Confirm contact person, recipient, phone/WhatsApp availability, email ownership, venue and physical attendance policy, and whether published hours are accurate. The JSON `hours` field currently states Mon–Fri 9–5, Sat 10–4 and Sunday by appointment; validate before publishing it anywhere. |
| Required | **Clinical copy:** `src/content/pages.json`, `src/content/faqs.json`, homepage, service explanations and condition pages include medical descriptions and call-to-actions. | Clinician sign-off for accuracy, scope of care, claims, warnings and patient-friendly language. Record `clinicalCopyApproved` evidence. |
| Required | **Media:** owner has said supplied videos are legally cleared, but `mediaRightsApproved` / `homepageMediaComplete` are still false in the release JSON. Nine preview hero videos remain configured; four condition heroes use still images, and the Specialist hero is light/paper. | Record owner media permission evidence, page suitability and poster/crop acceptance. Do not repeat licensing research by default; just document owner confirmation. |
| Required | **Domain:** `src/content/site.json` sets canonical `https://www.drolaosebikan.com`. | Confirm domain ownership, DNS, HTTPS, canonical www/no-www redirect policy, social cards, and planned public production destination before `canonicalDomainConfirmed`. |
| Required | **Appointment delivery:** `booking.enabled: false`, all recipient/privacy/retention/rate-protection flags false, privacy path empty. | Choose **contact-only launch** or approved online request workflow. For contact-only launch, verify that all request CTAs clearly lead to working phone/WhatsApp/contact instructions and record `booking.contactOnlyFallbackApproved`. For a live form, approve the recipient, privacy notice, retention/erasure, anti-abuse controls, failure/timeout behavior and explicit non-confirmation wording. |
| Review | **Publications & achievements:** currently empty verified records. | Either confirm empty-state publication is acceptable or supply validated publication/award records with source evidence. Never invent citations or awards. |
| Review | **Official email:** domain email was previously considered; current public value is Gmail. | Confirm Gmail as permanent address or provide operational official-domain mailbox, including forwarding/deliverability testing, before switching displayed email. |

### Protected visual review checklist

Review the current branch on an authenticated phone and desktop (390px and
1440px at minimum). Record pass/issue with screenshot and URL for:
- Homepage: video behind transparent nav, typography, CTA, no duplicate doctor portrait.
- Services: six cards, filter/reset behavior, visible video coverage, appropriate image crops.
- Specialist: authentic portrait, light editorial header, professional-title wording.
- Booking: clear disabled-delivery notice, no unexpected network submission,
  working WhatsApp and telephone fallback, accessibility at keyboard/mobile.
- Contact & Location: correct details, card actions, rounded overlap and
  venue guidance. Do not show unsupported hours or maps.
- FAQ and clinical condition pages: medical copy approved and visually readable.
- Insights/Media, Publications/Achievements: honest empty states and working
  routes; new verified content only after content approvals.
- Shared footer: cream space separating rounded sections, all links valid,
  no horizontal overflow, menu and focus operation at mobile sizes.

## Release procedure — do not perform until approved

1. Resolve source discrepancies and record owner/clinician evidence for the
   six top-level approval flags in `config/clinic-release.json`.
2. Verify contact-only fallback **or** the complete patient-data privacy and
   delivery path; leave booking disabled unless every required approval exists.
3. Re-run `npm test`, `npm run typecheck`, `npm run build`,
   `npm run check:links`, and targeted responsive/hosted checks.
4. Obtain final named approval of the authenticated preview, content and release
   checklist. Confirm intended domain/Cloudflare production branch.
5. Only then update the release register with evidence and explicitly
   authorize a production deploy. Do not infer permission from a previous
   instruction to improve the protected preview.

**Current release decision: HOLD — preview review may continue; public
deployment and patient submission remain disabled.**
