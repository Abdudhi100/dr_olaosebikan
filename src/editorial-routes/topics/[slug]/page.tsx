import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/insights/CollectionPage";
import { editorialEntries, editorialTopics, topicSlug } from "@/lib/editorial";
import { defaultMetadata } from "@/lib/seo";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return editorialTopics.map((topic) => ({ slug: topicSlug(topic) }));
}
type Props = { params: Promise<{ slug: string }> };
async function collection(params: Props["params"]) {
  const { slug } = await params;
  const topic = editorialTopics.find((t) => topicSlug(t) === slug);
  if (!topic) notFound();
  return {
    slug,
    topic,
    entries: editorialEntries.filter((e) => e.topic === topic),
  };
}
export async function generateMetadata({ params }: Props) {
  const { slug, topic } = await collection(params);
  return defaultMetadata({
    title: `${topic} | Insights & media`,
    description: `Published articles, videos and updates about ${topic.toLowerCase()}.`,
    path: `/insights/topics/${slug}`,
  });
}
export default async function Page({ params }: Props) {
  const { topic, entries } = await collection(params);
  return (
    <CollectionPage
      title={`${topic}.`}
      description="Explore published resources with clear authorship, sources and publication dates."
      entries={entries}
    />
  );
}
