"use client";
import { useMemo } from "react";
import { AppointmentForm } from "@/components/AppointmentForm";
import {
  bookingDeliveryReady,
  createApprovedBookingTransport,
} from "@/lib/booking-delivery";
export function BookingForm() {
  const transport = useMemo(() => {
    const approved = process.env.NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED === "1";
    const config = {
      accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "",
      recipientBindingVerified: approved,
      privacyNoticeApproved: approved,
      retentionApproved: approved,
      rateProtectionVerified: approved,
    };
    return approved && bookingDeliveryReady(config)
      ? createApprovedBookingTransport(config)
      : undefined;
  }, []);
  return <AppointmentForm transport={transport} />;
}
