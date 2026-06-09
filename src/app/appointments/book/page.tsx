import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = defaultMetadata({
  title: "Book Appointment - Pain, Arthritis, Autoimmune & Rheumatology Clinic",
  description: "Book a consultation for arthritis, gout, lupus, inflammatory back pain, joint pain and chronic pain management with Dr Olaosebikan.",
  keywords: [
    "book rheumatology appointment Lagos",
    "arthritis clinic appointment Lagos",
    "Dr Olaosebikan appointment",
  ],
  path: "/appointments/book",
});

export default function BookAppointmentPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: "Book Appointment",
          url: `${site.siteUrl}/appointments/book`,
          description: metadata.description,
        }}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Book Appointment</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                Appointment Request
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Book a specialist rheumatology consultation
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                Request a consultation for joint pain, stiffness, gout, lupus, rheumatoid arthritis, autoimmune symptoms, or long-term rheumatology follow-up.
              </p>

              <div className="mt-8 grid gap-4">
                <a href={`tel:${site.phoneDial}`} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">Phone</span>
                    <span className="mt-1 block text-sm text-slate-600">{site.phone}</span>
                  </span>
                </a>
                <a href={`mailto:${site.email}`} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">Email</span>
                    <span className="mt-1 block break-all text-sm text-slate-600">{site.email}</span>
                  </span>
                </a>
                <a href={appointmentWhatsAppUrl()} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-emerald-950">WhatsApp</span>
                    <span className="mt-1 block text-sm text-emerald-800">Fastest for appointment scheduling and quick questions.</span>
                  </span>
                </a>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">Clinic location</span>
                    <span className="mt-1 block text-sm text-slate-600">{site.address}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">Availability</span>
                    <span className="mt-1 block text-sm text-slate-600">{site.hours}</span>
                  </span>
                </div>
              </div>
            </div>

            <AppointmentForm />
          </div>
        </div>
      </section>
    </>
  );
}
