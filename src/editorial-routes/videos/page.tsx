import { CollectionPage } from "@/components/insights/CollectionPage";
import { editorialEntries } from "@/lib/editorial";
import { defaultMetadata } from "@/lib/seo";
export const dynamic = "force-static";
export const metadata = defaultMetadata({
  title: "Videos | Insights & media",
  description:
    "Published videos with authorship, sources and publication dates.",
  path: "/insights/videos",
});
export default function Page() {
  return (
    <CollectionPage
      title="Videos."
      description="Explore published resources from the clinic."
      entries={editorialEntries.filter((e) => e.kind === "video")}
    />
  );
}
