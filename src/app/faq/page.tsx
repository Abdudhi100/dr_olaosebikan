import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { faqs } from "@/lib/content";
import { defaultMetadata, faqJsonLd } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";

export const metadata: Metadata = defaultMetadata({
  title: "Rheumatology FAQ | Dr Olaosebikan",
  description: "Frequently asked questions about arthritis, autoimmune diseases, appointments, diagnosis, and treatment.",
  keywords: [
    "rheumatology FAQ",
    "arthritis FAQ Lagos",
    "autoimmune clinic questions",
    "joint pain FAQ Lagos",
  ],
  path: "/faq",
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
    title: "Autoimmune Disease Specialist",
    href: "/autoimmune-disease-specialist-lagos",
    description: "Specialist evaluation for autoimmune symptoms and ongoing management.",
  },
  {
    title: "Contact and Clinic Location",
    href: "/contact-location",
    description: "Find clinic contact details, location information, and booking guidance.",
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <PageHero
        eyebrow="Common Questions"
        title="Rheumatology FAQ"
        description="Here are answers to common questions about arthritis, autoimmune disease, joint pain, specialist care, and booking an appointment."
        current="Rheumatology FAQ"
        secondaryHref="/contact-location"
        secondaryLabel="Contact the Clinic"
      />

      <section className="bg-surface-emphasis py-10 sm:py-14">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <section className="grid gap-5 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">Common questions</h2>
            <div className="border-y border-border-subtle">
            {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-border-subtle py-4 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold leading-snug text-text-primary transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 max-w-reading text-body text-text-secondary">{faq.answer}</p>
                </details>
            ))}
          </div>
          </section>

          <section className="mt-10 border-y border-brand-primary-border bg-brand-primary-subtle py-8 sm:py-10">
            <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <h2 className="text-subsection-title tracking-normal text-text-primary">Need specialist review?</h2>
              <div>
                <p className="max-w-reading text-body text-text-secondary">
              Book an appointment for assessment of arthritis, autoimmune disease, joint pain, swelling, stiffness, or related symptoms.
            </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/appointments/book" className={`${buttonStyles.primarySmall} w-full sm:w-auto`}>
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Book Appointment
              </Link>
                  <Link href="/about-dr-olaosebikan" className={`${buttonStyles.secondary} w-full sm:w-auto`}>
                About Dr Olaosebikan
              </Link>
                </div>
              </div>
            </div>
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
