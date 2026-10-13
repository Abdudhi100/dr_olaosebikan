/** Rights are deliberately fail-closed. Review files are served only by the local review server. */
export type HeroMedia = {
  poster?: string;
  fallback: "existing";
  reviewSource?: string;
  approvedSource?: string;
  rightsApproved: boolean;
  missing?: string;
};
export const heroMedia: Record<string, HeroMedia> = {
  home: { poster: "/images/figma/home-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/home.mp4", rightsApproved: false },
  services: { poster: "/images/figma/services-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/services.mp4", rightsApproved: false },
  specialist: { fallback: "existing", rightsApproved: false, missing: "Professional clinic footage; preserve genuine portrait" },
  appointments: { fallback: "existing", rightsApproved: false, missing: "Consultation preparation footage" },
  contact: { fallback: "existing", rightsApproved: false, missing: "Verified consultation location footage" },
  faq: { fallback: "existing", rightsApproved: false, missing: "Relevant educational footage" },
  insights: { fallback: "existing", rightsApproved: false, missing: "Educational/research footage suitable for a decorative background" },
  publications: { fallback: "existing", rightsApproved: false, missing: "Scholarly reading/research footage" },
  achievements: { fallback: "existing", rightsApproved: false, missing: "Appropriate professional footage" },
  clinical: { fallback: "existing", rightsApproved: false, missing: "Condition-specific reviewed footage and poster composition" },
};
export function heroVideoSource(media: HeroMedia, hostname: string, search: string): string | undefined {
  if (media.rightsApproved && media.approvedSource) return media.approvedSource;
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname) && new URLSearchParams(search).get("heroVideoReview") === "1") return media.reviewSource;
  return undefined;
}
