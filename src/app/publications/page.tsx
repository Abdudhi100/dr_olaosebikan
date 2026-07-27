import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { publications } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata({
  title: "Research & Publications | Dr Olaosebikan",
  description: "Peer-reviewed publications, research papers, and medical insights by Dr Olaosebikan.",
  keywords: [
    "Dr Olaosebikan publications",
    "rheumatology publications",
    "arthritis research Lagos",
  ],
  path: "/publications",
});

export default function PublicationsPage() {
  const visiblePublications = publications.filter((publication) => publication.isPublished !== false);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Research & Publications",
          description: metadata.description,
        }}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <header className="max-w-2xl">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Research Library
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Research & Publications
              </h1>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                Peer-reviewed publications, research papers, and academic contributions by Dr Olaosebikan.
              </p>
            </div>
          </header>

          <div className="mt-10 grid gap-4">
            {visiblePublications.length > 0 ? (
              visiblePublications.map((publication) => (
                <article key={publication.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-soft sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold leading-snug text-slate-950">
                        <Link href={`/publications/${publication.slug}`} className="hover:text-blue-700">
                          {publication.title}
                        </Link>
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">{publication.journal}</span>
                        <span className="text-slate-300">|</span>
                        <span>{publication.year}</span>
                        {publication.isFeatured ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                            Featured
                          </span>
                        ) : null}
                      </div>
                      {publication.authors ? (
                        <p className="mt-3 text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">Authors:</span> {publication.authors}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={`/publications/${publication.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">Publications pending verification</h2>
                <p className="mt-2 text-slate-600">
                  Verified publication details have not been added to the static site yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
