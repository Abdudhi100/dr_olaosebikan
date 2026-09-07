import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { surfaceStyles } from "@/lib/styles";
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

      <section className="border-b border-border-subtle bg-surface-emphasis">
        <div className="mx-auto max-w-standard px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8 text-support text-text-tertiary">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Book Appointment</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand-primary-subtle px-4 py-1.5 text-support font-semibold text-brand-primary ring-1 ring-brand-primary-border">
                Appointment Request
              </span>
              <h1 id="appointment-request-heading" className="mt-5 max-w-reading text-page-title text-text-primary sm:text-page-title-lg">
                Book a specialist rheumatology consultation
              </h1>
              <p className="mt-5 max-w-reading text-lead text-text-secondary">
                Request a consultation for joint pain, stiffness, gout, lupus, rheumatoid arthritis, autoimmune symptoms, or long-term rheumatology follow-up.
              </p>

              <div className="mt-8 grid gap-4">
                <a href={`tel:${site.phoneDial}`} className={`${surfaceStyles.muted} flex items-start gap-3 p-4`}>
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-support font-semibold text-text-primary">Phone</span>
                    <span className="mt-1 block text-support text-text-tertiary">{site.phone}</span>
                  </span>
                </a>
                <a href={`mailto:${site.email}`} className={`${surfaceStyles.muted} flex min-w-0 items-start gap-3 p-4`}>
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-support font-semibold text-text-primary">Email</span>
                    <span className="mt-1 block break-all text-support text-text-tertiary">{site.email}</span>
                  </span>
                </a>
                <a href={appointmentWhatsAppUrl()} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-lg border border-success-border bg-success-subtle p-4">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span>
                    <span className="block text-support font-semibold text-text-primary">WhatsApp</span>
                    <span className="mt-1 block text-support text-success">Fastest for appointment scheduling and quick questions.</span>
                  </span>
                </a>
                <div className={`${surfaceStyles.muted} flex items-start gap-3 p-4`}>
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-support font-semibold text-text-primary">Clinic location</span>
                    <span className="mt-1 block text-support text-text-tertiary">{site.address}</span>
                  </span>
                </div>
                <div className={`${surfaceStyles.muted} flex items-start gap-3 p-4`}>
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-support font-semibold text-text-primary">Availability</span>
                    <span className="mt-1 block text-support text-text-tertiary">{site.hours}</span>
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
