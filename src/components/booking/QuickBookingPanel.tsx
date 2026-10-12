"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BOOKING_PATH,
  BOOKING_REASONS,
  CONSULTATION_TYPES,
  lagosDate,
  validateBooking,
  type BookingDraft,
  type BookingErrors,
} from "@/lib/booking";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import { v2ButtonStyles } from "@/lib/styles";
import { useAppointmentDraft } from "./AppointmentDraftProvider";
import styles from "./Booking.module.css";

const preferenceLabels = {
  reason: "Reason for consultation",
  consultationType: "Consultation type",
  preferredDate: "Preferred date",
  preferredTime: "Preferred time",
};
type PreferenceField = keyof typeof preferenceLabels;

export function QuickBookingPanel({
  requestLabel,
  whatsappLabel,
}: {
  requestLabel: string;
  whatsappLabel: string;
}) {
  const { draft, updateDraft } = useAppointmentDraft();
  const [ready, setReady] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const focusSummary = useRef(false);
  useEffect(() => {
    setReady(true);
    setMinimumDate(lagosDate());
  }, []);
  useEffect(() => {
    if (focusSummary.current) {
      summaryRef.current?.focus();
      focusSummary.current = false;
    }
  }, [errors]);

  function change(field: PreferenceField, value: string) {
    updateDraft({ [field]: value } as Partial<BookingDraft>);
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  }
  function fieldProps(field: PreferenceField) {
    return {
      id: `quick-${field}`,
      className: styles.control,
      value: draft[field],
      "aria-invalid": Boolean(errors[field]) || undefined,
      "aria-describedby":
        [
          field === "preferredTime" ? "quick-time-help" : "",
          errors[field] ? `quick-${field}-error` : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined,
    };
  }
  function error(field: PreferenceField) {
    return errors[field] ? (
      <p id={`quick-${field}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;
  }
  const errorFields = (
    Object.keys(preferenceLabels) as PreferenceField[]
  ).filter((field) => errors[field]);

  return (
    <div className={styles.quickForm} data-booking-quick>
      {errorFields.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className={styles.errorSummary}
          aria-labelledby="quick-error-heading"
        >
          <h3 id="quick-error-heading">Check your preferences</h3>
          <ul>
            {errorFields.map((field) => (
              <li key={field}>
                <a
                  href={`#quick-${field}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(`quick-${field}`)?.focus();
                  }}
                >
                  {preferenceLabels[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset
        disabled={!ready}
        className={styles.fields}
        aria-label="Appointment preferences"
      >
        <div className={styles.field}>
          <label htmlFor="quick-reason" className={styles.label}>
            Reason for consultation{" "}
            <span className={styles.optional}>(optional)</span>
          </label>
          <select
            {...fieldProps("reason")}
            onChange={(event) => change("reason", event.target.value)}
          >
            <option value="">Choose a reason (optional)</option>
            {BOOKING_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          {error("reason")}
        </div>
        <div className={styles.field}>
          <label htmlFor="quick-consultationType" className={styles.label}>
            Consultation type
          </label>
          <select
            {...fieldProps("consultationType")}
            onChange={(event) => change("consultationType", event.target.value)}
          >
            <option value="">In person or virtual</option>
            {CONSULTATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {error("consultationType")}
        </div>
        <div className={styles.field}>
          <label htmlFor="quick-preferredDate" className={styles.label}>
            Preferred date <span className={styles.optional}>(optional)</span>
          </label>
          <input
            {...fieldProps("preferredDate")}
            type="date"
            min={minimumDate || undefined}
            onFocus={() => setMinimumDate(lagosDate())}
            onChange={(event) => change("preferredDate", event.target.value)}
          />
          {error("preferredDate")}
        </div>
        <div className={styles.field}>
          <label htmlFor="quick-preferredTime" className={styles.label}>
            Preferred time <span className={styles.optional}>(optional)</span>
          </label>
          <input
            {...fieldProps("preferredTime")}
            type="time"
            step={60}
            onChange={(event) => change("preferredTime", event.target.value)}
          />
          <p id="quick-time-help" className={styles.help}>
            Lagos time / WAT. A preference, not an available slot.
          </p>
          {error("preferredTime")}
        </div>
      </fieldset>
      <div className={styles.quickActions}>
        <p className={styles.quickNotice}>
          Your preferred date and time are a request, not a confirmed
          appointment. Fees are communicated privately.
        </p>
        <div className={styles.quickButtons}>
          <Link
            href={BOOKING_PATH}
            className={v2ButtonStyles.primary}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              )
                return;
              const result = validateBooking(draft, {
                preferencesOnly: true,
                now: new Date(),
              });
              const nextErrors = Object.fromEntries(
                Object.entries(result.errors).filter(([, message]) =>
                  Boolean(message),
                ),
              ) as BookingErrors;
              if (Object.keys(nextErrors).length) {
                event.preventDefault();
                focusSummary.current = true;
                setErrors(nextErrors);
              }
            }}
          >
            {requestLabel}
          </Link>
          <a
            href={appointmentWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className={v2ButtonStyles.secondary}
          >
            {whatsappLabel}
          </a>
        </div>
      </div>
      <noscript>
        <p className={styles.help}>
          JavaScript is needed to carry preferences in this local prototype.
          Continue to view the appointment page, or use the generic WhatsApp
          entry. No request has been sent.
        </p>
      </noscript>
    </div>
  );
}
