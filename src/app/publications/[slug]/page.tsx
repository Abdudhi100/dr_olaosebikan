import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getPublicationBySlug, publications } from "@/lib/content";
import { defaultMetadata, publicationJsonLd } from "@/lib/seo";

type PublicationDetailProps = {
  params: Promise<{ slug: string }>;
};

const EMPTY_PUBLICATION_FALLBACK_SLUG = "publication-record-unavailable";

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
      description: "Verified publication details have not been added to the static site yet.",
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
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase text-blue-700">
            Publications
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
            Publication details are pending verification
          </h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            Verified publication records have not been added to the static site yet.
          </p>
          <Link href="/publications" className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Back to Publications
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <JsonLd data={publicationJsonLd(publication)} />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-6">
            <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Publications
            </Link>
          </div>

          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <header className="space-y-3">
                {publication.isFeatured ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                    Featured Publication
                  </span>
                ) : null}

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  {publication.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{publication.journal}</span>
                  <span className="text-slate-300">|</span>
                  <span>{publication.year}</span>
                </div>

                {publication.authors ? (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Authors:</span> {publication.authors}
                  </p>
                ) : null}
              </header>

              <div className="mt-8 grid gap-5">
                {publication.doiLink ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">DOI / External Link</p>
                    <a href={publication.doiLink} target="_blank" rel="noreferrer" className="mt-1 block break-words text-sm text-blue-700 hover:underline">
                      {publication.doiLink}
                    </a>
                  </div>
                ) : null}

                {publication.abstract ? (
                  <section className="rounded-lg border border-slate-200 p-5">
                    <h2 className="text-lg font-bold text-slate-950">Abstract</h2>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                      {publication.abstract}
                    </p>
                  </section>
                ) : null}

                {publication.doiLink ? (
                  <a
                    href={publication.doiLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:w-auto"
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
