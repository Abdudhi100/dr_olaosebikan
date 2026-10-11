import Link from "next/link";
import { InsightsSearch } from "@/components/insights/InsightsSearch";
import { InsightsHero } from "@/components/insights/InsightsHero";
import styles from "@/components/insights/insights.module.css";
import {
  editorialEntries,
  editorialTopics,
  topicSlug,
  searchEntries,
  entryPath,
  displayDate,
  formatLabel,
} from "@/lib/editorial";
import { visiblePublications } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";
export const metadata = {
  ...defaultMetadata({
    title: "Insights & media",
    description:
      "Educational articles, videos, verified research and clinic updates.",
    path: "/insights",
  }),
  robots: {
    index:
      process.env.CLINIC_RELEASE === "approved" && editorialEntries.length > 0,
    follow: true,
  },
};
const collections = [
  {
    id: "articles",
    kind: "article",
    title: "Articles",
    description: "Patient-focused guidance and explainers",
  },
  {
    id: "videos",
    kind: "video",
    title: "Videos",
    description: "Educational talks with captions and transcripts",
  },
  {
    id: "news",
    kind: "news",
    title: "Clinic news",
    description: "Confirmed announcements and professional updates",
  },
] as const;
export default function InsightsPage() {
  const featured =
    editorialEntries.find((entry) => entry.featured) ?? editorialEntries[0];
  return (
    <div className={styles.scope}>
      <InsightsHero
        eyebrow="Clinic education & resources"
        title="Insights & media."
        description="A space for educational articles, videos, verified research and clinic updates."
      />
      <div className={`${styles.container} ${styles.body}`}>
        <p className={styles.eyebrow}>Browse by format</p>
        <h2 className={styles.sectionTitle}>Resources to explore.</h2>
        <p className={styles.lead}>
          Browse educational content by format, with clear authorship, sources
          and publication dates.
        </p>
        {featured ? (
          <section className={styles.feature} aria-labelledby="featured-title">
            <p className={styles.eyebrow}>
              Featured {formatLabel[featured.kind]}
            </p>
            <h3 id="featured-title">{featured.title}</h3>
            <p>{featured.summary}</p>
            <Link href={entryPath(featured)}>
              Read {featured.kind === "video" ? "and watch" : "more"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ) : (
          <div className={styles.empty}>
            <p>
              No articles, videos or clinic news have been published here yet.
            </p>
            <p>
              For current care information,{" "}
              <Link href="/#services" className="underline">
                explore our care pages
              </Link>{" "}
              or{" "}
              <Link href="/contact-location" className="underline">
                contact the clinic
              </Link>
              .
            </p>
          </div>
        )}
        <div className={styles.collections}>
          {collections.map((collection) => (
            <Link
              className={styles.card}
              href={
                editorialEntries.some((e) => e.kind === collection.kind)
                  ? `/insights/${collection.id}`
                  : `#${collection.id}`
              }
              key={collection.id}
            >
              <p className={styles.eyebrow}>{collection.title}</p>
              <h3>{collection.description}</h3>
              <span className={styles.cardAction}>
                Explore category <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
          {visiblePublications.length > 0 ? (
            <Link className={styles.card} href="/publications">
              <p className={styles.eyebrow}>Research</p>
              <h3>Verified publications and citations</h3>
              <span className={styles.cardAction}>
                Explore research <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ) : (
            <div className={styles.card}>
              <p className={styles.eyebrow}>Research</p>
              <h3>Verified publications and citations</h3>
              <p>No verified research records have been added yet.</p>
            </div>
          )}
        </div>
        {editorialEntries.length > 0 && (
          <InsightsSearch entries={searchEntries(editorialEntries)} />
        )}
        {editorialTopics.length > 0 && (
          <section
            className={styles.collectionSection}
            aria-labelledby="topics-heading"
          >
            <h2 id="topics-heading">Browse by topic.</h2>
            <div className="clinic-actions">
              {editorialTopics.map((topic) => (
                <Link
                  key={topic}
                  className="clinic-button clinic-button-outline"
                  href={`/insights/topics/${topicSlug(topic)}`}
                >
                  {topic}
                </Link>
              ))}
            </div>
          </section>
        )}
        {collections.map((collection) => {
          const entries = editorialEntries.filter(
            (entry) => entry.kind === collection.kind,
          );
          return (
            <section
              id={collection.id}
              className={styles.collectionSection}
              key={collection.id}
              aria-labelledby={`${collection.id}-heading`}
            >
              <h2 id={`${collection.id}-heading`}>{collection.title}</h2>
              {entries.length ? (
                <div className={styles.entryGrid}>
                  {entries.map((entry) => (
                    <article className={styles.card} key={entry._id}>
                      <p className={styles.eyebrow}>{entry.topic}</p>
                      <h3>
                        <Link href={entryPath(entry)}>{entry.title}</Link>
                      </h3>
                      <p>{entry.summary}</p>
                      <p className="mt-4 text-sm">
                        {entry.authorName} ·{" "}
                        <time dateTime={entry.publishedAt}>
                          {displayDate(entry.publishedAt)}
                        </time>
                      </p>
                      <Link
                        className={styles.cardAction}
                        href={entryPath(entry)}
                      >
                        Explore {formatLabel[entry.kind].toLowerCase()}{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={`${styles.empty} mt-6`}>
                  No {collection.title.toLowerCase()} have been published yet.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
