import type { MetadataRoute } from "next";
import { publicRoutes, site } from "@/lib/content";
import {
  editorialEntries,
  entryPath,
  editorialTopics,
  topicSlug,
} from "@/lib/editorial";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: new URL(route, site.siteUrl).toString(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/appointments") ? 0.9 : 0.7,
  }));
  // Existing pages have no verified change date: omit lastmod instead of using build time.
  if (editorialEntries.length) {
    routes.push({
      url: new URL("/insights", site.siteUrl).toString(),
      lastModified: new Date(
        Math.max(
          ...editorialEntries.map((e) =>
            Date.parse(e.modifiedAt ?? e.publishedAt),
          ),
        ),
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const topic of editorialTopics) {
      const entries = editorialEntries.filter((e) => e.topic === topic);
      routes.push({
        url: new URL(
          `/insights/topics/${topicSlug(topic)}`,
          site.siteUrl,
        ).toString(),
        lastModified: new Date(
          Math.max(
            ...entries.map((e) => Date.parse(e.modifiedAt ?? e.publishedAt)),
          ),
        ),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const [kind, folder] of [
      ["article", "articles"],
      ["video", "videos"],
      ["news", "news"],
    ]) {
      const entries = editorialEntries.filter((e) => e.kind === kind);
      if (entries.length)
        routes.push({
          url: new URL(`/insights/${folder}`, site.siteUrl).toString(),
          lastModified: new Date(
            Math.max(
              ...entries.map((e) => Date.parse(e.modifiedAt ?? e.publishedAt)),
            ),
          ),
          changeFrequency: "weekly",
          priority: 0.6,
        });
    }
    for (const entry of editorialEntries)
      routes.push({
        url: new URL(entryPath(entry), site.siteUrl).toString(),
        lastModified: new Date(entry.modifiedAt ?? entry.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
  }
  return routes;
}
