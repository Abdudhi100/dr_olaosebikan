import type { BookingPayload } from "./booking";
import type { ReviewTransport } from "./booking-review-transport";
export type BookingDeliveryConfiguration = {
  accessKey: string;
  recipientBindingVerified: boolean;
  privacyNoticeApproved: boolean;
  retentionApproved: boolean;
  rateProtectionVerified: boolean;
};
export function bookingDeliveryReady(config: BookingDeliveryConfiguration) {
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      config.accessKey.trim(),
    ) &&
    config.recipientBindingVerified === true &&
    config.privacyNoticeApproved === true &&
    config.retentionApproved === true &&
    config.rateProtectionVerified === true
  );
}
/** Deployment switch alone never grants permission to accept patient submissions. */
export type BookingReleaseControls = {
  enabled: boolean;
  recipientBindingVerified: boolean;
  privacyNoticeApproved: boolean;
  privacyNoticePath: string;
  retentionApproved: boolean;
  rateProtectionVerified: boolean;
};
export function approvedBookingConfiguration(
  release: BookingReleaseControls,
  deliveryFlag: string | undefined,
  accessKey: string | undefined,
  privacyNoticePath: string | undefined,
): BookingDeliveryConfiguration | null {
  if (
    release.enabled !== true || deliveryFlag !== "1" ||
    !/^\/[a-z0-9][a-z0-9/-]*$/.test(release.privacyNoticePath) ||
    release.privacyNoticePath !== privacyNoticePath
  ) return null;
  const config: BookingDeliveryConfiguration = {
    accessKey: accessKey ?? "",
    recipientBindingVerified: release.recipientBindingVerified,
    privacyNoticeApproved: release.privacyNoticeApproved,
    retentionApproved: release.retentionApproved,
    rateProtectionVerified: release.rateProtectionVerified,
  };
  return bookingDeliveryReady(config) ? config : null;
}

/** Synthetic recipient verification: never accept real appointment details. */
export const SYNTHETIC_TEST_NAME = "SYNTHETIC CLINIC TEST - NOT A PATIENT";
export const SYNTHETIC_TEST_PHONE = "+12025550147";
export function isSyntheticTestPayload(payload: BookingPayload) {
  return payload.fullName === SYNTHETIC_TEST_NAME &&
    payload.phone === SYNTHETIC_TEST_PHONE &&
    payload.consultationType === "virtual" &&
    !payload.reason && !payload.preferredDate && !payload.preferredTime &&
    !payload.email && !payload.bookingNote;
}
export function createSyntheticWeb3FormsTransport(
  accessKey: string,
  authorizedPreview: boolean,
  fetcher: typeof fetch = fetch,
): ReviewTransport {
  if (!authorizedPreview) throw new Error("Synthetic form test is private-preview-only.");
  // The synthetic transport cannot replace the release approvals. Its only
  // accepted request is the exact fictional marker above.
  const config: BookingDeliveryConfiguration = {
    accessKey, recipientBindingVerified: true, privacyNoticeApproved: true,
    retentionApproved: true, rateProtectionVerified: true,
  };
  const send = createApprovedBookingTransport(config, fetcher);
  return async (payload) => isSyntheticTestPayload(payload)
    ? send(payload)
    : { kind: "definite-failure" };
}

export function bookingProviderPayload(
  payload: BookingPayload,
  accessKey: string,
) {
  const body: Record<string, string | boolean> = {
    access_key: accessKey.trim(),
    subject: "Clinic appointment request",
    from_name: "Clinic website appointment request",
    botcheck: false,
    fullName: payload.fullName,
    phone: payload.phone,
    consultationType: payload.consultationType,
  };
  // Scheduling-only data. A selected reason can reveal a diagnosis, and
  // free text can contain medical information despite the visible warning.
  // Neither belongs in a third-party email notification by default.
  for (const field of [
    "preferredDate",
    "preferredTime",
    "email",
  ] as const) {
    if (payload[field]) body[field] = payload[field];
  }
  return body;
}
export function createApprovedBookingTransport(
  config: BookingDeliveryConfiguration,
  fetcher: typeof fetch = fetch,
): ReviewTransport {
  if (!bookingDeliveryReady(config))
    throw new Error("Appointment delivery is not approved and configured.");
  return async (payload) => {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 7500);
    try {
      const response = await fetcher("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookingProviderPayload(payload, config.accessKey)),
        signal: abort.signal,
      });
      if (
        !response.headers
          .get("content-type")
          ?.toLowerCase()
          .includes("application/json")
      )
        return { kind: "uncertain" };
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("success" in result))
        return { kind: "uncertain" };
      if (response.ok && result.success === true)
        return { kind: "acknowledged" };
      if (result.success === false) return { kind: "definite-failure" };
      return { kind: "uncertain" };
    } catch {
      return { kind: "uncertain" };
    } finally {
      clearTimeout(timer);
    }
  };
}
