import { notFound } from "next/navigation";
import { EntryPage } from "@/components/insights/EntryPage";
import { editorialEntries, getEntry } from "@/lib/editorial";
import { entryMetadata } from "@/lib/editorial-seo";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return editorialEntries
    .filter((entry) => entry.kind === "article")
    .map((entry) => ({ slug: entry.slug.current }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry("article", slug);
  if (!entry) notFound();
  return entryMetadata(entry);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry("article", slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} />;
}
