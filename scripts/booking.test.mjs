import assert from "node:assert/strict";
import test from "node:test";
import {
  BOOKING_PATH,
  BOOKING_REASONS,
  CARE_REASON_BY_MEDIA,
  CONSULTATION_TYPES,
  countBookingNoteCharacters,
  createEmptyBookingDraft,
  lagosDate,
  validateBooking,
} from "../src/lib/booking.ts";
import { createReviewTransport, submitWithTimeout } from "../src/lib/booking-review-transport.ts";
import {
  APPOINTMENT_WHATSAPP_MESSAGE,
  APPOINTMENT_WHATSAPP_NUMBER,
  APPOINTMENT_WHATSAPP_URL,
  appointmentMessage,
  appointmentWhatsAppUrl,
  whatsappUrl,
} from "../src/lib/whatsapp.ts";

const NOW = new Date("2026-09-14T10:00:00.000Z");
const validDraft = (changes = {}) => ({
  ...createEmptyBookingDraft(),
  consultationType: "virtual",
  fullName: "Synthetic Reviewer",
  phone: "+1 202 555 0147",
  ...changes,
});
const validate = (draft, options = {}) => validateBooking(draft, { now: NOW, ...options });

test("the selector has the exact ten ordered reasons and two consultation types", () => {
  assert.deepEqual(BOOKING_REASONS, [
    "Pain consultation", "Arthritis consultation", "Autoimmune consultation",
    "Rheumatology consultation", "Follow-up consultation", "Joint pain and stiffness",
    "Lupus care", "Gout treatment", "Chronic pain", "Other rheumatology concerns",
  ]);
  assert.equal(new Set(BOOKING_REASONS).size, 10);
  assert.deepEqual(CONSULTATION_TYPES, [
    { value: "in-person", label: "In person" }, { value: "virtual", label: "Virtual" },
  ]);
  assert.equal(BOOKING_PATH, "/appointments/book");
});

test("the six explicit care entries supply only their approved editable reasons", () => {
  assert.deepEqual(CARE_REASON_BY_MEDIA, {
    pain: "Pain consultation", knee: "Arthritis consultation", autoimmune: "Autoimmune consultation",
    gout: "Gout treatment", rheumatology: "Rheumatology consultation", followup: "Follow-up consultation",
  });
  assert.equal(Object.values(CARE_REASON_BY_MEDIA).every((reason) => BOOKING_REASONS.includes(reason)), true);
});

test("fresh drafts are independently blank with no implicit reason or format", () => {
  const first = createEmptyBookingDraft();
  const second = createEmptyBookingDraft();
  assert.equal(Object.keys(second).length, 8);
  assert.equal(Object.values(second).every((value) => value === ""), true);
  first.reason = BOOKING_REASONS[0];
  first.consultationType = "virtual";
  assert.equal(second.reason, "");
  assert.equal(second.consultationType, "");
});

test("blank final submission rejects only required fields and invokes no payload", () => {
  const result = validate(createEmptyBookingDraft());
  assert.deepEqual(Object.keys(result.errors).sort(), ["consultationType", "fullName", "phone"]);
  assert.equal(result.errors.fullName, "Enter your full name.");
  assert.equal(result.payload, null);
  assert.deepEqual(result.normalized, {});
});

test("quick continuation permits omitted preferences but rejects entered invalid preferences", () => {
  assert.deepEqual(validate(createEmptyBookingDraft(), { preferencesOnly: true }).errors, {});
  const result = validate(validDraft({
    reason: "Invented reason", consultationType: "home-visit", preferredDate: "2026-02-30", preferredTime: "25:00",
    fullName: "", phone: "", email: "not-email", bookingNote: "x".repeat(301),
  }), { preferencesOnly: true });
  assert.deepEqual(Object.keys(result.errors).sort(), ["consultationType", "preferredDate", "preferredTime", "reason"]);
  assert.equal(result.payload, null);
});

test("every reason and both allowed types validate, and optional blanks are omitted", () => {
  for (const reason of BOOKING_REASONS) {
    for (const type of CONSULTATION_TYPES) {
      const result = validate(validDraft({ reason, consultationType: type.value }));
      assert.deepEqual(result.errors, {});
      assert.equal(result.payload.reason, reason);
      assert.equal(result.payload.consultationType, type.value);
    }
  }
  assert.deepEqual(validate(validDraft()).payload, {
    consultationType: "virtual", fullName: "Synthetic Reviewer", phone: "+12025550147",
  });
  for (const consultationType of ["Virtual", "video", "in person", "<script>"]) {
    assert.ok(validate(validDraft({ consultationType })).errors.consultationType);
  }
  assert.ok(validate(validDraft({ reason: "A diagnosis that was never offered" })).errors.reason);
});

test("normalization supports Unicode names without mutation and whitelists the eight fields", () => {
  const original = validDraft({
    fullName: "  Ṣadé   李 O'Connor-Smith  ", phone: " +44 (20) 7946-0958 ",
    email: " reviewer@example.test ", preferredDate: "2026-09-15", preferredTime: "00:00",
    bookingNote: "  Please use the step-free entrance.  ", reason: " Lupus care ",
    access_key: "synthetic-not-a-key", medicalRecords: "excluded", subject: "excluded",
  });
  const snapshot = structuredClone(original);
  const result = validate(original);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.payload, {
    fullName: "Ṣadé 李 O'Connor-Smith", phone: "+442079460958", email: "reviewer@example.test",
    consultationType: "virtual", preferredDate: "2026-09-15", preferredTime: "00:00",
    bookingNote: "Please use the step-free entrance.", reason: "Lupus care",
  });
  assert.deepEqual(original, snapshot);
  assert.equal("access_key" in result.normalized, false);
  assert.equal("medicalRecords" in result.payload, false);
  assert.ok(validate(validDraft({ fullName: " \t\n " })).errors.fullName);
  assert.ok(validate(validDraft({ fullName: "Synthetic\u0000name" })).errors.fullName);
  for (const fullName of ["李", "Ọlá", "Anne-Marie", "João", "O'Connor"]) {
    assert.equal(validate(validDraft({ fullName })).errors.fullName, undefined);
  }
});

test("phone validation accepts international formatting without assuming a country", () => {
  for (const phone of ["+1 (202) 555-0147", "+44 20 7946 0958", "+49.30.1234567", "+81 3 1234 5678", "+234 803 000 0000", "08030000000", "1234567", "+123456789012345"]) {
    assert.equal(validate(validDraft({ phone })).errors.phone, undefined, phone);
  }
  for (const phone of ["123456", "1234567890123456", "+0123456789", "++12025550147", "1202+5550147", "+1 202 555 0147 ext 2", "telephone", "-()", "📞12025550147"]) {
    assert.ok(validate(validDraft({ phone })).errors.phone, phone);
  }
  assert.equal(validate(validDraft({ phone: "0803 000 0000" })).payload.phone, "08030000000");
});

test("email is optional and checked only when present", () => {
  for (const email of ["", "   ", "reviewer@example.test", "reviewer+local@example.test"]) {
    assert.equal(validate(validDraft({ email })).errors.email, undefined, email);
  }
  for (const email of ["reviewer", "reviewer@", "@example.test", "reviewer@example", "reviewer space@example.test", "x".repeat(250) + "@example.test"]) {
    assert.ok(validate(validDraft({ email })).errors.email, email);
  }
  assert.equal("email" in validate(validDraft({ email: "  " })).payload, false);
});

test("note limit is exactly 300 Unicode code points after trimming", () => {
  for (const bookingNote of ["", "x".repeat(300), "😀".repeat(300), "  " + "Ọ".repeat(300) + "  "]) {
    assert.equal(validate(validDraft({ bookingNote })).errors.bookingNote, undefined);
  }
  for (const bookingNote of ["x".repeat(301), "😀".repeat(301)]) {
    assert.ok(validate(validDraft({ bookingNote })).errors.bookingNote);
  }
  assert.equal(countBookingNoteCharacters("  😀  "), 1);
  assert.equal(countBookingNoteCharacters("e\u0301"), 2);
  assert.equal("bookingNote" in validate(validDraft({ bookingNote: "   " })).payload, false);
});

test("date eligibility is Lagos calendar time and is revalidated across midnight", () => {
  const before = new Date("2026-09-14T22:59:59.999Z");
  const after = new Date("2026-09-14T23:00:00.000Z");
  assert.equal(lagosDate(before), "2026-09-14");
  assert.equal(lagosDate(after), "2026-09-15");
  const draft = validDraft({ preferredDate: "2026-09-14" });
  assert.equal(validate(draft, { now: before }).errors.preferredDate, undefined);
  assert.ok(validate(draft, { now: after }).errors.preferredDate);
  assert.equal(validate(validDraft({ preferredDate: "2026-09-15" }), { now: after }).errors.preferredDate, undefined);
  assert.equal(lagosDate(new Date("2026-12-31T23:00:00.000Z")), "2027-01-01");
});

test("calendar and time validity impose no weekend, opening-hour or interval restrictions", () => {
  for (const preferredDate of ["2026-09-19", "2026-09-20", "2028-02-29"]) {
    assert.equal(validate(validDraft({ preferredDate })).errors.preferredDate, undefined, preferredDate);
  }
  for (const preferredDate of ["2026-02-29", "2026-09-31", "2026-13-01", "2026-9-15", "not-a-date", "2026-09-13"]) {
    assert.ok(validate(validDraft({ preferredDate })).errors.preferredDate, preferredDate);
  }
  for (const preferredTime of ["00:00", "01:17", "12:59", "23:59", ""]) {
    assert.equal(validate(validDraft({ preferredTime })).errors.preferredTime, undefined, preferredTime);
  }
  for (const preferredTime of ["24:00", "09:60", "9:00", "12:00 PM", "12:00:00", "-1:30"]) {
    assert.ok(validate(validDraft({ preferredTime })).errors.preferredTime, preferredTime);
  }
});

test("mock transport defaults to an asynchronous local acknowledgement", async () => {
  const delays = [];
  const transport = createReviewTransport({ wait: async (delay) => { delays.push(delay); } });
  const payload = validate(validDraft()).payload;
  const snapshot = structuredClone(payload);
  assert.deepEqual(await transport(payload), { kind: "acknowledged" });
  assert.deepEqual(delays, [600]);
  assert.deepEqual(payload, snapshot);
});

test("all three explicit mock outcomes are deterministic and make no network call", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = () => { fetchCalls++; throw new Error("Network forbidden by this test"); };
  try {
    for (const scenario of ["acknowledged", "definite-failure", "uncertain"]) {
      const transport = createReviewTransport({ scenario, delayMs: 0, wait: async () => {} });
      assert.deepEqual(await submitWithTimeout(transport, validate(validDraft()).payload, 100), { kind: scenario });
    }
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejected, thrown or malformed transport responses are uncertain and never auto-retried", async () => {
  for (const failingTransport of [
    async () => { throw new Error("Synthetic rejection"); },
    () => { throw new Error("Synthetic synchronous failure"); },
    async () => ({ kind: "unexpected" }),
    async () => null,
  ]) {
    let calls = 0;
    const outcome = await submitWithTimeout((payload) => { calls++; return failingTransport(payload); }, validate(validDraft()).payload, 100);
    assert.deepEqual(outcome, { kind: "uncertain" });
    assert.equal(calls, 1);
  }
});

test("deadline is uncertain and a later acknowledgement cannot replace its resolved outcome", async () => {
  let settle;
  let calls = 0;
  const transport = () => {
    calls++;
    return new Promise((resolve) => { settle = resolve; });
  };
  const outcome = await submitWithTimeout(transport, validate(validDraft()).payload, 5);
  assert.deepEqual(outcome, { kind: "uncertain" });
  settle({ kind: "acknowledged" });
  await Promise.resolve();
  assert.deepEqual(outcome, { kind: "uncertain" });
  assert.equal(calls, 1);
});

test("every legacy and current booking value is ignored by the compatible WhatsApp helpers", () => {
  const expected = "Hello, I would like to request an appointment with Dr Hakeem Olaosebikan. Please let me know the available dates and how to proceed. Thank you.";
  const fields = {
    name: "SYNTHETIC_LEGACY_NAME", fullName: "SYNTHETIC_FULL_NAME", phone: "+12025550147",
    email: "sentinel@example.test", preferredDate: "2031-07-21", preferredTime: "03:47",
    service: "SYNTHETIC_LEGACY_SERVICE", message: "SYNTHETIC_LEGACY_MESSAGE",
    reason: "SYNTHETIC_REASON", consultationType: "SYNTHETIC_TYPE", bookingNote: "SYNTHETIC_NOTE",
  };
  assert.equal(APPOINTMENT_WHATSAPP_NUMBER, "2348035751154");
  assert.equal(APPOINTMENT_WHATSAPP_MESSAGE, expected);
  assert.equal(appointmentMessage(), expected);
  assert.equal(appointmentMessage(fields), expected);
  assert.equal(appointmentWhatsAppUrl(fields), APPOINTMENT_WHATSAPP_URL);
  assert.equal(appointmentWhatsAppUrl(), APPOINTMENT_WHATSAPP_URL);
  const url = new URL(appointmentWhatsAppUrl(fields));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/2348035751154");
  assert.equal(url.searchParams.get("text"), expected);
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
  for (const value of Object.values(fields)) assert.equal(url.toString().includes(encodeURIComponent(value)), false);
  assert.equal(whatsappUrl(expected), APPOINTMENT_WHATSAPP_URL);
});
