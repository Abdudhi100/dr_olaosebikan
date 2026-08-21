import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ClinicPage } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { buttonStyles, surfaceStyles } from "@/lib/styles";

type ClinicContentPageProps = {
  page: ClinicPage;
};

export function ClinicContentPage({ page }: ClinicContentPageProps) {
  return (
    <article className="bg-surface-emphasis">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        current={page.title}
      />

      <div className="mx-auto max-w-standard px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-12">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-section-title text-text-primary">
                {section.heading}
              </h2>

              {section.body ? (
                <div className="mt-4 max-w-reading space-y-4 text-body text-text-secondary">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {section.cards ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {section.cards.map((card) => (
                    <div key={card.title} className={`${surfaceStyles.card} p-5`}>
                      <h3 className="text-subsection-title text-text-primary">{card.title}</h3>
                      <p className="mt-2 text-support text-text-tertiary">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}

          <section className={`${surfaceStyles.muted} p-6 sm:p-8`}>
            <h2 className="text-section-title text-text-primary">Book an appointment</h2>
            <p className="mt-3 max-w-reading text-body text-text-secondary">
              {page.ctaText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/appointments/book"
                className={buttonStyles.primarySmall}
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Book Appointment
              </Link>
              <Link
                href="/contact-location"
                className={buttonStyles.secondary}
              >
                Contact the Clinic
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-section-title text-text-primary">Related pages</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {page.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-lg border border-border-subtle p-4 transition hover:border-brand-primary-border hover:bg-brand-primary-subtle"
                >
                  <span className="flex items-start justify-between gap-3 font-semibold text-text-primary">
                    {link.title}
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-primary transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-support text-text-tertiary">
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
