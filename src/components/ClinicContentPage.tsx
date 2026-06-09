import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ClinicPage } from "@/lib/content";
import { PageHero } from "@/components/PageHero";

type ClinicContentPageProps = {
  page: ClinicPage;
};

export function ClinicContentPage({ page }: ClinicContentPageProps) {
  return (
    <article className="bg-white">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        current={page.title}
      />

      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
        <div className="space-y-12">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-slate-950">
                {section.heading}
              </h2>

              {section.body ? (
                <div className="mt-3 space-y-4 leading-relaxed text-slate-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {section.cards ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {section.cards.map((card) => (
                    <div key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="font-semibold text-slate-950">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}

          <section className="rounded-lg bg-slate-50 p-8 ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">Book an appointment</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
              {page.ctaText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/appointments/book"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Book Appointment
              </Link>
              <Link
                href="/contact-location"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Contact the Clinic
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Related pages</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {page.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="flex items-start justify-between gap-3 font-semibold text-slate-950">
                    {link.title}
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-blue-700 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
