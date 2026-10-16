/** Rights are deliberately fail-closed. Review files are served only by the local review server. */
export type HeroMedia = {
  poster?: string;
  fallback: "existing";
  reviewSource?: string;
  approvedSource?: string;
  reviewMobileSource?: string;
  reviewPoster?: string;
  approvedMobileSource?: string;
  rightsApproved: boolean;
  missing?: string;
};
export const heroMedia: Record<string, HeroMedia> = {
  home: { poster: "/images/figma/home-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/home.mp4", reviewMobileSource: "/__clinic-review-media/home-mobile.mp4", rightsApproved: false },
  services: { poster: "/images/figma/services-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/services.mp4", reviewMobileSource: "/__clinic-review-media/services-mobile.mp4", rightsApproved: false },
  specialist: { fallback: "existing", rightsApproved: false, missing: "Professional clinic footage; preserve genuine portrait" },
  appointments: { fallback: "existing", rightsApproved: false, missing: "Consultation preparation footage" },
  contact: { fallback: "existing", rightsApproved: false, missing: "Verified consultation location footage" },
  faq: { fallback: "existing", rightsApproved: false, missing: "Relevant educational footage" },
  insights: { fallback: "existing", rightsApproved: false, missing: "Educational/research footage suitable for a decorative background" },
  publications: { fallback: "existing", rightsApproved: false, missing: "Scholarly reading/research footage" },
  achievements: { fallback: "existing", rightsApproved: false, missing: "Appropriate professional footage" },
  clinical: { fallback: "existing", rightsApproved: false, missing: "Condition-specific reviewed footage and poster composition" },
};
export const heroRoutes: Record<string, string> = {
  "/": "home", "/services": "services", "/about-dr-olaosebikan": "specialist",
  "/appointments/book": "appointments", "/contact-location": "contact", "/faq": "faq",
  "/insights": "insights", "/publications": "publications", "/publications/achievements": "achievements",
  "/joint-pain-and-stiffness-clinic-lagos": "clinical:joint-pain-and-stiffness-clinic-lagos",
  "/rheumatoid-arthritis-treatment-lagos": "clinical:rheumatoid-arthritis-treatment-lagos",
  "/gout-treatment-lagos": "clinical:gout-treatment-lagos",
  "/lupus-care-lagos": "clinical:lupus-care-lagos",
  "/autoimmune-disease-specialist-lagos": "clinical:autoimmune-disease-specialist-lagos",
};
for (const [route, variant] of Object.entries(heroRoutes)) {
  if (variant.startsWith("clinical:")) heroMedia[variant] = { ...heroMedia.clinical, missing: `Reviewed condition-specific footage and poster for ${route}` };
}
// Review-only. The recorded source depicts a knee examination in a wheelchair;
// rights, context and clinical suitability are NOT approved for publication.
const kneeVariant = "clinical:joint-pain-and-stiffness-clinic-lagos";
heroMedia[kneeVariant] = {
  ...heroMedia[kneeVariant],
  reviewSource: "/__clinic-review-media/joint-pain.mp4",
  reviewMobileSource: "/__clinic-review-media/joint-pain-mobile.mp4",
  reviewPoster: "/__clinic-review-media/joint-pain-poster.webp",
  rightsApproved: false,
  missing: "Knee-assessment footage is for loopback review only; source rights, patient/model consent, clinical context and owner acceptance unverified",
};
export function heroVideoSource(media: HeroMedia, hostname: string, search: string, width = 1440): string | undefined {
  if (media.rightsApproved && media.approvedSource) return width < 768 ? media.approvedMobileSource || media.approvedSource : media.approvedSource;
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname) && new URLSearchParams(search).get("heroVideoReview") === "1") return width < 768 ? media.reviewMobileSource || media.reviewSource : media.reviewSource;
  return undefined;
}
