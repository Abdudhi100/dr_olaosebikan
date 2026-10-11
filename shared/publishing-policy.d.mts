export type RichSpan = {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
};
export type RichBlock = {
  _type: "block";
  _key?: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: RichSpan[];
  markDefs?: { _type: "link"; _key: string; href: string }[];
};
export type EditorialEntry = {
  _id: string;
  _type: "editorialEntry";
  kind: "article" | "video" | "news";
  title: string;
  slug: { current: string };
  summary: string;
  body: RichBlock[];
  topic: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName: string;
  authorRole: string;
  sources: { label: string; url: string; publishedDate?: string }[];
  seoTitle: string;
  seoDescription: string;
  featured?: boolean;
  featuredImage?: { url?: string; asset?: { _ref: string } };
  imageAlt?: string;
  imageCredit?: string;
  requiresClinicalReview: boolean;
  clinicalReview?: {
    status: "approved" | "pending" | "not-required";
    reviewerName?: string;
    reviewerRole?: string;
    credentialsVerified?: boolean;
    reviewedAt?: string;
    evidenceReference?: string;
    approvedFingerprint?: string;
  };
  mediaRightsStatus: "owned" | "permission" | "no-media";
  mediaRightsEvidenceReference?: string;
  publicSafeConfirmed: boolean;
  publicationStatus: "draft" | "ready" | "withdrawn";
  correctionNote?: string;
  video?: {
    platform: "youtube" | "vimeo";
    videoId: string;
    sourceUrl: string;
    durationSeconds: number;
    uploadedAt: string;
    speakerName: string;
    captionsConfirmed: boolean;
    transcriptReviewed: boolean;
    transcript: string;
  };
  news?: { eventAt: string; organisation: string; sourceUrl: string };
};
export type ResearchRecord = {
  _id: string;
  _type: "researchPublication";
  title: string;
  slug: { current: string };
  journal: string;
  year: number;
  authors: string[];
  abstract?: string;
  doiLink?: string;
  sourceUrl: string;
  verified: boolean;
  publicSafeConfirmed: boolean;
  publicationStatus: string;
};
export type AchievementRecord = {
  _id: string;
  _type: "professionalAchievement";
  title: string;
  year: number;
  organisation: string;
  description?: string;
  sourceUrl: string;
  verified: boolean;
  publicSafeConfirmed: boolean;
  publicationStatus: string;
};
export type ContentSnapshot = {
  editorial: EditorialEntry[];
  research: ResearchRecord[];
  achievements: AchievementRecord[];
};
export const TOPICS: string[];
export const KINDS: string[];
export function editorialPath(entry: EditorialEntry): string;
export function isPublishedId(id: unknown): boolean;
export function safeUrl(value: unknown): boolean;
export function safeImageUrl(value: unknown): boolean;
export function videoEmbed(video: EditorialEntry["video"]): string | undefined;
export function contentFingerprint(
  doc: Record<string, unknown>,
): Promise<string>;
export function bodyErrors(body: unknown): string[];
export function releaseErrors(
  doc: unknown,
  options?: { now?: Date },
): Promise<string[]>;
export function recordErrors(doc: unknown, options?: { now?: Date }): string[];
export function validateSnapshot(
  docs: unknown,
  options?: { now?: Date },
): Promise<ContentSnapshot>;
