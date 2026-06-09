import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { faqs } from "@/lib/content";
import { defaultMetadata, faqJsonLd } from "@/lib/seo";

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

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-5">
            {faqs.map((faq) => (
              <section key={faq.question} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-950">{faq.question}</h2>
                <p className="mt-3 leading-relaxed text-slate-700">{faq.answer}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg bg-slate-50 p-8 ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">Need specialist review?</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
              Book an appointment for assessment of arthritis, autoimmune disease, joint pain, swelling, stiffness, or related symptoms.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/appointments/book" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Book Appointment
              </Link>
              <Link href="/about-dr-olaosebikan" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                About Dr Olaosebikan
              </Link>
            </div>
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
