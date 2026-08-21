import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { doctor, getPageBySlug } from "@/lib/content";
import { defaultMetadata, physicianJsonLd } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";

const contentPage = getPageBySlug("about-dr-olaosebikan");

const professionalFacts = [
  {
    label: "Professional role",
    value: doctor.title,
  },
  {
    label: "Specialty focus",
    value: doctor.specialization,
  },
  {
    label: "Clinic",
    value: doctor.hospitalAffiliations.join(", "),
  },
  {
    label: "Professional context",
    value: doctor.professionalMemberships.join(", "),
  },
].filter((fact) => fact.value.length > 0);

const clinicalFocusLinks: Record<string, string> = {
  "Rheumatoid arthritis": "/rheumatoid-arthritis-treatment-lagos",
  "Gout and crystal arthritis": "/gout-treatment-lagos",
  "Lupus and autoimmune disorders": "/lupus-care-lagos",
  "Joint pain and stiffness": "/joint-pain-and-stiffness-clinic-lagos",
};

export const metadata: Metadata = contentPage
  ? defaultMetadata({
      title: contentPage.seoTitle,
      description: contentPage.seoDescription,
      keywords: contentPage.keywords,
      path: contentPage.path,
    })
  : {};

export default function AboutDoctorPage() {
  if (!contentPage) notFound();

  const professionalFocus = contentPage.sections.find(
    (section) => section.heading === "Professional focus",
  );
  const clinicalFocus = contentPage.sections.find(
    (section) => section.heading === "Conditions commonly seen",
  );
  const approachSections = contentPage.sections.filter((section) =>
    ["How diagnosis is approached", "Treatment approach"].includes(
      section.heading,
    ),
  );
  const whenToBook = contentPage.sections.find(
    (section) => section.heading === "When to book",
  );

  return (
    <>
      <JsonLd data={physicianJsonLd()} />
      <article className="bg-surface-page">
        <section
          id="about-hero"
          className="border-b border-border-subtle bg-surface-emphasis"
          aria-labelledby="about-heading"
        >
          <div className="mx-auto max-w-wide px-4 py-8 sm:px-6 sm:py-14 lg:py-16">
            <nav className="text-support text-text-tertiary" aria-label="Breadcrumb">
              <Link
                href="/"
                className="transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Home
              </Link>
              <span className="mx-2 text-border-default" aria-hidden="true">
                /
              </span>
              <span>{contentPage.title}</span>
            </nav>

            <div className="mt-7 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,24rem)] lg:items-center">
              <div className="max-w-reading">
                <p className="text-sm font-semibold text-brand-primary">
                  {contentPage.eyebrow}
                </p>
                <h1
                  id="about-heading"
                  className="mt-3 text-page-title tracking-normal text-text-primary sm:text-page-title-lg"
                >
                  About {doctor.displayName}
                </h1>
                <p className="mt-5 text-lead text-text-secondary">
                  {contentPage.description}
                </p>
              </div>

              <figure className="mx-auto w-full max-w-[21.5rem] sm:max-w-[23rem] lg:mr-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted ring-1 ring-border-subtle">
                  <Image
                    src={doctor.profilePhoto}
                    alt={`Photo of ${doctor.displayName}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 368px"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3 border-l border-border-default pl-4 sm:mt-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {doctor.displayName}
                  </p>
                  <p className="mt-1 text-support text-text-secondary">
                    {doctor.title}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          id="professional-context"
          className="border-b border-border-subtle bg-surface-page py-7 sm:py-12"
          aria-labelledby="professional-context-heading"
        >
          <div className="mx-auto grid max-w-wide gap-5 px-4 sm:gap-7 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <header>
              <p className="text-sm font-semibold text-brand-primary">
                Verified context
              </p>
              <h2
                id="professional-context-heading"
                className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
              >
                Professional context
              </h2>
            </header>

            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2 sm:gap-y-0">
              {professionalFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="sm:border-t sm:border-border-subtle sm:py-4"
                >
                  <dt className="text-support font-semibold text-text-tertiary">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-body font-semibold text-text-primary">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="bg-surface-emphasis py-7 sm:py-14"
          aria-labelledby="clinical-focus-heading"
        >
          <div className="mx-auto grid max-w-wide gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-[0.68fr_1.32fr]">
            <header className="max-w-reading">
              <p className="text-sm font-semibold text-brand-primary">
                Clinical focus
              </p>
              <h2
                id="clinical-focus-heading"
                className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
              >
                Areas commonly reviewed
              </h2>
              {professionalFocus?.body ? (
                <div className="mt-4 space-y-4 text-body text-text-secondary">
                  {professionalFocus.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </header>

            {clinicalFocus?.cards ? (
              <div className="border-y border-border-subtle">
                {clinicalFocus.cards.map((card, index) => {
                  const href = clinicalFocusLinks[card.title];

                  return href ? (
                    <Link
                      key={card.title}
                      href={href}
                      className="group grid gap-3 border-b border-border-subtle py-4 transition last:border-b-0 hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:py-5"
                    >
                      <span className="text-sm font-semibold text-text-tertiary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-base font-bold text-text-primary">
                          {card.title}
                        </span>
                        <span className="mt-2 block text-support text-text-secondary">
                          {card.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-brand-primary transition group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <section
                      key={card.title}
                      className="grid gap-3 border-b border-border-subtle py-4 last:border-b-0 sm:grid-cols-[3rem_1fr] sm:py-5"
                    >
                      <p className="text-sm font-semibold text-text-tertiary">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h3 className="text-base font-bold text-text-primary">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-support text-text-secondary">
                          {card.description}
                        </p>
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        <section
          className="bg-surface-muted py-7 sm:py-14"
          aria-labelledby="care-approach-heading"
        >
          <div className="mx-auto grid max-w-wide gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-[0.68fr_1.32fr]">
            <header className="max-w-reading">
              <p className="text-sm font-semibold text-brand-primary">
                Assessment and follow-up
              </p>
              <h2
                id="care-approach-heading"
                className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
              >
                How care is approached
              </h2>
            </header>

            <div className="border-y border-border-subtle">
              {approachSections.map((section, index) => (
                <section
                  key={section.heading}
                  className="grid gap-3 border-b border-border-subtle py-4 last:border-b-0 sm:grid-cols-[3rem_1fr] sm:gap-6 sm:py-5"
                >
                  <p className="text-sm font-semibold text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="text-subsection-title tracking-normal text-text-primary">
                      {section.heading}
                    </h3>
                    {section.body ? (
                      <div className="mt-3 max-w-reading space-y-3 text-body text-text-secondary sm:space-y-4">
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-surface-emphasis py-6 sm:py-14"
          aria-labelledby="when-to-book-heading"
        >
          <div className="mx-auto max-w-standard px-4 sm:px-6">
            <div className="grid gap-5 border-y border-brand-primary-border py-6 sm:grid-cols-[minmax(13rem,0.45fr)_1fr] sm:gap-6 sm:py-10">
              <header>
                <p className="text-sm font-semibold text-brand-primary">
                  Next step
                </p>
                <h2
                  id="when-to-book-heading"
                  className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
                >
                  When to book
                </h2>
              </header>
              <div>
                {whenToBook?.body ? (
                  <div className="max-w-reading space-y-4 text-body text-text-secondary">
                    {whenToBook.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 max-w-reading text-body font-semibold text-text-primary">
                  {contentPage.ctaText}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </div>
        </section>

        <section
          className="bg-surface-page py-7 sm:py-14"
          aria-labelledby="related-pages-heading"
        >
          <div className="mx-auto grid max-w-wide gap-5 px-4 sm:gap-6 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <h2
              id="related-pages-heading"
              className="text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
            >
              Related pages
            </h2>
            <div className="border-y border-border-subtle">
              {contentPage.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group grid gap-2 border-b border-border-subtle py-3.5 transition last:border-b-0 hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[minmax(12rem,0.42fr)_1fr_auto] sm:gap-6 sm:py-4"
                >
                  <span className="font-bold text-text-primary">
                    {link.title}
                  </span>
                  <span className="text-support text-text-secondary">
                    {link.description}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-brand-primary transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
