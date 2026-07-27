import achievementsData from "@/content/achievements.json";
import doctorData from "@/content/doctor.json";
import faqData from "@/content/faqs.json";
import pagesData from "@/content/pages.json";
import publicationsData from "@/content/publications.json";
import servicesData from "@/content/services.json";
import siteData from "@/content/site.json";

export type SiteSettings = typeof siteData;
export type Doctor = typeof doctorData;
export type Service = (typeof servicesData)[number];
export type Faq = (typeof faqData)[number];

export type Publication = {
  title: string;
  journal: string;
  year: number;
  authors?: string;
  abstract?: string;
  doiLink?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  slug: string;
};

export type Achievement = {
  title: string;
  description?: string;
  year: number;
  organization?: string;
  isPublished?: boolean;
};

export type ContentCard = {
  title: string;
  description: string;
};

export type RelatedLink = {
  title: string;
  href: string;
  description: string;
};

export type PageSection = {
  heading: string;
  body?: string[];
  cards?: ContentCard[];
};

export type ClinicPage = {
  slug: string;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  schemaType: string;
  sections: PageSection[];
  ctaText: string;
  related: RelatedLink[];
};

export const site = siteData;
export const doctor = doctorData;
export const services = servicesData;
export const faqs = faqData;
export const pages = pagesData as ClinicPage[];
export const publications = publicationsData as Publication[];
export const achievements = achievementsData as Achievement[];

export function getPageBySlug(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export function getPublicationBySlug(slug: string) {
  return publications.find(
    (publication) =>
      publication.slug === slug && publication.isPublished !== false,
  );
}

export const visiblePublications = publications.filter(
  (publication) => publication.isPublished !== false,
);

export const visibleAchievements = achievements.filter(
  (achievement) => achievement.isPublished !== false,
);

export const publicRoutes = [
  "/",
  ...pages.map((page) => page.path),
  "/faq",
  "/contact",
  "/contact-location",
  "/appointments/book",
  ...(visiblePublications.length > 0 ? ["/publications"] : []),
  ...(visibleAchievements.length > 0 ? ["/publications/achievements"] : []),
  ...visiblePublications.map((publication) => `/publications/${publication.slug}`),
];
