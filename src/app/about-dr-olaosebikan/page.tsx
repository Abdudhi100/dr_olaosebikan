import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicContentPage } from "@/components/ClinicContentPage";
import { JsonLd } from "@/components/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { defaultMetadata, physicianJsonLd } from "@/lib/seo";

const contentPage = getPageBySlug("about-dr-olaosebikan");

export const metadata: Metadata = contentPage
  ? defaultMetadata({
      title: contentPage.seoTitle,
      description: contentPage.seoDescription,
      keywords: contentPage.keywords,
      path: contentPage.path,
    })
  : {};

export default function AboutDoctorPage() {
  if (!contentPage) notFound();

  return (
    <>
      <JsonLd data={physicianJsonLd()} />
      <ClinicContentPage page={contentPage} />
    </>
  );
}
