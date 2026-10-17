import { CollectionPage } from "@/components/insights/CollectionPage";
import { editorialEntries } from "@/lib/editorial";
import { defaultMetadata } from "@/lib/seo";
export const dynamic = "force-static";
export const metadata = defaultMetadata({
  title: "Clinic news | Insights & media",
  description:
    "Published clinic news with authorship, sources and publication dates.",
  path: "/insights/news",
});
export default function Page() {
  return (
    <CollectionPage
      title="Clinic news."
      description="Explore published resources from the clinic."
      entries={editorialEntries.filter((e) => e.kind === "news")}
    />
  );
}
