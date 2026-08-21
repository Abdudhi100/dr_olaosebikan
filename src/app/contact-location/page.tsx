import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";

export const metadata: Metadata = defaultMetadata({
  title: "Contact and Clinic Location | Dr Olaosebikan",
  description: "Contact Dr Olaosebikan's clinic, view location details, and book an appointment for specialist arthritis and autoimmune care in Lagos.",
  keywords: [
    "contact rheumatologist Lagos",
    "clinic location Lagos",
    "book arthritis appointment Lagos",
  ],
  path: "/contact-location",
});

const related = [
  {
    title: "About Dr Olaosebikan",
    href: "/about-dr-olaosebikan",
    description: "Learn more about the specialist behind the clinic and care approach.",
  },
  {
    title: "Rheumatoid Arthritis Treatment",
    href: "/rheumatoid-arthritis-treatment-lagos",
    description: "Learn about inflammatory arthritis, diagnosis, and long-term care.",
  },
  {
    title: "Lupus Care",
    href: "/lupus-care-lagos",
    description: "Specialist care for autoimmune disease, monitoring, and follow-up.",
  },
  {
    title: "Rheumatology FAQ",
    href: "/faq",
    description: "Common questions about arthritis, autoimmune disease, and appointments.",
  },
];

export default function ContactLocationPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact and Clinic Location",
          url: `${site.siteUrl}/contact-location`,
          description: metadata.description,
        }}
      />

      <PageHero
        eyebrow="Contact & Booking Information"
        title="Contact and Clinic Location"
        description="Contact the clinic to book an appointment, ask a question, or get location details for specialist pain, arthritis, autoimmune, and rheumatology care in Lagos."
        current="Contact and Clinic Location"
        secondaryHref="/contact"
        secondaryLabel="Contact Channels"
      />

      <section className="bg-surface-emphasis py-10 sm:py-14">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <section className="grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">Clinic location</h2>
            <div className="max-w-reading">
              <p className="text-xs font-bold text-text-tertiary">Address</p>
              <address className="mt-2 not-italic text-lead text-text-primary">{site.address}</address>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={`tel:${site.phoneDial}`} className={`${buttonStyles.tertiary} justify-center sm:justify-start`}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call the Clinic
                </a>
                <a href={`mailto:${site.email}`} className={`${buttonStyles.tertiary} justify-center sm:justify-start`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email the Clinic
                </a>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">Clinic contact details</h2>
            <div className="border-y border-border-subtle">
              <ContactLine icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Phone">
                <a href={`tel:${site.phoneDial}`} className="font-semibold text-brand-primary hover:underline">
                  {site.phone}
                </a>
              </ContactLine>
              <ContactLine icon={<Mail className="h-4 w-4" aria-hidden="true" />} label="Email">
                <a href={`mailto:${site.email}`} className="break-all font-semibold text-brand-primary hover:underline">
                  {site.email}
                </a>
              </ContactLine>
              <ContactLine icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />} label="Consultation hours">
                <p>{site.hours}</p>
              </ContactLine>
            </div>
          </section>

          <section className="mt-10 grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">Booking and visits</h2>
            <div className="max-w-reading space-y-4 text-body text-text-secondary">
              <p>
                If you are experiencing joint pain, swelling, stiffness, autoimmune symptoms, or need specialist follow-up, you can book an appointment for clinical evaluation.
              </p>
              <p>
                Bringing previous test results, medication history, and a short summary of your symptoms can help make your consultation more productive and focused.
              </p>
              <div className="border-y border-border-subtle py-4">
                <p className="text-support font-bold text-text-primary">Helpful to bring</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-support text-text-secondary">
                  <li>Previous test or scan results</li>
                  <li>Current medications</li>
                  <li>A brief summary of symptoms and how long they have lasted</li>
                  <li>Any previous diagnosis or treatment history</li>
                </ul>
              </div>
              <Link href="/appointments/book" className={`${buttonStyles.primarySmall} w-full sm:w-auto`}>
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Book Appointment
              </Link>
            </div>
          </section>

          <section className="mt-12 grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">When to book specialist care</h2>
            <p className="max-w-reading text-body text-text-secondary">
              Consider booking if you have persistent joint pain, recurrent swelling, prolonged morning stiffness, symptoms suggestive of autoimmune disease, or an existing diagnosis that requires specialist follow-up and review.
            </p>
          </section>

          <section className="mt-12 grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">Related pages</h2>
            <div className="border-y border-border-subtle">
              {related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group grid gap-2 border-b border-border-subtle py-4 transition last:border-b-0 hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[minmax(12rem,0.42fr)_1fr_auto] sm:gap-6"
                >
                  <span className="font-bold text-text-primary">{link.title}</span>
                  <span className="max-w-reading text-support text-text-secondary">{link.description}</span>
                  <ArrowRight className="h-4 w-4 text-brand-primary transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function ContactLine({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-b border-border-subtle py-5 last:border-b-0 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-4">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-brand-primary">{icon}</span>
      <div className="min-w-0 text-body text-text-secondary">
        <p className="text-xs font-bold text-text-tertiary">{label}</p>
        <div className="mt-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
