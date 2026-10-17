import test from "node:test";
import assert from "node:assert/strict";
import {
  clinicReadiness,
  clinicReleaseErrors,
  clinicDurationConsistencyErrors,
  assertClinicBuildAllowed,
} from "./clinic-release.mjs";
import {
  bookingDeliveryReady,
  bookingProviderPayload,
  createApprovedBookingTransport,
} from "../src/lib/booking-delivery.ts";
const key = "00000000-0000-4000-8000-000000000000";
const approved = {
  accessKey: key,
  recipientBindingVerified: true,
  privacyNoticeApproved: true,
  retentionApproved: true,
  rateProtectionVerified: true,
};
const payload = {
  fullName: "Synthetic Reviewer",
  phone: "+12025550147",
  consultationType: "virtual",
  bookingNote: "Synthetic arrangement check.",
};
test("local reviews are permitted while unapproved public Cloudflare releases fail closed", () => {
  assert.doesNotThrow(() => assertClinicBuildAllowed({}));
  assert.throws(
    () => assertClinicBuildAllowed({ CF_PAGES: "1" }),
    /Clinic release is pending/,
  );
  assert.throws(
    () => assertClinicBuildAllowed({ CLINIC_RELEASE: "approved" }),
    /Clinic release is pending/,
  );
  assert.ok(
    clinicReleaseErrors(clinicReadiness).includes("contactDetailsConfirmed"),
  );
});
test("review override requires recorded private preview protection and excludes the verified production branch", () => {
  const config = {
    ...clinicReadiness,
    privatePreviewAccessVerified: true,
    productionBranch: "release/production",
    evidenceReferences: {
      privatePreviewAccessVerified: "Synthetic private Access test",
    },
  };
  assert.doesNotThrow(() =>
    assertClinicBuildAllowed(
      {
        CF_PAGES: "1",
        CF_PAGES_BRANCH: "feat/review",
        CLINIC_REVIEW_BUILD: "1",
      },
      config,
    ),
  );
  assert.throws(() =>
    assertClinicBuildAllowed(
      {
        CF_PAGES: "1",
        CF_PAGES_BRANCH: "release/production",
        CLINIC_REVIEW_BUILD: "1",
      },
      config,
    ),
  );
  assert.throws(() =>
    assertClinicBuildAllowed(
      {
        CF_PAGES: "1",
        CF_PAGES_BRANCH: "feat/review",
        CLINIC_REVIEW_BUILD: "1",
      },
      { ...config, productionBranch: "" },
    ),
  );
  assert.doesNotThrow(() =>
    assertClinicBuildAllowed({
      CF_PAGES: "1",
      CF_PAGES_BRANCH: "feat/review",
      CLINIC_REVIEW_BUILD: "1",
    }),
  );
});

test("public release detects contradictions across 45- and 60-minute consultation copy", () => {
  assert.deepEqual(clinicDurationConsistencyErrors([45], [45,45]), []);
  assert.deepEqual(clinicDurationConsistencyErrors([60], [60,60]), []);
  assert.deepEqual(clinicDurationConsistencyErrors([45], [60,45]), ["consultationDurationMismatch"]);
  assert.deepEqual(clinicDurationConsistencyErrors([60,45], [45,45]), ["consultationDurationMismatch"]);
  assert.deepEqual(clinicDurationConsistencyErrors([45], [0]), ["consultationDurationMismatch"]);
  assert.ok(!clinicReleaseErrors(clinicReadiness).includes("consultationDurationMismatch"),
    "Owner-confirmed 45-minute copy should now agree with service metadata");
});

test("provider keys alone cannot activate patient-data delivery", () => {
  for (const field of [
    "recipientBindingVerified",
    "privacyNoticeApproved",
    "retentionApproved",
    "rateProtectionVerified",
  ]) {
    const config = { ...approved, [field]: false };
    assert.equal(bookingDeliveryReady(config), false);
    assert.throws(() => createApprovedBookingTransport(config));
  }
  assert.equal(bookingDeliveryReady({ ...approved, accessKey: "" }), false);
});
test("provider payload excludes extra properties, routing fields and patient values from subject", () => {
  const body = bookingProviderPayload(
    {
      ...payload,
      recipient: "example.invalid",
      cc: "example.invalid",
      privateField: "not allowed",
    },
    key,
  );
  assert.deepEqual(
    Object.keys(body).sort(),
    [
      "access_key",
      "subject",
      "from_name",
      "botcheck",
      "fullName",
      "phone",
      "consultationType",
      "bookingNote",
    ].sort(),
  );
  assert.equal(body.subject, "Clinic appointment request");
  assert.ok(!body.subject.includes(payload.fullName));
});
test("acknowledgement, explicit rejection and ambiguous delivery have distinct outcomes", async () => {
  for (const [ok, result, kind] of [
    [true, { success: true }, "acknowledged"],
    [false, { success: false }, "definite-failure"],
    [true, {}, "uncertain"],
    [false, { success: true }, "uncertain"],
  ]) {
    let calls = 0;
    const transport = createApprovedBookingTransport(approved, async () => {
      calls++;
      return {
        ok,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => result,
      };
    });
    assert.deepEqual(await transport(payload), { kind });
    assert.equal(calls, 1);
  }
  const transport = createApprovedBookingTransport(approved, async () => {
    throw new Error("Simulated loss of response");
  });
  assert.deepEqual(await transport(payload), { kind: "uncertain" });
});
