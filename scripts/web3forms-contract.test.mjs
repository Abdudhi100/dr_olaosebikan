import assert from "node:assert/strict";
import test from "node:test";
import {
  bookingDeliveryReady,
  bookingProviderPayload,
  createApprovedBookingTransport,
} from "../src/lib/booking-delivery.ts";

const dummyAccessKey = "00000000-0000-4000-8000-000000000000";
const syntheticPayload = {
  fullName: "Synthetic Clinic Test — Not a Patient",
  phone: "+12025550147",
  consultationType: "virtual",
  preferredDate: "2026-10-19",
  preferredTime: "14:30",
  bookingNote: "Scheduling test only; no health information.",
  reason: "Follow-up consultation",
  email: "synthetic@example.invalid",
};
const approvedTestConfig = {
  accessKey: dummyAccessKey,
  recipientBindingVerified: true,
  privacyNoticeApproved: true,
  retentionApproved: true,
  rateProtectionVerified: true,
};

test("Web3Forms synthetic contract uses only allowlisted fields, never recipient or control data", () => {
  const extra = {
    ...syntheticPayload,
    recipient: "not-allowed@example.invalid",
    to: "not-allowed@example.invalid",
    ccemail: "not-allowed@example.invalid",
    healthRecords: "must-not-leak",
    access_key: "must-not-override",
  };
  const original = structuredClone(extra);
  const body = bookingProviderPayload(extra, dummyAccessKey);
  assert.deepEqual(extra, original);
  assert.deepEqual(Object.keys(body).sort(), [
    "access_key", "subject", "from_name", "botcheck", "fullName", "phone",
    "consultationType", "preferredDate", "preferredTime", "bookingNote",
    "reason", "email",
  ].sort());
  assert.equal(body.access_key, dummyAccessKey);
  assert.equal(body.subject, "Clinic appointment request");
  assert.equal(body.botcheck, false);
  assert.ok(!JSON.stringify(body).includes("must-not"));
  assert.ok(!JSON.stringify(body).includes("not-allowed@"));
});

test("live delivery cannot be enabled by an access key alone", () => {
  const { accessKey } = approvedTestConfig;
  assert.equal(bookingDeliveryReady({
    accessKey, recipientBindingVerified: false,
    privacyNoticeApproved: false, retentionApproved: false, rateProtectionVerified: false,
  }), false);
  for (const gate of ["recipientBindingVerified", "privacyNoticeApproved", "retentionApproved", "rateProtectionVerified"]) {
    const unapproved = { ...approvedTestConfig, [gate]: false };
    assert.equal(bookingDeliveryReady(unapproved), false);
    assert.throws(() => createApprovedBookingTransport(unapproved), /not approved/);
  }
  assert.equal(bookingDeliveryReady({ ...approvedTestConfig, accessKey: "" }), false);
});

test("provider acknowledgement exercises a single POST to the documented endpoint", async () => {
  let calls = 0;
  const fakeFetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.headers.Accept, "application/json");
    assert.ok(options.signal instanceof AbortSignal);
    const json = JSON.parse(options.body);
    assert.equal(json.fullName, syntheticPayload.fullName);
    assert.equal(json.access_key, dummyAccessKey);
    assert.deepEqual(Object.keys(json).sort(), Object.keys(bookingProviderPayload(syntheticPayload, dummyAccessKey)).sort());
    return {
      ok: true,
      headers: new Headers({ "content-type": "application/json; charset=utf-8" }),
      json: async () => ({ success: true, message: "Email sent successfully!" }),
    };
  };
  const transport = createApprovedBookingTransport(approvedTestConfig, fakeFetch);
  assert.deepEqual(await transport(syntheticPayload), { kind: "acknowledged" });
  assert.equal(calls, 1, "Never duplicate appointment requests");
});

test("provider rejects, rate limits, ambiguous success and network errors without inventing a delivered email", async () => {
  const scenarios = [
    [{ ok: false, body: { success: false, message: "Bad request" } }, "definite-failure"],
    [{ ok: false, body: { success: false, message: "Rate limited" } }, "definite-failure"],
    [{ ok: false, body: { success: true } }, "uncertain"],
    [{ ok: true, body: {} }, "uncertain"],
    [{ ok: true, body: { success: false } }, "definite-failure"],
    [{ ok: true, body: { success: true }, contentType: "text/html" }, "uncertain"],
  ];
  for (const [response, expected] of scenarios) {
    let requests = 0;
    const transport = createApprovedBookingTransport(approvedTestConfig, async () => {
      requests++;
      return {
        ok: response.ok,
        headers: new Headers({ "content-type": response.contentType ?? "application/json" }),
        json: async () => response.body,
      };
    });
    assert.deepEqual(await transport(syntheticPayload), { kind: expected });
    assert.equal(requests, 1);
  }
  const offline = createApprovedBookingTransport(approvedTestConfig, async () => {
    throw new Error("Simulated network interruption");
  });
  assert.deepEqual(await offline(syntheticPayload), { kind: "uncertain" });
});

test("the current release remains disabled even though domain email routing is verified", async () => {
  const { clinicReadiness, clinicReleaseErrors } = await import("./clinic-release.mjs");
  assert.equal(clinicReadiness.contactDetailsConfirmed, true);
  assert.equal(clinicReadiness.booking.enabled, false);
  assert.equal(clinicReadiness.booking.recipientBindingVerified, false);
  assert.equal(clinicReadiness.booking.privacyNoticeApproved, false);
  assert.ok(clinicReleaseErrors(clinicReadiness).includes("canonicalDomainConfirmed"));
  assert.ok(clinicReleaseErrors(clinicReadiness).includes("booking.contactOnlyFallbackApproved"));
});
