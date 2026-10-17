"use client";
import { useEffect, useMemo, useState } from "react";
import release from "../../../config/clinic-release.json";
import { AppointmentForm } from "@/components/AppointmentForm";
import {
  approvedBookingConfiguration,
  bookingDeliveryReady,
  createApprovedBookingTransport,
  createSyntheticWeb3FormsTransport,
} from "@/lib/booking-delivery";

const protectedPreviewHost = "preview-clinic-20261014.dr-olaosebikan-git.pages.dev";

export function BookingForm() {
  const [syntheticTestMode, setSyntheticTestMode] = useState(false);
  useEffect(() => {
    setSyntheticTestMode(
      release.privatePreviewAccessVerified === true &&
      release.booking.enabled === false &&
      process.env.NEXT_PUBLIC_CLINIC_HERO_PREVIEW === "1" &&
      process.env.NEXT_PUBLIC_CLINIC_WEB3FORMS_TEST === "1" &&
      window.location.hostname === protectedPreviewHost,
    );
  }, []);
  const transport = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
    if (syntheticTestMode) {
      // This pathway can send ONLY the fixed fictional identity. It does not
      // authorize real patients or change the release register.
      const fictionalConfiguration = {
        accessKey: key, recipientBindingVerified: true,
        privacyNoticeApproved: true, retentionApproved: true,
        rateProtectionVerified: true,
      };
      return bookingDeliveryReady(fictionalConfiguration)
        ? createSyntheticWeb3FormsTransport(key, true)
        : undefined;
    }
    const approved = approvedBookingConfiguration(
      release.booking,
      process.env.NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED,
      key,
      process.env.NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH,
    );
    return approved ? createApprovedBookingTransport(approved) : undefined;
  }, [syntheticTestMode]);
  return <AppointmentForm transport={transport} syntheticTestMode={syntheticTestMode} />;
}
