import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { achievements } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = defaultMetadata({
  title: "Achievements & Recognitions | Dr Olaosebikan",
  description: "Verified achievements and recognitions for Dr Olaosebikan are shown here when available.",
  keywords: [
    "Dr Olaosebikan achievements",
    "Dr Olaosebikan professional profile",
    "rheumatology care Lagos",
  ],
  path: "/publications/achievements",
});

const relatedLinks = [
  {
    title: "About Dr Olaosebikan",
    href: "/about-dr-olaosebikan",
    description: "Review verified professional context and care approach.",
  },
  {
    title: "Research & Publications",
    href: "/publications",
    description: "View verified publication records when records are available.",
  },
  {
    title: "Contact and Clinic Location",
    href: "/contact-location",
    description: "Find clinic location information and booking guidance.",
  },
];

export default function AchievementsPage() {
  const visibleAchievements = achievements.filter((achievement) => achievement.isPublished !== false);

  return (
    <>
      <PageHero
        eyebrow="Verified records"
        title="Achievements & Recognitions"
        description="This page is reserved for verified achievements and recognitions. Records appear here only when confirmed details are available."
        current="Achievements & Recognitions"
        showPrimaryAction={false}
        secondaryHref=""
      />

      <section className="bg-surface-emphasis py-6 sm:py-10" aria-labelledby="achievement-records-heading">
        <div className="mx-auto grid max-w-wide gap-5 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <header>
            <p className="text-sm font-semibold text-brand-primary">
              Achievement records
            </p>
            <h2
              id="achievement-records-heading"
              className="mt-3 text-section-title tracking-normal text-text-primary sm:text-section-title-lg"
            >
              Verified entries
            </h2>
          </header>

          {visibleAchievements.length > 0 ? (
            <div className="border-y border-border-subtle">
              {visibleAchievements.map((achievement) => (
                <article
                  key={`${achievement.title}-${achievement.year}`}
                  className="border-b border-border-subtle py-5 last:border-b-0"
                >
                  <div className="max-w-reading">
                    <h3 className="text-subsection-title tracking-normal text-text-primary">
                      {achievement.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-support text-text-secondary">
                      {achievement.organization ? (
                        <span className="font-semibold text-text-primary">
                          {achievement.organization}
                        </span>
                      ) : null}
                      {achievement.organization ? (
                        <span className="text-border-default" aria-hidden="true">/</span>
                      ) : null}
                      <span>{achievement.year}</span>
                    </div>
                    {achievement.description ? (
                      <p className="mt-3 text-body text-text-secondary">
                        {achievement.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <section className="max-w-reading">
              <h3 className="text-subsection-title tracking-normal text-text-primary">
                No verified achievement records are currently listed
              </h3>
              <p className="mt-3 max-w-reading text-body text-text-secondary">
                Achievement details will appear here only when they can be shown as verified records.
              </p>
              <Link href="/about-dr-olaosebikan" className={`${buttonStyles.tertiary} mt-4`}>
                About Dr Olaosebikan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          )}
        </div>
      </section>

      <section className="bg-surface-page py-6 sm:py-8" aria-labelledby="achievement-related-heading">
        <div className="mx-auto grid max-w-wide gap-4 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <h2
            id="achievement-related-heading"
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
