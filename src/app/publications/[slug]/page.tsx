import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getPublicationBySlug, publications } from "@/lib/content";
import { EMPTY_PUBLICATION_FALLBACK_SLUG } from "@/lib/publication-policy";
import { defaultMetadata, publicationJsonLd } from "@/lib/seo";
import { buttonStyles } from "@/lib/styles";

type PublicationDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  const params = publications
    .filter((publication) => publication.isPublished !== false)
    .map((publication) => ({ slug: publication.slug }));

  return params.length > 0
    ? params
    : [{ slug: EMPTY_PUBLICATION_FALLBACK_SLUG }];
}

export async function generateMetadata({ params }: PublicationDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: "Publication record unavailable | Dr Olaosebikan",
      description: "The requested publication record is not currently available as a verified entry.",
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: "/publications",
      },
    };
  }

  return defaultMetadata({
    title: `${publication.title} | Publication`,
    description: publication.abstract || `${publication.title} published in ${publication.journal} (${publication.year}).`,
    keywords: [publication.title, publication.journal, "Dr Olaosebikan publication"],
    path: `/publications/${publication.slug}`,
    type: "article",
  });
}

export default async function PublicationDetailPage({ params }: PublicationDetailProps) {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);

  if (!publication && slug !== EMPTY_PUBLICATION_FALLBACK_SLUG) notFound();

  if (!publication) {
    return (
      <section className="bg-surface-page">
        <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-8 flex min-w-0 items-center gap-2 text-support text-text-tertiary">
            <Link
              href="/"
              className="shrink-0 transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/publications"
              className="shrink-0 transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              Publications
            </Link>
            <span aria-hidden="true">/</span>
            <span className="min-w-0 truncate" aria-current="page">
              Record unavailable
            </span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <header>
              <p className="text-sm font-semibold text-brand-primary">
                Publication record
              </p>
              <h1 className="mt-3 text-page-title tracking-normal text-text-primary sm:text-page-title-lg">
                Publication record unavailable
              </h1>
            </header>

            <section className="border-y border-border-subtle py-7">
              <p className="max-w-reading text-body text-text-secondary">
                The requested publication record is not currently available as a verified entry.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/publications" className={`${buttonStyles.primarySmall} w-full sm:w-auto`}>
                  Back to Publications
                </Link>
                <Link href="/about-dr-olaosebikan" className={`${buttonStyles.tertiary} justify-center sm:justify-start`}>
                  About Dr Olaosebikan
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <JsonLd data={publicationJsonLd(publication)} />
      <section className="bg-surface-page">
        <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-6">
            <Link href="/publications" className={`${buttonStyles.tertiary}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Publications
            </Link>
          </div>

          <article className="border-y border-border-subtle py-8">
            <div>
              <header className="space-y-3">
                {publication.isFeatured ? (
                  <span className="text-support font-semibold text-brand-primary">
                    Featured Publication
                  </span>
                ) : null}

                <h1 className="max-w-reading text-page-title tracking-normal text-text-primary sm:text-page-title-lg">
                  {publication.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-support text-text-secondary">
                  <span className="font-semibold text-text-primary">{publication.journal}</span>
                  <span className="text-border-default" aria-hidden="true">/</span>
                  <span>{publication.year}</span>
                </div>

                {publication.authors ? (
                  <p className="text-support text-text-secondary">
                    <span className="font-semibold">Authors:</span> {publication.authors}
                  </p>
                ) : null}
              </header>

              <div className="mt-8 grid max-w-reading gap-6">
                {publication.doiLink ? (
                  <section className="border-t border-border-subtle pt-5">
                    <h2 className="text-subsection-title tracking-normal text-text-primary">DOI / External Link</h2>
                    <a href={publication.doiLink} target="_blank" rel="noreferrer" className="mt-2 block break-words text-sm font-semibold text-brand-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                      {publication.doiLink}
                    </a>
                  </section>
                ) : null}

                {publication.abstract ? (
                  <section className="border-t border-border-subtle pt-5">
                    <h2 className="text-subsection-title tracking-normal text-text-primary">Abstract</h2>
                    <p className="mt-3 whitespace-pre-line text-body text-text-secondary">
                      {publication.abstract}
                    </p>
                  </section>
                ) : null}

                {publication.doiLink ? (
                  <a
                    href={publication.doiLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`${buttonStyles.secondary} w-full sm:w-fit`}
                  >
                    Visit DOI Link
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
