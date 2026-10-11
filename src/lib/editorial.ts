import snapshot from "@/generated/editorial.json";
import type {
  EditorialEntry,
  RichBlock,
} from "../../shared/publishing-policy.mjs";
export type { RichBlock };
export type PublicEntry = Omit<
  EditorialEntry,
  | "clinicalReview"
  | "mediaRightsStatus"
  | "mediaRightsEvidenceReference"
  | "publicSafeConfirmed"
  | "publicationStatus"
> & {
  clinicalReview?: {
    status: "approved";
    reviewerName: string;
    reviewerRole: string;
    reviewedAt: string;
  };
};
export const editorialEntries = snapshot.editorial as PublicEntry[];
export const entryPath = (entry: PublicEntry) =>
  `/insights/${{ article: "articles", video: "videos", news: "news" }[entry.kind]}/${entry.slug.current}`;
export const formatLabel = {
  article: "Article",
  video: "Video",
  news: "Clinic news",
};
export function displayDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(date));
}
export function durationLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function isoDuration(seconds: number) {
  return `PT${seconds}S`;
}
export function getEntry(kind: PublicEntry["kind"], slug: string) {
  return editorialEntries.find(
    (entry) => entry.kind === kind && entry.slug.current === slug,
  );
}
