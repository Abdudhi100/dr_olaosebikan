"use client";
import { useMemo } from "react";
import release from "../../../config/clinic-release.json";
import { AppointmentForm } from "@/components/AppointmentForm";
import {
  approvedBookingConfiguration,
  createApprovedBookingTransport,
} from "@/lib/booking-delivery";

/**
 * The controlled fictional Web3Forms browser test completed on 17 October
 * 2026. Its temporary preview-only submission path is intentionally no longer
 * connected to this component, even if an old Cloudflare build flag remains.
 * The real form requires the explicit release register AND environment approval.
 */
export function BookingForm() {
  const transport = useMemo(() => {
    const approved = approvedBookingConfiguration(
      release.booking,
      process.env.NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED,
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
      process.env.NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH,
    );
    return approved ? createApprovedBookingTransport(approved) : undefined;
  }, []);
  // Keep booking CAPTCHA-free by default; review provider spam controls separately.
  // Optional challenge support remains dormant for a future explicit opt-in.
  return <AppointmentForm transport={transport} />;
}
