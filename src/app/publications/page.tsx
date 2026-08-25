import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { publications } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = defaultMetadata({
  title: "Research & Publications | Dr Olaosebikan",
  description: "Verified publication records for Dr Olaosebikan are shown here when available.",
  keywords: [
    "Dr Olaosebikan publications",
    "rheumatology publications",
    "arthritis research Lagos",
  ],
  path: "/publications",
});

const relatedLinks = [
  {
    title: "About Dr Olaosebikan",
    href: "/about-dr-olaosebikan",
    description: "Review verified professional context and care approach.",
  },
  {
    title: "Achievements",
    href: "/publications/achievements",
    description: "View verified achievements when records are available.",
  },
  {
    title: "Care areas",
    href: "/#care-areas",
    description: "Explore the clinic's rheumatology and autoimmune care areas.",
  },
];

export default function PublicationsPage() {
  const visiblePublications = publications.filter((publication) => publication.isPublished !== false);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Research & Publications",
          description: "Verified publication records are shown here when available.",
        }}
      />

      <PageHero
        eyebrow="Verified records"
        title="Research & Publications"
        description="This page is reserved for verified publication records. Records appear here only when confirmed details are available."
        current="Research & Publications"
        showPrimaryAction={false}
        secondaryHref=""
      />

      <section className="bg-surface-emphasis py-6 sm:py-10" aria-labelledby="publication-records-heading">
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <header>
              <p className="text-sm font-semibold text-brand-primary">
                Publication records
              </p>
              <h2
                id="publication-records-heading"
                className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
              >
                Verified entries
              </h2>
            </header>

            {visiblePublications.length > 0 ? (
              <div className="border-y border-border-subtle">
                {visiblePublications.map((publication) => (
                  <article
                    key={publication.slug}
                    className="grid gap-4 border-b border-border-subtle py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                  >
                    <div className="min-w-0 max-w-reading">
                      <h3 className="text-subsection-title tracking-normal text-text-primary">
                        <Link
                          href={`/publications/${publication.slug}`}
                          className="transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        >
                          {publication.title}
                        </Link>
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-support text-text-secondary">
                        <span className="font-semibold text-text-primary">{publication.journal}</span>
                        <span className="text-border-default" aria-hidden="true">/</span>
                        <span>{publication.year}</span>
                        {publication.isFeatured ? (
                          <span className="font-semibold text-brand-primary">
                            Featured
                          </span>
                        ) : null}
                      </div>
                      {publication.authors ? (
                        <p className="mt-3 text-support text-text-secondary">
                          <span className="font-semibold text-text-primary">Authors:</span> {publication.authors}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={`/publications/${publication.slug}`}
                      className={`${buttonStyles.tertiary} justify-start sm:justify-end`}
                    >
                      View record
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <section className="max-w-reading">
                <h3 className="text-subsection-title tracking-normal text-text-primary">
                  No verified publication records are currently listed
                </h3>
                <p className="mt-3 max-w-reading text-body text-text-secondary">
                  Publication details will appear here only when they can be shown as verified records.
                </p>
                <Link href="/about-dr-olaosebikan" className={`${buttonStyles.tertiary} mt-4`}>
                  About Dr Olaosebikan
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface-page py-6 sm:py-8" aria-labelledby="publication-related-heading">
        <div className="mx-auto grid max-w-wide gap-4 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <h2
            id="publication-related-heading"
            className="text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
          >
            Related pages
          </h2>
          <div className="divide-y divide-border-subtle">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group grid gap-2 py-3.5 transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:grid-cols-[minmax(12rem,0.42fr)_1fr_auto] sm:gap-6"
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
        </div>
      </section>
    </>
  );
}
