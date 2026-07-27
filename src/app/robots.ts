import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/accounts/", "/dashboard/"],
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
