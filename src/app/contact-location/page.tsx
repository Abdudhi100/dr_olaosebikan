import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";

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

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Clinic contact details</h2>
              <div className="mt-6 space-y-5 text-slate-700">
                <ContactLine icon={<Phone className="h-5 w-5" />} label="Phone">
                  <a href={`tel:${site.phoneDial}`} className="font-medium text-blue-700 hover:underline">
                    {site.phone}
                  </a>
                </ContactLine>
                <ContactLine icon={<Mail className="h-5 w-5" />} label="Email">
                  <a href={`mailto:${site.email}`} className="break-all font-medium text-blue-700 hover:underline">
                    {site.email}
                  </a>
                </ContactLine>
                <ContactLine icon={<MapPin className="h-5 w-5" />} label="Address">
                  <p>{site.address}</p>
                </ContactLine>
                <ContactLine icon={<CalendarDays className="h-5 w-5" />} label="Consultation hours">
                  <p>{site.hours}</p>
                </ContactLine>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Booking and visits</h2>
              <div className="mt-6 space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  If you are experiencing joint pain, swelling, stiffness, autoimmune symptoms, or need specialist follow-up, you can book an appointment for clinical evaluation.
                </p>
                <p className="leading-relaxed">
                  Bringing previous test results, medication history, and a short summary of your symptoms can help make your consultation more productive and focused.
                </p>
                <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-950">Helpful to bring</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    <li>Previous test or scan results</li>
                    <li>Current medications</li>
                    <li>A brief summary of symptoms and how long they have lasted</li>
                    <li>Any previous diagnosis or treatment history</li>
                  </ul>
                </div>
                <Link href="/appointments/book" className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                  Book Appointment
                </Link>
              </div>
            </section>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-950">When to book specialist care</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Consider booking if you have persistent joint pain, recurrent swelling, prolonged morning stiffness, symptoms suggestive of autoimmune disease, or an existing diagnosis that requires specialist follow-up and review.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-950">Related pages</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50">
                  <span className="block font-semibold text-slate-950">{link.title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{link.description}</span>
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
    <div className="flex gap-3">
      <span className="mt-0.5 text-blue-700">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
