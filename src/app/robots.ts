import type { MetadataRoute } from "next";
import clinicRelease from "../../../config/clinic-release.json";
import { site } from "@/lib/content";
import { shouldIndexClinic } from "@/lib/site-indexing";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const indexable = shouldIndexClinic(clinicRelease);
  return {
    rules: [
      {
        userAgent: "*",
        ...(indexable ? { allow: "/", disallow: ["/admin/", "/accounts/", "/dashboard/"] } : { disallow: "/" }),
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
