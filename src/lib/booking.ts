export const BOOKING_PATH = "/appointments/book";

export const BOOKING_REASONS = [
  "Pain consultation",
  "Arthritis consultation",
  "Autoimmune consultation",
  "Rheumatology consultation",
  "Follow-up consultation",
  "Joint pain and stiffness",
  "Lupus care",
  "Gout treatment",
  "Chronic pain",
  "Other rheumatology concerns",
] as const;

export const CARE_REASON_BY_MEDIA = {
  pain: "Pain consultation",
  knee: "Arthritis consultation",
  autoimmune: "Autoimmune consultation",
  gout: "Gout treatment",
  rheumatology: "Rheumatology consultation",
  followup: "Follow-up consultation",
} as const satisfies Record<string, (typeof BOOKING_REASONS)[number]>;

export const CONSULTATION_TYPES = [
  { value: "in-person", label: "In person" },
  { value: "virtual", label: "Virtual" },
] as const;

export type ConsultationType = (typeof CONSULTATION_TYPES)[number]["value"];
export type BookingDraft = {
  reason: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  phone: string;
  email: string;
  bookingNote: string;
};
export type BookingField = keyof BookingDraft;
export type BookingErrors = Partial<Record<BookingField, string>>;
export type BookingValues = Partial<BookingDraft>;
export type BookingPayload = BookingValues & {
  fullName: string;
  phone: string;
  consultationType: ConsultationType;
  // Web3Forms human-verification token exists only for an approved live form.
  // It is never persisted in the appointment draft or included in URLs.
  hCaptchaResponse?: string;
};

const EMPTY_BOOKING_DRAFT: Readonly<BookingDraft> = Object.freeze({
  reason: "",
  consultationType: "",
  preferredDate: "",
  preferredTime: "",
  fullName: "",
  phone: "",
  email: "",
  bookingNote: "",
});

export function createEmptyBookingDraft(): BookingDraft {
  return { ...EMPTY_BOOKING_DRAFT };
}

/** The eligibility date is always Lagos's calendar date, independent of the browser zone. */
export function lagosDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function trim(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Count Unicode code points after trimming; this is not UTF-16 units or grapheme clusters. */
export function countBookingNoteCharacters(value: string): number {
  return Array.from(trim(value)).length;
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/**
 * Formatting check only: 7–15 ASCII digits, an optional leading +, and common
 * spaces, parentheses, dots or hyphens. An explicit country code cannot start
 * with zero. National formatting is retained without guessing a country.
 * This does not establish country-code validity, reachability or ownership.
 */
function isPhoneFormat(value: string): boolean {
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const compact = value.replace(/[\s().-]/g, "");
  return /^\+?[0-9]{7,15}$/.test(compact) && !compact.startsWith("+0");
}

export function validateBooking(
  draft: BookingDraft,
  {
    now = new Date(),
    preferencesOnly = false,
  }: { now?: Date; preferencesOnly?: boolean } = {},
): {
  errors: BookingErrors;
  normalized: BookingValues;
  payload: BookingPayload | null;
} {
  const values: BookingDraft = {
    reason: trim(draft.reason),
    consultationType: trim(draft.consultationType),
    preferredDate: trim(draft.preferredDate),
    preferredTime: trim(draft.preferredTime),
    fullName: trim(draft.fullName).replace(/\s+/g, " "),
    phone: trim(draft.phone),
    email: trim(draft.email),
    bookingNote: trim(draft.bookingNote),
  };
  const errors: BookingErrors = {};

  if (
    values.reason &&
    !(BOOKING_REASONS as readonly string[]).includes(values.reason)
  ) {
    errors.reason = "Choose a reason from the list, or leave it blank.";
  }
  if (
    values.consultationType &&
    !CONSULTATION_TYPES.some((type) => type.value === values.consultationType)
  ) {
    errors.consultationType = "Choose In person or Virtual.";
  } else if (!preferencesOnly && !values.consultationType) {
    errors.consultationType = "Choose a consultation type.";
  }
  if (values.preferredDate) {
    if (!isCalendarDate(values.preferredDate)) {
      errors.preferredDate = "Enter a valid date.";
    } else if (values.preferredDate < lagosDate(now)) {
      errors.preferredDate = "Choose today or a later date in Lagos.";
    }
  }
  if (
    values.preferredTime &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.preferredTime)
  ) {
    errors.preferredTime = "Enter a valid time in 24-hour Lagos time (WAT).";
  }

  if (!preferencesOnly) {
    if (!values.fullName) errors.fullName = "Enter your full name.";
    else if (/[\u0000-\u001f\u007f]/.test(values.fullName)) {
      errors.fullName = "Enter your full name without control characters.";
    }
    if (!values.phone) errors.phone = "Enter your phone number.";
    else if (!isPhoneFormat(values.phone)) {
      errors.phone =
        "Enter a phone number with 7 to 15 digits, using an optional + and country code.";
    }
    if (
      values.email &&
      (values.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    ) {
      errors.email = "Enter a valid email address, or leave it blank.";
    }
    if (countBookingNoteCharacters(values.bookingNote) > 300) {
      errors.bookingNote = "Keep your booking note to 300 characters or fewer.";
    }
  }

  // Construct from explicit fields; never spread a supplied draft into a payload.
  const normalized: BookingValues = {};
  for (const field of Object.keys(values) as BookingField[]) {
    if (values[field]) normalized[field] = values[field];
  }
  if (normalized.phone)
    normalized.phone = normalized.phone.replace(/[\s().-]/g, "");

  const finalFieldsPresent = Boolean(
    values.fullName && values.phone && values.consultationType,
  );
  const payload =
    !preferencesOnly && finalFieldsPresent && Object.keys(errors).length === 0
      ? {
          ...normalized,
          fullName: values.fullName,
          phone: normalized.phone!,
          consultationType: values.consultationType as ConsultationType,
        }
      : null;
  return { errors, normalized, payload };
}
