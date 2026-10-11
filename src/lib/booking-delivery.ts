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
  for (const field of [
    "reason",
    "preferredDate",
    "preferredTime",
    "email",
    "bookingNote",
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
