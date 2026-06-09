import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
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

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          <div className="grid gap-5 lg:col-span-2 sm:grid-cols-2">
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

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-extrabold text-slate-950">Availability</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Dr Olaosebikan is available on weekdays and weekends by appointment.
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Mon - Fri</dt>
                <dd className="font-semibold text-slate-950">9:00 AM - 5:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Saturday</dt>
                <dd className="font-semibold text-slate-950">10:00 AM - 4:00 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Sunday</dt>
                <dd className="font-semibold text-slate-950">By appointment</dd>
              </div>
            </dl>
            <div className="mt-8 rounded-lg bg-white p-4 ring-1 ring-slate-200">
              <h3 className="text-sm font-bold text-slate-950">Location</h3>
              <p className="mt-2 flex gap-2 text-sm leading-relaxed text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
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
  const className = "group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-soft";
  const iconClass = accent === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-blue-50 text-blue-700 ring-blue-100";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-2 break-words text-lg font-bold text-slate-950">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
        </div>
        <span className={`shrink-0 rounded-lg p-3 ring-1 ${iconClass}`}>
          {icon}
        </span>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:underline">
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
