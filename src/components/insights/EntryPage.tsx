import Link from "next/link";
import { InsightsHero } from "./InsightsHero";
import { RichText } from "./RichText";
import { VideoPlayer } from "./VideoPlayer";
import { JsonLd } from "@/components/JsonLd";
import {
  displayDate,
  durationLabel,
  formatLabel,
  type PublicEntry,
} from "@/lib/editorial";
import { entryJsonLd } from "@/lib/editorial-seo";
import { videoEmbed } from "../../../shared/publishing-policy.mjs";
import styles from "./insights.module.css";
export function EntryPage({ entry }: { entry: PublicEntry }) {
  const video = entry.video;
  return (
    <div className={styles.scope}>
      <JsonLd data={entryJsonLd(entry)} />
      <InsightsHero
        eyebrow={`${formatLabel[entry.kind]} · ${entry.topic}`}
        title={entry.title}
        description={entry.summary}
      />
      <div className={`${styles.container} ${styles.body}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/insights">Insights &amp; media</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{entry.title}</span>
        </nav>
        <div className={styles.detailGrid}>
          <article className={styles.story} aria-label={entry.title}>
            <div className={styles.metadata}>
              <p>
                By {entry.authorName} · {entry.authorRole}
              </p>
              <p>
                Published{" "}
                <time dateTime={entry.publishedAt}>
                  {displayDate(entry.publishedAt)}
                </time>
                {entry.modifiedAt ? (
                  <>
                    {" "}
                    · Updated{" "}
                    <time dateTime={entry.modifiedAt}>
                      {displayDate(entry.modifiedAt)}
                    </time>
                  </>
                ) : null}
              </p>
            </div>
            {entry.featuredImage?.url ? (
              <figure>
                <img
                  src={entry.featuredImage.url}
                  alt={entry.imageAlt ?? ""}
                  loading="lazy"
                />
                <figcaption>{entry.imageCredit}</figcaption>
              </figure>
            ) : null}
            {entry.kind === "video" && video ? (
              <>
                <VideoPlayer
                  embedUrl={videoEmbed(video)!}
                  title={entry.title}
                />
                <p>
                  Speaker: {video.speakerName} · Duration:{" "}
                  {durationLabel(video.durationSeconds)} · Uploaded{" "}
                  <time dateTime={video.uploadedAt}>
                    {displayDate(video.uploadedAt)}
                  </time>
                </p>
                <p>
                  <a
                    href={video.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on{" "}
                    {video.platform === "youtube" ? "YouTube" : "Vimeo"}
                  </a>{" "}
                  · Captions are available on the hosted video.
                </p>
              </>
            ) : null}
            {entry.kind === "news" && entry.news ? (
              <p>
                {entry.news.organisation} · Event / announcement:{" "}
                <time dateTime={entry.news.eventAt}>
                  {displayDate(entry.news.eventAt)}
                </time>
                .{" "}
                <a
                  href={entry.news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original announcement
                </a>
              </p>
            ) : null}
            <RichText body={entry.body} />
            {entry.kind === "video" && video ? (
              <section aria-labelledby="transcript-heading">
                <h2 id="transcript-heading">Transcript</h2>
                <p className={styles.transcript}>{video.transcript}</p>
              </section>
            ) : null}
            <section aria-labelledby="sources-heading">
              <h2 id="sources-heading">Sources &amp; further reading</h2>
              <ol>
                {entry.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.label}
                    </a>
                    {source.publishedDate ? (
                      <>
                        {" "}
                        · Source date:{" "}
                        <time dateTime={source.publishedDate}>
                          {source.publishedDate}
                        </time>
                      </>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
            {entry.correctionNote ? (
              <section aria-labelledby="correction-heading">
                <h2 id="correction-heading">Correction</h2>
                <p>{entry.correctionNote}</p>
              </section>
            ) : null}
          </article>
          <aside className={styles.sidebar} aria-labelledby="review-heading">
            <p className={styles.eyebrow}>About this content</p>
            <h2 id="review-heading">
              {entry.clinicalReview ? "Clinical review" : "Editorial context"}
            </h2>
            {entry.clinicalReview ? (
              <>
                <p>
                  Reviewed by {entry.clinicalReview.reviewerName}
                  <br />
                  {entry.clinicalReview.reviewerRole}
                </p>
                <p>
                  Reviewed{" "}
                  <time dateTime={entry.clinicalReview.reviewedAt}>
                    {displayDate(entry.clinicalReview.reviewedAt)}
                  </time>
                  .
                </p>
              </>
            ) : (
              <p>This announcement is classified as nonclinical news.</p>
            )}
            <p>
              This content provides general information. It does not replace
              individual medical advice, diagnosis or treatment.
            </p>
            <Link href="/appointments/book">Request a consultation</Link>
            <br />
            <Link href="/insights">Back to Insights &amp; media</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
