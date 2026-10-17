import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { clinicReadiness } from "./clinic-release.mjs";
import { bookingProviderPayload } from "../src/lib/booking-delivery.ts";

const source = (filename) =>
  readFileSync(new URL(filename, import.meta.url), "utf8");

test("appointment privacy draft is clearly unapproved and non-indexable", () => {
  const page = source("../src/app/appointment-privacy/page.tsx");
  assert.match(page, /PRELAUNCH REVIEW/);
  assert.match(page, /NOT YET APPROVED/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /retention and deletion policy/);
  assert.equal(clinicReadiness.booking.privacyNoticeApproved, false);
  assert.equal(clinicReadiness.booking.retentionApproved, false);
  assert.equal(clinicReadiness.booking.rateProtectionVerified, false);
  assert.equal(clinicReadiness.booking.enabled, false);
  assert.equal(clinicReadiness.releaseStatus, "pending");
});

test("never email optional clinical reason, free-text note, or arbitrary patient data", () => {
  const body = bookingProviderPayload({
    fullName: "Fictional Researcher",
    phone: "+12025550147",
    email: "fictional@example.invalid",
    consultationType: "virtual",
    preferredDate: "2026-10-20",
    preferredTime: "09:30",
    reason: "Lupus care",
    bookingNote: "PRIVATE DETAIL: health symptoms and prescriptions",
    sensitiveRecord: "PRIVATE MEDICAL RECORD",
    cc: "not-a-clinic@example.invalid",
  }, "00000000-0000-4000-8000-000000000000");
  assert.deepEqual(Object.keys(body).sort(), [
    "access_key", "subject", "from_name", "botcheck", "fullName", "phone",
    "consultationType", "email", "preferredDate", "preferredTime",
  ].sort());
  const serialized = JSON.stringify(body);
  assert.ok(!serialized.includes("Lupus"));
  assert.ok(!serialized.includes("PRIVATE DETAIL"));
  assert.ok(!serialized.includes("MEDICAL RECORD"));
  assert.ok(!serialized.includes("not-a-clinic"));
});

test("appointment page transparently links to review-only privacy information", () => {
  const page = source("../src/app/appointments/book/page.tsx");
  const form = source("../src/components/AppointmentForm.tsx");
  assert.match(page, /href="\/appointment-privacy"/);
  assert.match(page, /privacy information \(under review\)/);
  assert.match(form, /excluded from Web3Forms email notifications/);
  assert.match(form, /text is not emailed to the/);
});
