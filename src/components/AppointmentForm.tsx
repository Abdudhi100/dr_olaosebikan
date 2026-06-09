"use client";

import { FormEvent, MouseEvent, useRef } from "react";
import { CalendarDays, MessageCircle, Send } from "lucide-react";
import { services, site } from "@/lib/content";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

function fieldsFromForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || ""),
    phone: String(data.get("phone") || ""),
    email: String(data.get("email") || ""),
    preferredDate: String(data.get("preferredDate") || ""),
    preferredTime: String(data.get("preferredTime") || ""),
    service: String(data.get("service") || ""),
    message: String(data.get("message") || ""),
  };
}

export function AppointmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const formAction = site.appointmentFormAction.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (formAction) return;

    event.preventDefault();
    window.open(appointmentWhatsAppUrl(fieldsFromForm(event.currentTarget)), "_blank", "noopener,noreferrer");
  }

  function handleWhatsApp(event: MouseEvent<HTMLAnchorElement>) {
    if (!formRef.current) return;

    event.preventDefault();
    window.open(appointmentWhatsAppUrl(fieldsFromForm(formRef.current)), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      ref={formRef}
      action={formAction || undefined}
      method="post"
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"
    >
      <input type="hidden" name="_subject" value="New appointment request - Dr Olaosebikan Clinic" />
      <input type="hidden" name="clinic" value={site.clinicName} />

      <div className="sm:col-span-2">
        <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
          Patient full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+234..."
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-semibold text-slate-800">
          Preferred appointment date
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          required
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="preferredTime" className="block text-sm font-semibold text-slate-800">
          Preferred appointment time
        </label>
        <input
          id="preferredTime"
          name="preferredTime"
          type="time"
          required
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="service" className="block text-sm font-semibold text-slate-800">
          Service/complaint type
        </label>
        <select
          id="service"
          name="service"
          required
          defaultValue=""
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="" disabled>
            Select a service
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
          Message or symptoms
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
          Submit Request
        </button>
        <a
          href={appointmentWhatsAppUrl()}
          onClick={handleWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
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
