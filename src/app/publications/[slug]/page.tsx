import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getPublicationBySlug, publications } from "@/lib/content";
import { EMPTY_PUBLICATION_FALLBACK_SLUG } from "@/lib/publication-policy";
import { defaultMetadata, publicationJsonLd } from "@/lib/seo";
export const dynamicParams = false;
export const dynamic = "force-static";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  const records = publications
    .filter((p) => p.isPublished !== false)
    .map((p) => ({ slug: p.slug }));
  return records.length ? records : [{ slug: EMPTY_PUBLICATION_FALLBACK_SLUG }];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPublicationBySlug(slug);
  return p
    ? defaultMetadata({
        title: `${p.title} | Publication`,
        description:
          p.abstract || `${p.title} published in ${p.journal} (${p.year}).`,
        path: `/publications/${p.slug}`,
        type: "article",
      })
    : {
        title: "Publication record unavailable | Dr Olaosebikan",
        description:
          "The requested publication record is not currently available as a verified entry.",
        robots: { index: false, follow: false },
        alternates: { canonical: "/publications" },
      };
}
export default async function PublicationDetail({ params }: Props) {
  const { slug } = await params;
  const p = getPublicationBySlug(slug);
  if (!p && slug !== EMPTY_PUBLICATION_FALLBACK_SLUG) notFound();
  return (
    <>
      {p && <JsonLd data={publicationJsonLd(p)} />}
      <article className="clinic-section clinic-publication-detail">
        <div className="clinic-container">
          <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/publications">Publications</Link>
            <span aria-hidden>/</span>
            {p ? "Publication" : "Record unavailable"}
          </nav>
          <h1 className="clinic-subtitle">
            {p?.title ?? "Publication record unavailable"}
          </h1>
          {p ? (
            <>
              <p className="clinic-publication-citation">
                {p.authors && `${p.authors} · `}
                {p.journal} · {p.year}
              </p>
              <section className="clinic-care-section">
                <h2>Summary</h2>
                <p>
                  {p.abstract ||
                    "An authorised summary has not been added for this publication."}
                </p>
              </section>
              <section className="clinic-care-section">
                <h2>Citation and source</h2>
                <p>
                  {p.title}. {p.journal}. {p.year}.
                </p>
                {(p.doiLink || p.sourceUrl) && (
                  <a
                    className="clinic-button clinic-button-outline"
                    style={{ marginTop: 28 }}
                    href={p.doiLink || p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View publication source <span aria-hidden>↗</span>
                  </a>
                )}
              </section>
            </>
          ) : (
            <p className="clinic-lead">
              The requested publication record is not currently available as a
              verified entry.
            </p>
          )}
          <Link
            href="/publications"
            className="clinic-button clinic-button-outline"
            style={{ marginTop: 32 }}
          >
            Back to publications
          </Link>
        </div>
      </article>
    </>
  );
}
