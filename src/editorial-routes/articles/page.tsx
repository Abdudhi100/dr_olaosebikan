import { CollectionPage } from "@/components/insights/CollectionPage";
import { editorialEntries } from "@/lib/editorial";
import { defaultMetadata } from "@/lib/seo";
export const dynamic = "force-static";
export const metadata = defaultMetadata({
  title: "Articles | Insights & media",
  description:
    "Published articles with authorship, sources and publication dates.",
  path: "/insights/articles",
});
export default function Page() {
  return (
    <CollectionPage
      title="Articles."
      description="Explore published resources from the clinic."
      entries={editorialEntries.filter((e) => e.kind === "article")}
    />
  );
}
