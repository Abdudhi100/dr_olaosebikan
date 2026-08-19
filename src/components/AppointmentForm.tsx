"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, MessageCircle, Send } from "lucide-react";
import { services, site } from "@/lib/content";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const FORM_SUBJECT = "New Appointment Request - Dr Olaosebikan Clinic";

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
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value={FORM_SUBJECT} />
      <input type="hidden" name="from_name" value={site.clinicName} />
      <input type="hidden" name="clinic" value={site.clinicName} />
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      {statusMessage ? (
        <div
          className={`sm:col-span-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
          Patient full name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+234..." className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
          Email address <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-semibold text-slate-800">
          Preferred appointment date
        </label>
        <input id="preferredDate" name="preferredDate" type="date" required min={minDate || undefined} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>

      <div>
        <label htmlFor="preferredTime" className="block text-sm font-semibold text-slate-800">
          Preferred appointment time <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input id="preferredTime" name="preferredTime" type="time" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="service" className="block text-sm font-semibold text-slate-800">
          Reason for visit
        </label>
        <select id="service" name="service" required defaultValue="" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
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
        <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
          Scheduling note <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={4} aria-describedby="message-privacy" placeholder="Share callback preferences or simple scheduling context only." className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
        <p id="message-privacy" className="mt-2 text-xs leading-relaxed text-slate-500">
          Please do not include sensitive medical information. The clinic will contact you to discuss your appointment securely.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" disabled={isSubmitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
          <Send className="h-5 w-5" aria-hidden="true" />
          {isSubmitting ? "Sending..." : "Submit Request"}
        </button>
        <a href={appointmentWhatsAppUrl()} onClick={handleWhatsApp} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Send on WhatsApp
        </a>
      </div>

      <p className="sm:col-span-2 text-sm leading-relaxed text-slate-500">
        Appointment requests are reviewed before confirmation. If symptoms are urgent or severe, visit the nearest hospital.
      </p>

      <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
        Weekday and weekend appointments are scheduled by confirmation.
      </div>
    </form>
  );
}
