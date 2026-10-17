"use client";

import {
  type FocusEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppointmentDraft } from "@/components/booking/AppointmentDraftProvider";
import styles from "@/components/booking/Booking.module.css";
import {
  BOOKING_REASONS,
  CONSULTATION_TYPES,
  countBookingNoteCharacters,
  lagosDate,
  validateBooking,
  type BookingDraft,
  type BookingErrors,
  type BookingField,
} from "@/lib/booking";
import {
  submitWithTimeout,
  type ReviewTransport,
} from "@/lib/booking-review-transport";
import { v2ButtonStyles } from "@/lib/styles";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";
import { SYNTHETIC_TEST_NAME, SYNTHETIC_TEST_PHONE } from "@/lib/booking-delivery";

type FormState =
  | "initial"
  | "invalid"
  | "submitting"
  | "acknowledged"
  | "failure"
  | "uncertain";

type AppointmentFormProps = {
  transport?: ReviewTransport;
  timeoutMs?: number;
  now?: () => Date;
  syntheticTestMode?: boolean;
  captchaRequired?: boolean;
};

// Live delivery remains disabled until recipient, privacy and retention approval.
const unavailableTransport: ReviewTransport = async () => ({
  kind: "definite-failure",
});
const currentTime = () => new Date();
const fieldOrder: BookingField[] = [
  "reason",
  "consultationType",
  "preferredDate",
  "preferredTime",
  "fullName",
  "phone",
  "email",
  "bookingNote",
];
const fieldId = (field: BookingField) => `booking-${field}`;

export function AppointmentForm({
  transport = unavailableTransport,
  timeoutMs = 8000,
  now = currentTime,
  syntheticTestMode = false,
  captchaRequired = false,
}: AppointmentFormProps) {
  const {
    draft,
    updateDraft,
    resetDraft,
    revision,
    submissionLock,
    setSubmissionLock,
    getSubmissionLock,
  } = useAppointmentDraft();
  const [state, setState] = useState<FormState>(() =>
    submissionLock === "uncertain"
      ? "uncertain"
      : submissionLock === "submitting"
        ? "submitting"
        : "initial",
  );
  const [errors, setErrors] = useState<BookingErrors>({});
  const [hydrated, setHydrated] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const summaryFocusRequestedRef = useRef(false);
  const resetFocusRequestedRef = useRef(false);
  const mountedRef = useRef(false);
  const busyRef = useRef(false);
  const attemptRef = useRef(0);
  const revisionRef = useRef(revision);
  const ownResetRevisionRef = useRef<number | null>(null);
  const clockRef = useRef(now);
  clockRef.current = now;
  revisionRef.current = revision;

  useEffect(() => {
    mountedRef.current = true;
    setHydrated(true);
    const refreshDate = () => setMinDate(lagosDate(clockRef.current()));
    refreshDate();
    window.addEventListener("focus", refreshDate);
    const timer = window.setInterval(refreshDate, 60000);
    return () => {
      mountedRef.current = false;
      if (busyRef.current && getSubmissionLock() === "submitting")
        setSubmissionLock("uncertain");
      busyRef.current = false;
      attemptRef.current += 1;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshDate);
    };
  }, []);

  // Load hCaptcha only when the release register has enabled real bookings.
  // No third-party challenge script runs on the disabled form or synthetic tests.
  useEffect(() => {
    if (!captchaRequired) return;
    if (document.querySelector('script[data-clinic-hcaptcha="true"]')) return;
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.clinicHcaptcha = "true";
    document.head.appendChild(script);
  }, [captchaRequired]);

  useEffect(() => {
    attemptRef.current += 1;
    busyRef.current = false;
    setErrors({});
    if (ownResetRevisionRef.current !== revision) {
      const lock = getSubmissionLock();
      setState(
        lock === "uncertain"
          ? "uncertain"
          : lock === "submitting"
            ? "submitting"
            : "initial",
      );
    }
    ownResetRevisionRef.current = null;
  }, [revision, getSubmissionLock]);

  useEffect(() => {
    if (submissionLock === "uncertain") setState("uncertain");
    else if (submissionLock === "submitting") setState("submitting");
  }, [submissionLock]);

  useEffect(() => {
    if (state === "invalid" && summaryFocusRequestedRef.current) {
      summaryFocusRequestedRef.current = false;
      summaryRef.current?.focus();
    }
  }, [state, errors]);

  useEffect(() => {
    if (
      state === "acknowledged" ||
      state === "failure" ||
      state === "uncertain"
    )
      statusRef.current?.focus();
  }, [state]);

  useEffect(() => {
    if (resetFocusRequestedRef.current && state === "initial") {
      resetFocusRequestedRef.current = false;
      document.getElementById(fieldId("reason"))?.focus();
    }
  }, [state, revision]);

  function keepFocusedControlVisible(event: FocusEvent<HTMLFormElement>) {
    const control = event.target;
    if (
      !(
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      )
    )
      return;
    window.requestAnimationFrame(() => {
      if (
        !mountedRef.current ||
        !control.isConnected ||
        document.activeElement !== control
      )
        return;
      const bounds = control.getBoundingClientRect();
      const headerBottom =
        document.querySelector("header")?.getBoundingClientRect().bottom || 0;
      const viewportTop = window.visualViewport?.offsetTop || 0;
      const viewportBottom =
        viewportTop + (window.visualViewport?.height || window.innerHeight);
      if (
        bounds.top < Math.max(headerBottom, viewportTop) + 12 ||
        bounds.bottom > viewportBottom - 12
      ) {
        control.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "instant",
        });
      }
    });
  }

  function change(field: BookingField, value: string) {
    updateDraft({ [field]: value } as Partial<BookingDraft>);
    if (errors[field])
      setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function reset() {
    attemptRef.current += 1;
    busyRef.current = false;
    ownResetRevisionRef.current = null;
    resetFocusRequestedRef.current = true;
    setErrors({});
    setCaptchaError(false);
    setState("initial");
    resetDraft();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !hydrated ||
      busyRef.current ||
      getSubmissionLock() ||
      state === "uncertain" ||
      state === "acknowledged"
    )
      return;

    const clock = now();
    setMinDate(lagosDate(clock));
    const result = validateBooking(draft, { now: clock });
    setErrors(result.errors);
    if (!result.payload) {
      summaryFocusRequestedRef.current = true;
      setState("invalid");
      return;
    }
    const challengeResponse = captchaRequired
      ? event.currentTarget.querySelector<HTMLTextAreaElement>('textarea[name="h-captcha-response"]')?.value.trim()
      : undefined;
    if (captchaRequired && !challengeResponse) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    busyRef.current = true;
    setSubmissionLock("submitting");
    const attempt = ++attemptRef.current;
    const requestRevision = revisionRef.current;
    setState("submitting");
    const outcome = await submitWithTimeout(
      transport,
      challengeResponse ? { ...result.payload, hCaptchaResponse: challengeResponse } : result.payload,
      timeoutMs,
    );
    if (
      !mountedRef.current ||
      attempt !== attemptRef.current ||
      requestRevision !== revisionRef.current
    )
      return;
    busyRef.current = false;

    if (outcome.kind === "acknowledged") {
      ownResetRevisionRef.current = revisionRef.current + 1;
      resetDraft();
      setState("acknowledged");
    } else {
      setSubmissionLock(
        outcome.kind === "definite-failure" ? null : "uncertain",
      );
      setState(outcome.kind === "definite-failure" ? "failure" : "uncertain");
    }
  }

  function describedBy(field: BookingField, helper?: string) {
    return (
      [helper, errors[field] ? `${fieldId(field)}-error` : undefined]
        .filter(Boolean)
        .join(" ") || undefined
    );
  }

  function errorFor(field: BookingField) {
    return errors[field] ? (
      <p id={`${fieldId(field)}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;
  }

  const statusMessage =
    state === "submitting"
      ? "Sending your request…"
      : state === "acknowledged"
        ? syntheticTestMode
          ? "Synthetic request accepted by Web3Forms. Check the clinic inbox for actual delivery. No appointment has been requested or confirmed."
          : "Request submitted. The clinic will contact you to confirm availability and the consultation arrangements. Your appointment is not confirmed yet."
        : state === "failure"
          ? transport === unavailableTransport
            ? "Online appointment delivery is not available yet. Your details have not been sent. Please call or contact the clinic through WhatsApp to arrange your appointment."
            : "We could not submit your request. Your details are still here. Please try again or contact the clinic through WhatsApp."
          : state === "uncertain"
            ? syntheticTestMode
              ? "The test response is uncertain. Check the inbox before attempting another test."
              : "We could not verify whether your request was submitted. Please contact the clinic before sending it again."
            : "";

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={keepFocusedControlVisible}
      noValidate
      aria-labelledby="appointment-request-heading"
      className={styles.form}
      data-booking-state={state}
    >
      <p className={styles.intro}>
        Fields marked * are required. Date and time are preferences, not
        available appointment slots. Your appointment is confirmed separately by
        the clinic.
      </p>
      {syntheticTestMode && (
        <div className={styles.prototype} role="note">
          <strong>SYNTHETIC TEST MODE — NOT AN APPOINTMENT.</strong>
          <p>Only these fictional details can be sent: Full name <strong>{SYNTHETIC_TEST_NAME}</strong>, phone <strong>{SYNTHETIC_TEST_PHONE}</strong>, consultation type <strong>Virtual</strong>. Leave all other fields blank. Do not enter real names, phone numbers, health information or symptoms.</p>
        </div>
      )}
      {transport === unavailableTransport && (
        <p className={styles.prototype}>
          Online appointment delivery is not available yet. Please contact the
          clinic to arrange your consultation.
        </p>
      )}
      <noscript>
        <p className={styles.prototype}>
          JavaScript is needed to use these controls. You can use the generic
          WhatsApp link; opening it does not send a message.
        </p>
      </noscript>

      {state === "invalid" && fieldOrder.some((field) => errors[field]) ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className={styles.errorSummary}
          aria-labelledby="booking-error-heading"
          role="alert"
        >
          <h2 id="booking-error-heading">
            Please check your appointment request
          </h2>
          <ul>
            {fieldOrder
              .filter((field) => errors[field])
              .map((field) => (
                <li key={field}>
                  <a
                    href={`#${fieldId(field)}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(fieldId(field))?.focus();
                    }}
                  >
                    {errors[field]}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div
        ref={statusRef}
        className={styles.status}
        data-state={state}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={statusMessage ? -1 : undefined}
      >
        {statusMessage ? (
          <>
            {state === "acknowledged" && transport !== unavailableTransport ? (
              <strong>Request acknowledgement</strong>
            ) : null}
            <p>{statusMessage}</p>
          </>
        ) : null}
      </div>

      <fieldset
        disabled={
          !hydrated || state === "submitting" || state === "acknowledged"
        }
        className={styles.fieldset}
        aria-label="Appointment preferences and contact details"
      >
        <div className={styles.fields}>
          <h2
            id="appointment-request-heading"
            className={`${styles.title} ${styles.fullWidth}`}
          >
            Appointment preferences
          </h2>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor={fieldId("reason")} className={styles.label}>
              Reason for consultation{" "}
              <span className={styles.optional}>(optional; stays on this page)</span>
            </label>
            <select
              id={fieldId("reason")}
              value={draft.reason}
              onChange={(event) => change("reason", event.target.value)}
              className={styles.control}
              aria-invalid={!!errors.reason}
              aria-describedby={describedBy("reason")}
            >
              <option value="">Choose a reason (optional)</option>
              {BOOKING_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errorFor("reason")}
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <span id="booking-type-label" className={styles.label}>
              Consultation type *
            </span>
            <label
              hidden
              htmlFor={fieldId("consultationType")}
              className={styles.label}
            >
              Consultation type *
            </label>
            <div
              id={fieldId("consultationType")}
              className={styles.radioGroup}
              role="radiogroup"
              tabIndex={-1}
              aria-labelledby="booking-type-label"
              aria-required="true"
              aria-invalid={!!errors.consultationType}
              aria-describedby={describedBy("consultationType")}
            >
              {CONSULTATION_TYPES.map((type) => (
                <label className={styles.radioCard} key={type.value}>
                  <input
                    type="radio"
                    checked={draft.consultationType === type.value}
                    value={type.value}
                    onChange={() => change("consultationType", type.value)}
                    required
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
            {errorFor("consultationType")}
          </div>
          <div className={styles.field}>
            <label htmlFor={fieldId("preferredDate")} className={styles.label}>
              Preferred date <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id={fieldId("preferredDate")}
              type="date"
              min={minDate || undefined}
              value={draft.preferredDate}
              onChange={(event) => change("preferredDate", event.target.value)}
              className={styles.control}
              aria-invalid={!!errors.preferredDate}
              aria-describedby={describedBy(
                "preferredDate",
                "booking-date-help",
              )}
            />
            <p id="booking-date-help" className={styles.help}>
              Today or a future date in Lagos.
            </p>
            {errorFor("preferredDate")}
          </div>
          <div className={styles.field}>
            <label htmlFor={fieldId("preferredTime")} className={styles.label}>
              Preferred time{" "}
              <span className={styles.optional}>(WAT, optional)</span>
            </label>
            <input
              id={fieldId("preferredTime")}
              type="time"
              value={draft.preferredTime}
              onChange={(event) => change("preferredTime", event.target.value)}
              className={styles.control}
              aria-invalid={!!errors.preferredTime}
              aria-describedby={describedBy(
                "preferredTime",
                "booking-time-help",
              )}
            />
            <p id="booking-time-help" className={styles.help}>
              Lagos time / WAT (UTC+1), not an available slot.
            </p>
            {errorFor("preferredTime")}
          </div>
          <div className={`${styles.notice} ${styles.fullWidth}`}>
            <p>
              Your preferred date and time are a request, not a confirmed
              appointment.
            </p>
            <p>
              The clinic will contact you to agree availability and the
              consultation arrangements.
            </p>
          </div>
          <h2
            className={`${styles.title} ${styles.fullWidth} ${styles.contactTitle}`}
          >
            Your contact details
          </h2>
          <div className={styles.field}>
            <label htmlFor={fieldId("fullName")} className={styles.label}>
              Full name *
            </label>
            <input
              id={fieldId("fullName")}
              type="text"
              required
              autoComplete="name"
              value={draft.fullName}
              onChange={(event) => change("fullName", event.target.value)}
              className={styles.control}
              placeholder="Your full name"
              aria-invalid={!!errors.fullName}
              aria-describedby={describedBy("fullName")}
            />
            {errorFor("fullName")}
          </div>
          <div className={styles.field}>
            <label htmlFor={fieldId("phone")} className={styles.label}>
              Phone number *
            </label>
            <input
              id={fieldId("phone")}
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              value={draft.phone}
              onChange={(event) => change("phone", event.target.value)}
              className={styles.control}
              placeholder="Your phone number"
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy("phone", "booking-phone-help")}
            />
            <p id="booking-phone-help" className={styles.help}>
              Include your country code when applicable.
            </p>
            {errorFor("phone")}
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor={fieldId("email")} className={styles.label}>
              Email <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id={fieldId("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={draft.email}
              onChange={(event) => change("email", event.target.value)}
              className={styles.control}
              placeholder="Your email address"
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("email")}
            />
            {errorFor("email")}
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor={fieldId("bookingNote")} className={styles.label}>
              Booking note <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id={fieldId("bookingNote")}
              rows={4}
              autoComplete="off"
              value={draft.bookingNote}
              onChange={(event) => change("bookingNote", event.target.value)}
              className={styles.control}
              placeholder="Appointment arrangements only—no medical details."
              aria-invalid={!!errors.bookingNote}
              aria-describedby={describedBy(
                "bookingNote",
                "booking-note-help booking-note-count",
              )}
            />
            <p id="booking-note-help" className={styles.help}>
              For your own reference only; this text is not emailed to the
              clinic. Do not include symptoms, diagnoses or medical records.
            </p>
            <p id="booking-note-count" className={styles.help}>
              {countBookingNoteCharacters(draft.bookingNote)} of 300 characters.
              Maximum 300 characters.
            </p>
            {errorFor("bookingNote")}
          </div>
        </div>
        <p className={styles.privacy}>
          Please do not enter medical records or detailed medical information.
          The consultation reason and booking note stay in this page only; they
          are excluded from Web3Forms email notifications.
          {transport === unavailableTransport
            ? " These controls cannot currently send your request. Contact the clinic to arrange your appointment."
            : " Only the required contact details and scheduling preferences are sent to arrange your appointment."}
        </p>
        {transport !== unavailableTransport &&
          process.env.NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH && (
            <a
              className={styles.help}
              href={process.env.NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH}
            >
              Read the clinic appointment privacy notice
            </a>
          )}
        {draft.reason ||
        draft.consultationType ||
        draft.preferredDate ||
        draft.preferredTime ? (
          <section
            className={styles.preferenceSummary}
            aria-labelledby="booking-preferences-heading"
          >
            <h2 id="booking-preferences-heading">Review your preferences</h2>
            <dl>
              {draft.reason ? (
                <div>
                  <dt>Reason for consultation</dt>
                  <dd>{draft.reason}</dd>
                </div>
              ) : null}
              {draft.consultationType ? (
                <div>
                  <dt>Consultation type</dt>
                  <dd>
                    {CONSULTATION_TYPES.find(
                      (type) => type.value === draft.consultationType,
                    )?.label || draft.consultationType}
                  </dd>
                </div>
              ) : null}
              {draft.preferredDate ? (
                <div>
                  <dt>Preferred date (Lagos)</dt>
                  <dd>{draft.preferredDate} (YYYY-MM-DD)</dd>
                </div>
              ) : null}
              {draft.preferredTime ? (
                <div>
                  <dt>Preferred time</dt>
                  <dd>{draft.preferredTime} WAT (Lagos)</dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}
        {captchaRequired && (
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <p className={styles.help}>Complete the security check before submitting. The challenge is processed by hCaptcha.</p>
            <div className="h-captcha" data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" data-theme="light" />
            {captchaError && <p role="alert" className={styles.error}>Complete the security check before sending an appointment request.</p>}
          </div>
        )}
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={
              !hydrated ||
              state === "submitting" ||
              state === "acknowledged" ||
              state === "uncertain"
            }
            className={v2ButtonStyles.primary}
          >
            {state === "submitting"
              ? syntheticTestMode ? "Sending fictional test…" : "Sending your request…"
              : state === "failure"
                ? syntheticTestMode ? "Try fictional test again" : "Try request again"
                : syntheticTestMode ? "Send fictional test" : "Send appointment request"}
          </button>
          <a
            href={appointmentWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={v2ButtonStyles.secondary}
          >
            Book via WhatsApp
          </a>
        </div>
        <p className={styles.help}>
          Submitting a request does not confirm an appointment. Opening WhatsApp
          does not submit this form or send a message.
        </p>
      </fieldset>
      {hydrated ? (
        <button type="button" onClick={reset} className={styles.reset}>
          {state === "acknowledged"
            ? "Start another request"
            : "Clear this request"}
        </button>
      ) : null}
    </form>
  );
}
