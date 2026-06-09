import type { MetadataRoute } from "next";
import { publicRoutes, site } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route, site.siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/appointments") ? 0.9 : 0.7,
  }));
}
