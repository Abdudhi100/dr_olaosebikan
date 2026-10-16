/** Rights are deliberately fail-closed. Review files are served only by the local review server. */
export type HeroMedia = {
  poster?: string;
  approvedPoster?: string;
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
  home: { poster: "/images/figma/home-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/home.mp4", reviewMobileSource: "/__clinic-review-media/home-mobile.mp4", approvedSource: "/video/clinic/home-desktop.mp4", approvedMobileSource: "/video/clinic/home-mobile.mp4", rightsApproved: true },
  services: { poster: "/images/figma/services-hero.webp", fallback: "existing", reviewSource: "/__clinic-review-media/services.mp4", reviewMobileSource: "/__clinic-review-media/services-mobile.mp4", approvedSource: "/video/clinic/services-desktop.mp4", approvedMobileSource: "/video/clinic/services-mobile.mp4", rightsApproved: true },
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
const sharedClinicHero = {
  approvedPoster: heroMedia.services.poster,
  approvedSource: heroMedia.services.approvedSource,
  approvedMobileSource: heroMedia.services.approvedMobileSource,
  rightsApproved: true,
};
heroMedia.specialist = { ...heroMedia.specialist, ...sharedClinicHero, missing: undefined };
for (const [route, variant] of Object.entries(heroRoutes)) {
  if (variant.startsWith("clinical:") && variant !== "clinical:joint-pain-and-stiffness-clinic-lagos") {
    heroMedia[variant] = { ...heroMedia[variant], ...sharedClinicHero, missing: undefined };
  }
}
// The owner-cleared Joint Pain clip remains limited to the protected preview build.
const kneeVariant = "clinical:joint-pain-and-stiffness-clinic-lagos";
heroMedia[kneeVariant] = {
  ...heroMedia[kneeVariant],
  reviewSource: "/__clinic-review-media/joint-pain.mp4",
  reviewMobileSource: "/__clinic-review-media/joint-pain-mobile.mp4",
  reviewPoster: "/__clinic-review-media/joint-pain-poster.webp",
  rightsApproved: false,
  missing: "Knee-assessment footage is limited to the protected preview build",
};
// Owner-cleared footage is enabled only in an explicit protected preview build.
// A production build continues to use its existing image/background fallbacks.
heroMedia.appointments = { ...heroMedia.appointments, approvedPoster: "/video/clinic/appointments-poster.webp", approvedSource: "/video/clinic/appointments-desktop.mp4", approvedMobileSource: "/video/clinic/appointments-mobile.mp4", rightsApproved: true };
heroMedia.contact = { ...heroMedia.contact, approvedPoster: "/video/clinic/contact-poster.webp", approvedSource: "/video/clinic/contact-desktop.mp4", approvedMobileSource: "/video/clinic/contact-mobile.mp4", rightsApproved: true };
heroMedia.faq = { ...heroMedia.faq, approvedPoster: "/video/clinic/faq-poster.webp", approvedSource: "/video/clinic/faq-desktop.mp4", approvedMobileSource: "/video/clinic/faq-mobile.mp4", rightsApproved: true };
heroMedia.insights = { ...heroMedia.insights, approvedPoster: "/video/clinic/insights-poster.webp", approvedSource: "/video/clinic/insights-desktop.mp4", approvedMobileSource: "/video/clinic/insights-mobile.mp4", rightsApproved: true };
heroMedia.publications = { ...heroMedia.publications, approvedPoster: "/video/clinic/publications-poster.webp", approvedSource: "/video/clinic/publications-desktop.mp4", approvedMobileSource: "/video/clinic/publications-mobile.mp4", rightsApproved: true };
heroMedia.achievements = { ...heroMedia.achievements, approvedPoster: "/video/clinic/achievements-poster.webp", approvedSource: "/video/clinic/achievements-desktop.mp4", approvedMobileSource: "/video/clinic/achievements-mobile.mp4", rightsApproved: true };
heroMedia[kneeVariant] = { ...heroMedia[kneeVariant], approvedPoster: "/video/clinic/joint-pain-poster.webp", approvedSource: "/video/clinic/joint-pain-desktop.mp4", approvedMobileSource: "/video/clinic/joint-pain-mobile.mp4", rightsApproved: true };
export function heroVideoSource(media: HeroMedia, hostname: string, search: string, width = 1440, previewEnabled = process.env.NEXT_PUBLIC_CLINIC_HERO_PREVIEW === "1"): string | undefined {
  if (previewEnabled && media.rightsApproved && media.approvedSource) return width < 768 ? media.approvedMobileSource || media.approvedSource : media.approvedSource;
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname) && new URLSearchParams(search).get("heroVideoReview") === "1") return width < 768 ? media.reviewMobileSource || media.reviewSource : media.reviewSource;
  return undefined;
}
