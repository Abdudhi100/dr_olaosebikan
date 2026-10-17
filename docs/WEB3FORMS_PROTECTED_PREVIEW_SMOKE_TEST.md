# Web3Forms synthetic browser delivery test — protected preview only

## Final outcome — completed 17 October 2026

**PASS (owner-reported):** The owner submitted the exact fictional test from the authenticated protected website appointment form and confirmed receiving the notification in the verified university inbox, via Web3Forms and Cloudflare Email Routing. This verifies the **website → Web3Forms → Cloudflare forwarding → destination inbox** chain with synthetic data. The assistant did not independently inspect the inbox or view the email headers.

**Temporary test implementation disabled:** The booking page has been returned to the ordinary fail-closed component on the protected preview branch. It no longer consults `NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST`; that flag by itself cannot re-enable delivery. The project owner should also delete `NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST` from Cloudflare **Preview environment variables**, optionally remove the Web3Forms key there, and redeploy or confirm the new protected-preview deployment. Do not alter Cloudflare Access or the preview hero-video variable.

**Still blocked:** `booking.enabled: false`, `releaseStatus: pending`, privacy notice, retention and anti-abuse/rate-protection approvals. The direct email address is functional, but this successful fictional test is NOT authorization to accept real patient information or publish the main branch.

The instructions below are retained as a record of how the completed **temporary test** was conducted; do **not** repeat them or re-enable this mode for normal operation.

**Prepared 17 October 2026.** Web3Forms dashboard's **Send Test Submission**
was confirmed received by the clinic owner. That proves provider-to-inbox delivery,
**not** delivery from the website booking form.

## Safety design

- Public branch `main` is unchanged.
- `config/clinic-release.json` keeps `releaseStatus: pending` and
  `booking.enabled: false`. The ordinary appointment form cannot submit.
- `BookingForm` checks the release register, not merely an environment flag.
- An independent synthetic-only transport is offered **only** when all of:
  - the Access-protected preview's exact hostname is used,
  - release says preview Access is verified,
  - `booking.enabled` remains false,
  - `NEXT_PUBLIC_CLINIC_HERO_PREVIEW=1` and
    `NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST=1`,
  - a valid Web3Forms public access key is configured.
- In that test mode, the transport **rejects all requests** except the
  fictional name, phone and consultation type below, with every other form
  field blank. It must not be used to submit real patient data.
- The test's acknowledgement only confirms Web3Forms' API response; actual
  forwarding must be checked separately in the destination inbox.
- The access key is a public browser form identifier, not an API secret.
  Do not publish it unnecessarily or put it in GitHub source.

## One-time Cloudflare preview setup (owner or authorized admin)

In Cloudflare Dashboard → Workers & Pages → `dr-olaosebikan-git` →
**Settings → Environment variables → Preview** (menu names can vary):

1. Keep the existing Access-protected preview branch and its
   `NEXT_PUBLIC_CLINIC_HERO_PREVIEW=1` setting.
2. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to the access key from the
   verified **Dr Olaosebikan Appointment Form** in Web3Forms.
3. Set `NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST=1` for this **Preview only**.
4. Do **not** set `NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED=1`; that is
   reserved for a separately approved real booking release.
5. Do **not** change `CLINIC_RELEASE`, `CLINIC_REVIEW_BUILD`,
   `booking.enabled`, `main`, DNS settings or Cloudflare Access.
6. Redeploy the protected `preview/clinic-20261014` branch to embed the
   environment values into the static JavaScript bundle. Environment changes
   do not update an already built export.

## Exactly one fictional appointment test

Open the authenticated page:

`https://preview-clinic-20261014.dr-olaosebikan-git.pages.dev/appointments/book`

Confirm a large **SYNTHETIC TEST MODE — NOT AN APPOINTMENT** banner is shown
and the submit action says **Send fictional test**. If not, stop: it is not
the test-enabled preview.

Enter these **exact values**:

| Field | Required test value |
| --- | --- |
| Full name | `SYNTHETIC CLINIC TEST - NOT A PATIENT` |
| Phone | `+12025550147` |
| Consultation type | **Virtual** |
| Reason | Leave blank |
| Preferred date/time | Both blank |
| Email | Blank |
| Booking note | Blank |

Click **Send fictional test** once. An API acknowledgement is a useful first
signal, but it is not confirmation of the notification reaching the inbox.
Check the approved destination inbox and Web3Forms → Submissions for the
fictional marker. If the interface says uncertain, **check the inbox first**
rather than resending automatically.

If provider-side verification or free-plan spam checks reject the test,
record the harmless error and review Web3Forms → Settings → Spam & Security.
Do not disable all spam protections to force a green test.

## Immediately turn off test mode

1. Remove (or set to `0`) `NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST` from the
   Cloudflare **Preview** environment.
2. Optionally remove the Web3Forms key from Preview after verifying receipt
   (it is not needed for the disabled ordinary form).
3. Redeploy the protected preview and confirm the **normal form-disabled
   notice** returns. The test banner and button must disappear.
4. Keep public production and patient submissions off until an appropriate
   privacy notice, retention policy, institutional mailbox permission,
   spam/abuse protection and the clinician's final workflow approval.

**Privacy:** The Web3Forms service may retain submissions, including health
information if entered. Do not use real medical details, symptoms, patient
names or patient contact information in this test. The real patient workflow
remains a separate later release decision.
