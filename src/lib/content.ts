import type {ResearchRecord, AchievementRecord} from "../../shared/publishing-policy.mjs";
import cmsRecords from "@/generated/research.json";
import achievementsData from "@/content/achievements.json";
import doctorData from "@/content/doctor.json";
import faqData from "@/content/faqs.json";
import pagesData from "@/content/pages.json";
import publicationsData from "@/content/publications.json";
import servicesData from "@/content/services.json";
import siteData from "@/content/site.json";
import { assertNoReservedPublicationSlugs } from "@/lib/publication-policy";

export type SiteSettings = typeof siteData;
export type Doctor = typeof doctorData;
export type Service = (typeof servicesData)[number];
export type Faq = (typeof faqData)[number];

export type Publication = {
  title: string;
  journal: string;
  year: number;
  authors?: string;
  authorNames?: string[];
  abstract?: string;
  doiLink?: string;
  sourceUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  slug: string;
};

export type Achievement = {
  title: string;
  description?: string;
  year: number;
  organization?: string;
  sourceUrl?: string;
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
export const publications: Publication[] = [
  ...(publicationsData as Publication[]),
  ...(cmsRecords.research as ResearchRecord[]).map(record => ({title: record.title, journal: record.journal, year: record.year, authors: record.authors.join(", "), authorNames: record.authors, abstract: record.abstract, doiLink: record.doiLink, sourceUrl: record.sourceUrl, slug: record.slug.current, isPublished: true})),
];
if (new Set(publications.map(record => record.slug)).size !== publications.length) throw new Error("CMS research slug collides with an existing publication.");
export const achievements: Achievement[] = [
  ...(achievementsData as Achievement[]),
  ...(cmsRecords.achievements as AchievementRecord[]).map(record => ({title: record.title, year: record.year, organization: record.organisation, description: record.description, sourceUrl: record.sourceUrl, isPublished: true})),
];

assertNoReservedPublicationSlugs(publications);

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
