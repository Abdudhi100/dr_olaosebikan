import type { Metadata } from "next";
import { doctor, faqs, site, type ClinicPage, type Publication } from "@/lib/content";

type MetadataInput = {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  return new URL(path, site.siteUrl).toString();
}

export function defaultMetadata({
  title,
  description,
  keywords = site.metaKeywords,
  path,
  image = site.ogImage,
  type = "website",
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(site.siteUrl),
    title,
    description,
    keywords,
    authors: [{ name: site.clinicName }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.clinicName,
      type,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Dr Olaosebikan Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/favicon/favicon.ico" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/favicon/apple-touch-icon.png" }],
    },
  };
}

export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: site.clinicName,
    url: site.siteUrl,
    description: site.metaDescription,
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl(site.ogImage),
    medicalSpecialty: "Rheumatology",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressCountry: "NG",
      addressLocality: "Lagos",
    },
  };
}

export function physicianJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.displayName,
    url: absoluteUrl("/about-dr-olaosebikan"),
    image: absoluteUrl(doctor.profilePhoto),
    medicalSpecialty: ["Rheumatology"],
    areaServed: "Lagos, Nigeria",
    telephone: site.phone,
    email: site.email,
    affiliation: doctor.hospitalAffiliations.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressCountry: "NG",
      addressLocality: "Lagos",
    },
  };
}

export function medicalPageJsonLd(page: ClinicPage) {
  return {
    "@context": "https://schema.org",
    "@type": page.schemaType || "MedicalWebPage",
    name: page.title,
    url: absoluteUrl(page.path),
    description: page.seoDescription,
    mainEntity: {
      "@type": "MedicalCondition",
      name: page.title,
    },
    reviewedBy: {
      "@type": "Physician",
      name: doctor.displayName,
      medicalSpecialty: "Rheumatology",
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function publicationJsonLd(publication: Publication) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: publication.title,
    name: publication.title,
    author: publication.authors || doctor.displayName,
    datePublished: String(publication.year),
    isPartOf: publication.journal,
    description: publication.abstract,
    url: absoluteUrl(`/publications/${publication.slug}`),
    sameAs: publication.doiLink,
  };
}
