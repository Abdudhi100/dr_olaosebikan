import type { Metadata } from "next";
import { absoluteUrl, defaultMetadata } from "@/lib/seo";
import { entryPath, isoDuration, type PublicEntry } from "@/lib/editorial";
import { videoEmbed } from "../../shared/publishing-policy.mjs";
export function entryMetadata(entry: PublicEntry): Metadata {
  const base = defaultMetadata({
    title: entry.seoTitle,
    description: entry.seoDescription,
    path: entryPath(entry),
    type: "article",
  });
  const image = entry.featuredImage?.url;
  return {
    ...base,
    authors: [{ name: entry.authorName }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: entry.publishedAt,
      ...(entry.modifiedAt ? { modifiedTime: entry.modifiedAt } : {}),
      authors: [entry.authorName],
      ...(image ? { images: [{ url: image, alt: entry.imageAlt }] } : {}),
    },
    ...(image
      ? {
          twitter: {
            card: "summary_large_image",
            title: entry.seoTitle,
            description: entry.seoDescription,
            images: [image],
          },
        }
      : {}),
  };
}
export function entryJsonLd(entry: PublicEntry) {
  const base = {
    "@context": "https://schema.org",
    "@type": entry.kind === "news" ? "NewsArticle" : "Article",
    headline: entry.title,
    description: entry.summary,
    url: absoluteUrl(entryPath(entry)),
    mainEntityOfPage: absoluteUrl(entryPath(entry)),
    datePublished: entry.publishedAt,
    ...(entry.modifiedAt ? { dateModified: entry.modifiedAt } : {}),
    author: {
      "@type": "Person",
      name: entry.authorName,
      jobTitle: entry.authorRole,
    },
    ...(entry.featuredImage?.url ? { image: entry.featuredImage.url } : {}),
    citation: entry.sources.map((source) => source.url),
  };
  if (entry.kind !== "video" || !entry.video) return base;
  const v = entry.video;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: entry.title,
    description: entry.summary,
    thumbnailUrl: [entry.featuredImage!.url!],
    uploadDate: v.uploadedAt,
    duration: isoDuration(v.durationSeconds),
    embedUrl: videoEmbed(v),
    url: absoluteUrl(entryPath(entry)),
    transcript: v.transcript,
    author: { "@type": "Person", name: v.speakerName },
  };
}
