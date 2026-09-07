"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, MessageCircle, Send } from "lucide-react";
import { services, site } from "@/lib/content";
import { buttonStyles } from "@/lib/styles";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const FORM_SUBJECT = "New Appointment Request - Dr Olaosebikan Clinic";
const fieldClassName = "mt-2 w-full rounded-lg border border-border-control px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary shadow-subtle outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary";
const labelClassName = "block text-support font-semibold text-text-secondary";

type AppointmentFormFields = {
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  service: string;
  message: string;
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

function todayInputValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function fieldsFromForm(form: HTMLFormElement): AppointmentFormFields {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    preferredDate: String(data.get("preferredDate") || "").trim(),
    preferredTime: String(data.get("preferredTime") || "").trim(),
    service: String(data.get("service") || "").trim(),
    message: String(data.get("message") || "").trim(),
  };
}

async function parseWeb3FormsResponse(response: Response): Promise<Web3FormsResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return {};
  }

  try {
    const body: unknown = await response.json();

    if (!body || typeof body !== "object") {
      return {};
    }

    const result = body as Record<string, unknown>;

    return {
      success: typeof result.success === "boolean" ? result.success : undefined,
      message: typeof result.message === "string" ? result.message : undefined,
    };
  } catch {
    return {};
  }
}

export function AppointmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");
  const accessKey = (
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
    site.web3FormsAccessKey ||
    ""
  ).trim();

  useEffect(() => {
    setMinDate(todayInputValue());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (isSubmitting) return;

    const fields = fieldsFromForm(form);
    const earliestDate = minDate || todayInputValue();

    if (fields.preferredDate < earliestDate) {
      setStatus("error");
      setStatusMessage("Please choose today or a future date for the appointment request.");
      return;
    }

    if (!accessKey) {
      setStatus("error");
      setStatusMessage("Online email booking is not configured yet. Please use the WhatsApp option below or call the clinic.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    const data = new FormData(form);
    const payload = {
      access_key: accessKey,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      preferredDate: fields.preferredDate,
      preferredTime: fields.preferredTime,
      service: fields.service,
      message: fields.message,
      subject: FORM_SUBJECT,
      botcheck: String(data.get("botcheck") || ""),
      from_name: site.clinicName,
      clinic: site.clinicName,
    };

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await parseWeb3FormsResponse(response);

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Unable to submit appointment request.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Sorry, your request could not be sent right now. Please try again or use the WhatsApp option below.");
      setIsSubmitting(false);
      return;
    }

    try {
      form.reset();
    } catch {
      // Reset is best-effort after confirmed delivery; do not report a sent request as failed.
    }

    setStatus("success");
    setStatusMessage("Thank you. Your appointment request has been sent. The clinic will review it and contact you to confirm.");
    setIsSubmitting(false);
  }

  function handleWhatsApp(event: MouseEvent<HTMLAnchorElement>) {
    if (!formRef.current) return;

    event.preventDefault();
    window.open(
      appointmentWhatsAppUrl(fieldsFromForm(formRef.current)),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      ref={formRef}
      action={WEB3FORMS_ENDPOINT}
      method="post"
      aria-labelledby="appointment-request-heading"
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-border-subtle bg-surface-emphasis p-5 sm:grid-cols-2 sm:p-6"
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value={FORM_SUBJECT} />
      <input type="hidden" name="from_name" value={site.clinicName} />
      <input type="hidden" name="clinic" value={site.clinicName} />
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      {statusMessage ? (
        <div
          className={`sm:col-span-2 rounded-lg border px-4 py-3 text-support font-medium ${
            status === "success"
              ? "border-success-border bg-success-subtle text-success"
              : "border-danger-border bg-danger-subtle text-danger"
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <label htmlFor="name" className={labelClassName}>
          Patient full name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="phone" className={labelClassName}>
          Phone number
        </label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+234..." className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Email address <span className="font-normal text-text-tertiary">(optional)</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="preferredDate" className={labelClassName}>
          Preferred appointment date
        </label>
        <input id="preferredDate" name="preferredDate" type="date" required min={minDate || undefined} className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="preferredTime" className={labelClassName}>
          Preferred appointment time <span className="font-normal text-text-tertiary">(optional)</span>
        </label>
        <input id="preferredTime" name="preferredTime" type="time" className={fieldClassName} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="service" className={labelClassName}>
          Reason for visit
        </label>
        <select id="service" name="service" required defaultValue="" className={`${fieldClassName} bg-surface-emphasis`}>
          <option value="" disabled>
            Select a care area
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Other rheumatology concern">Other rheumatology concern</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClassName}>
          Scheduling note <span className="font-normal text-text-tertiary">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={4} aria-describedby="message-privacy" placeholder="Share callback preferences or simple scheduling context only." className={fieldClassName} />
        <p id="message-privacy" className="mt-2 text-xs leading-relaxed text-text-tertiary">
          Please do not include sensitive medical information. The clinic will contact you to discuss your appointment securely.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" disabled={isSubmitting} className={`${buttonStyles.primary} flex-1 disabled:cursor-not-allowed disabled:opacity-70`}>
          <Send className="h-5 w-5" aria-hidden="true" />
          {isSubmitting ? "Sending..." : "Submit Request"}
        </button>
        <a href={appointmentWhatsAppUrl()} onClick={handleWhatsApp} target="_blank" rel="noreferrer" className={`${buttonStyles.secondarySuccess} flex-1`}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Send on WhatsApp
        </a>
      </div>

      <p className="sm:col-span-2 text-support text-text-tertiary">
        Appointment requests are reviewed before confirmation. If symptoms are urgent or severe, visit the nearest hospital.
      </p>

      <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-brand-primary-subtle px-4 py-3 text-support font-semibold text-brand-primary">
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
        Weekday and weekend appointments are scheduled by confirmation.
      </div>
    </form>
  );
}
