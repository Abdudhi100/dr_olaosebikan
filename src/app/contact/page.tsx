import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";
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

      <section className="bg-surface-emphasis py-10 sm:py-14">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <div>
              <section className="grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <h2 className="text-subsection-title tracking-normal text-text-primary">Direct contact</h2>
                <div className="border-y border-border-subtle">
                  <ContactMethod
                    href={`tel:${site.phoneDial}`}
                    icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                    label="Phone"
                    value={site.phone}
                    body="Call for urgent concerns and scheduling."
                    action="Call now"
                  />
                  <ContactMethod
                    href={appointmentWhatsAppUrl()}
                    external
                    icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
                    label="WhatsApp"
                    value="Chat instantly"
                    body="Fastest for quick questions and appointment scheduling."
                    action="Open WhatsApp"
                  />
                  <ContactMethod
                    href={`mailto:${site.email}`}
                    icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                    label="Email"
                    value={site.email}
                    body="Best for detailed questions, referrals, and document sharing."
                    action="Send an email"
                    valueClassName="break-all"
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-8 border-t border-border-subtle pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <section>
                <h2 className="text-subsection-title tracking-normal text-text-primary">Availability</h2>
                <p className="mt-2 text-support text-text-secondary">
                  Dr Olaosebikan is available on weekdays and weekends by appointment.
                </p>
                <dl className="mt-5 border-y border-border-subtle text-support">
                  <AvailabilityRow label="Mon - Fri" value="9:00 AM - 5:00 PM" />
                  <AvailabilityRow label="Saturday" value="10:00 AM - 4:00 PM" />
                  <AvailabilityRow label="Sunday" value="By appointment" />
                </dl>
              </section>

              <section className="border-t border-border-subtle pt-8">
                <h2 className="text-subsection-title tracking-normal text-text-primary">Location</h2>
                <p className="mt-3 flex min-w-0 gap-2 text-support text-text-secondary">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span>{site.address}</span>
                </p>
                <Link href="/contact-location" className={`${buttonStyles.tertiary} mt-5`}>
                  Clinic Location
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

type ContactMethodProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  body: string;
  action: string;
  external?: boolean;
  valueClassName?: string;
};

function ContactMethod({
  href,
  icon,
  label,
  value,
  body,
  action,
  external = false,
  valueClassName = "break-words",
}: ContactMethodProps) {
  const className = "group grid min-w-0 gap-3 border-b border-border-subtle py-5 transition last:border-b-0 hover:border-brand-primary sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4";

  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-brand-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-text-tertiary">{label}</p>
        <p className={`mt-1 min-w-0 text-base font-bold leading-snug text-text-primary ${valueClassName}`}>{value}</p>
        <p className="mt-2 max-w-reading text-support text-text-secondary">{body}</p>
      </div>
      <span className="text-support font-semibold text-brand-primary group-hover:underline sm:justify-self-end">
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

function AvailabilityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border-subtle py-3 last:border-b-0">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="text-right font-semibold text-text-primary">{value}</dd>
    </div>
  );
}
