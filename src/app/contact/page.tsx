import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { surfaceStyles } from "@/lib/styles";
import { appointmentWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = defaultMetadata({
  title: "Contact | Dr Olaosebikan",
  description: "Contact the clinic via phone, WhatsApp, email, and appointment request.",
  keywords: [
    "contact rheumatology clinic Lagos",
    "arthritis clinic contact Lagos",
    "book rheumatology appointment Lagos",
  ],
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Dr Olaosebikan",
          url: `${site.siteUrl}/contact`,
          description: metadata.description,
        }}
      />

      <PageHero
        eyebrow="Contact & Appointments"
        title="Get in touch with Dr Olaosebikan"
        description="For inquiries, consultations, or bookings, use any channel below. Weekday and weekend appointments are scheduled by confirmation."
        current="Contact"
        secondaryHref="/contact-location"
        secondaryLabel="Clinic Location"
      />

      <section className="bg-surface-emphasis py-12 sm:py-16">
        <div className="mx-auto grid max-w-standard gap-6 px-4 sm:px-6 lg:grid-cols-3">
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:col-span-2">
            <ContactCard
              href={`mailto:${site.email}`}
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label="Email"
              title={site.email}
              body="Best for detailed questions, referrals, and document sharing."
              action="Send an email"
            />
            <ContactCard
              href={appointmentWhatsAppUrl()}
              external
              icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
              label="WhatsApp"
              title="Chat instantly"
              body="Fastest for quick questions and appointment scheduling."
              action="Open WhatsApp"
              accent="emerald"
            />
            <ContactCard
              href={`tel:${site.phoneDial}`}
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label="Phone"
              title={site.phone}
              body="Call for urgent concerns and scheduling."
              action="Call now"
            />
            <ContactCard
              href="/appointments/book"
              icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
              label="Appointments"
              title="Prefer to book directly?"
              body="Use the booking page to send consultation details. No login required."
              action="Book Appointment"
            />
          </div>

          <aside className={`${surfaceStyles.muted} p-6`}>
            <h2 className="text-subsection-title text-text-primary">Availability</h2>
            <p className="mt-2 text-support text-text-tertiary">
              Dr Olaosebikan is available on weekdays and weekends by appointment.
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-text-tertiary">Mon - Fri</dt>
                <dd className="font-semibold text-text-primary">9:00 AM - 5:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-tertiary">Saturday</dt>
                <dd className="font-semibold text-text-primary">10:00 AM - 4:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-tertiary">Sunday</dt>
                <dd className="font-semibold text-text-primary">By appointment</dd>
              </div>
            </dl>
            <div className={`${surfaceStyles.card} mt-8 p-4`}>
              <h3 className="text-support font-bold text-text-primary">Location</h3>
              <p className="mt-2 flex gap-2 text-support text-text-tertiary">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                {site.address}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

type ContactCardProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  action: string;
  external?: boolean;
  accent?: "blue" | "emerald";
};

function ContactCard({
  href,
  icon,
  label,
  title,
  body,
  action,
  external = false,
  accent = "blue",
}: ContactCardProps) {
  const className = "group min-w-0 rounded-lg border border-border-subtle bg-surface-emphasis p-5 transition hover:border-brand-primary-border sm:p-6";
  const iconClass = accent === "emerald" ? "bg-success-subtle text-success ring-success-border" : "bg-brand-primary-subtle text-brand-primary ring-brand-primary-border";

  const content = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-support font-semibold text-text-secondary">{label}</p>
          <p className="mt-2 min-w-0 break-words text-base font-bold leading-relaxed text-text-primary sm:text-lg">{title}</p>
          <p className="mt-2 text-support text-text-tertiary">{body}</p>
        </div>
        <span className={`shrink-0 rounded-lg p-3 ring-1 ${iconClass}`}>
          {icon}
        </span>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-support font-semibold text-brand-primary group-hover:underline">
        {action}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
