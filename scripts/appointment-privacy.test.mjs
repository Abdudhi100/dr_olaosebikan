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
  assert.match(page, /default retention/);
  assert.equal(clinicReadiness.booking.privacyNoticeApproved, false);
  assert.equal(clinicReadiness.booking.retentionApproved, false);
  assert.equal(clinicReadiness.booking.retentionTargetDays, null);
  assert.match(page, /three years/);
  assert.match(page, /30-day submission-history/);
  assert.match(page, /not yet[\s\S]*?confirmed/);
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

test("contact-only launch hides draft policy links while preserving future form disclosures", () => {
  const page = source("../src/app/appointments/book/page.tsx");
  const form = source("../src/components/AppointmentForm.tsx");
  const wrapper = source("../src/components/booking/BookingForm.tsx");
  assert.equal(clinicReadiness.booking.enabled, false);
  assert.match(wrapper, /release\.booking\.enabled !== true/);
  assert.match(wrapper, /return <ContactOnlyBooking \/>/);
  assert.match(page, /release\.booking\.enabled &&/);
  assert.match(page, /href="\/appointment-privacy"/);
  assert.doesNotMatch(page, /privacy information \(under review\)/);
  assert.match(form, /excluded from Web3Forms email notifications/);
  assert.match(form, /text is not emailed to the/);
});

test("standard booking is CAPTCHA-free but live transport still fails closed", () => {
  const wrapper = source("../src/components/booking/BookingForm.tsx");
  assert.match(wrapper, /return <AppointmentForm transport=\{transport\} \/>/);
  assert.doesNotMatch(wrapper, /captchaRequired=/);
  const body = bookingProviderPayload({
    fullName: "Synthetic Tester", phone: "+12025550147", consultationType: "virtual",
  }, "00000000-0000-4000-8000-000000000000");
  assert.equal("h-captcha-response" in body, false);
  assert.equal(clinicReadiness.booking.enabled, false);
  assert.equal(clinicReadiness.booking.rateProtectionVerified, false);
  assert.equal(clinicReadiness.booking.retentionApproved, false);
});
