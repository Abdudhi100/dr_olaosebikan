import assert from "node:assert/strict";
import test from "node:test";
import { clinicReadiness, clinicReleaseErrors } from "./clinic-release.mjs";
import {
  approvedBookingConfiguration,
  bookingProviderPayload,
  bookingDeliveryReady,
  createSyntheticWeb3FormsTransport,
  isSyntheticTestPayload,
  SYNTHETIC_TEST_NAME,
  SYNTHETIC_TEST_PHONE,
} from "../src/lib/booking-delivery.ts";

const accessKey = "00000000-0000-4000-8000-000000000000";
const synthetic = {
  fullName: SYNTHETIC_TEST_NAME,
  phone: SYNTHETIC_TEST_PHONE,
  consultationType: "virtual",
};

test("clinic receipt confirmation never enables real patient delivery by itself", () => {
  assert.equal(clinicReadiness.booking.enabled, false);
  assert.equal(clinicReadiness.booking.recipientBindingVerified, true);
  assert.equal(clinicReadiness.booking.privacyNoticeApproved, false);
  assert.equal(clinicReadiness.booking.retentionApproved, false);
  assert.equal(clinicReadiness.booking.rateProtectionVerified, false);
  assert.equal(approvedBookingConfiguration(clinicReadiness.booking, "1", accessKey, "/appointment-privacy"), null);
  assert.ok(clinicReleaseErrors(clinicReadiness).includes("releaseStatus"));
});

test("production form requires all release approvals and matching privacy notice", () => {
  const release = {
    enabled: true,
    recipientBindingVerified: true,
    privacyNoticeApproved: true,
    privacyNoticePath: "/appointment-privacy",
    retentionApproved: true,
    rateProtectionVerified: true,
  };
  assert.deepEqual(
    approvedBookingConfiguration(release, "1", accessKey, "/appointment-privacy"),
    {
      accessKey,
      recipientBindingVerified: true,
      privacyNoticeApproved: true,
      retentionApproved: true,
      rateProtectionVerified: true,
    },
  );
  assert.equal(approvedBookingConfiguration(release, undefined, accessKey, release.privacyNoticePath), null);
  assert.equal(approvedBookingConfiguration(release, "1", accessKey, "/other-privacy"), null);
  assert.equal(approvedBookingConfiguration({ ...release, retentionApproved: false }, "1", accessKey, release.privacyNoticePath), null);
  assert.equal(approvedBookingConfiguration({ ...release, enabled: false }, "1", accessKey, release.privacyNoticePath), null);
  assert.equal(bookingDeliveryReady({ accessKey, recipientBindingVerified: true, privacyNoticeApproved: false, retentionApproved: true, rateProtectionVerified: true }), false);
});

test("synthetic preview transport refuses all patient-like entries before network", async () => {
  let sent = 0;
  const fakeFetch = async () => {
    sent++;
    return { ok: true, headers: new Headers({ "content-type": "application/json" }), json: async () => ({ success: true }) };
  };
  assert.throws(() => createSyntheticWeb3FormsTransport(accessKey, false, fakeFetch), /private-preview-only/);
  const deliver = createSyntheticWeb3FormsTransport(accessKey, true, fakeFetch);
  for (const draft of [
    { ...synthetic, fullName: "A real visitor" },
    { ...synthetic, phone: "+2348035751154" },
    { ...synthetic, reason: "Gout treatment" },
    { ...synthetic, bookingNote: "I have a health condition" },
    { ...synthetic, preferredDate: "2026-10-20" },
    { ...synthetic, email: "not-a-patient@example.invalid" },
    { ...synthetic, consultationType: "in-person" },
  ]) {
    assert.equal(isSyntheticTestPayload(draft), false);
    assert.deepEqual(await deliver(draft), { kind: "definite-failure" });
  }
  assert.equal(sent, 0);
});

test("the exact fictional identity makes one provider POST, with no record or routing overrides", async () => {
  let requests = 0;
  const transport = createSyntheticWeb3FormsTransport(accessKey, true, async (url, options) => {
    requests++;
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    const data = JSON.parse(options.body);
    assert.deepEqual(data, bookingProviderPayload(synthetic, accessKey));
    assert.equal(data.botcheck, false);
    assert.equal(data.access_key, accessKey);
    assert.ok(!("recipient" in data));
    assert.ok(!("healthRecords" in data));
    return { ok: true, headers: new Headers({ "content-type": "application/json" }), json: async () => ({ success: true }) };
  });
  assert.equal(isSyntheticTestPayload(synthetic), true);
  assert.deepEqual(await transport(synthetic), { kind: "acknowledged" });
  assert.equal(requests, 1);
});
