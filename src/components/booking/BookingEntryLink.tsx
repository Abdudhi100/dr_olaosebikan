"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BOOKING_PATH, type BookingDraft } from "@/lib/booking";
import { useAppointmentDraft } from "./AppointmentDraftProvider";

type BookingEntryLinkProps = {
  children: ReactNode;
  className?: string;
  seed?: Pick<Partial<BookingDraft>, "reason" | "consultationType">;
};

export function BookingEntryLink({
  children,
  className,
  seed,
}: BookingEntryLinkProps) {
  const { updateDraft } = useAppointmentDraft();
  return (
    <Link
      href={BOOKING_PATH}
      className={className}
      onClick={(event) => {
        // A modified click/new tab follows the ordinary URL and starts its own blank client memory.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        if (seed) updateDraft(seed);
      }}
    >
      {children}
    </Link>
  );
}
