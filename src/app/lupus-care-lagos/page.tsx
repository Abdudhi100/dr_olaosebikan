import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicContentPage } from "@/components/ClinicContentPage";
import { JsonLd } from "@/components/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { defaultMetadata, medicalPageJsonLd } from "@/lib/seo";

const contentPage = getPageBySlug("lupus-care-lagos");

export const metadata: Metadata = contentPage
  ? defaultMetadata({
      title: contentPage.seoTitle,
      description: contentPage.seoDescription,
      keywords: contentPage.keywords,
      path: contentPage.path,
    })
  : {};

export default function LupusCarePage() {
  if (!contentPage) notFound();

  return (
    <>
      <JsonLd data={medicalPageJsonLd(contentPage)} />
      <ClinicContentPage page={contentPage} />
    </>
  );
}
