import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ClinicPage } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { buttonStyles } from "@/lib/styles";

type ClinicContentPageProps = {
  page: ClinicPage;
};

export function ClinicContentPage({ page }: ClinicContentPageProps) {
  const isTreatmentPage = page.schemaType === "MedicalWebPage";

  return (
    <article className="bg-surface-emphasis">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        current={page.title}
      />

      <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-10 sm:space-y-12">
          {page.sections.map((section, sectionIndex) => (
            <section
              key={section.heading}
              className="grid gap-4 border-t border-border-subtle pt-8 sm:gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]"
            >
              <div>
                <p className="w-fit text-xs font-bold text-brand-primary">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-subsection-title tracking-normal text-text-primary">
                  {section.heading}
                </h2>
              </div>

              {section.body ? (
                <div className="max-w-reading space-y-4 text-body text-text-secondary">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {section.cards ? (
                <div className="border-y border-border-subtle lg:col-start-2">
                  {section.cards.map((card) => (
                    <section
                      key={card.title}
                      className="grid gap-2 border-b border-border-subtle py-4 last:border-b-0 sm:grid-cols-[minmax(12rem,0.42fr)_1fr] sm:gap-6"
                    >
                      <h3 className="text-base font-bold leading-snug text-text-primary">{card.title}</h3>
                      <p className="max-w-reading text-support text-text-secondary">
                        {card.description}
                      </p>
                    </section>
                  ))}
                </div>
              ) : null}
            </section>
          ))}

          <section className="border-y border-brand-primary-border bg-brand-primary-subtle py-8 sm:py-10">
            <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <h2 className="text-subsection-title tracking-normal text-text-primary">Book an appointment</h2>
              <div>
                <p className="max-w-reading text-body text-text-secondary">
                  {page.ctaText}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/appointments/book"
                    className={`${buttonStyles.primarySmall} w-full sm:w-auto`}
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Book Appointment
                  </Link>
                  <Link
                    href="/contact-location"
                    className={`${buttonStyles.tertiary} justify-center sm:justify-start`}
                  >
                    Contact the Clinic
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-border-subtle pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2 className="text-subsection-title tracking-normal text-text-primary">
              {isTreatmentPage ? "Related care" : "Related pages"}
            </h2>
            <div className="border-y border-border-subtle">
              {page.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group grid gap-2 border-b border-border-subtle py-4 transition last:border-b-0 hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[minmax(12rem,0.42fr)_1fr_auto] sm:gap-6"
                >
                  <span className="font-bold text-text-primary">
                    {link.title}
                  </span>
                  <span className="text-support text-text-secondary">
                    {link.description}
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-primary transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
