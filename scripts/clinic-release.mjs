import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const configPath = new URL("../config/clinic-release.json", import.meta.url);
export const clinicReadiness = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Confirm advertised consultation duration matches structured service records.
// This applies to ALL public builds. Local and Access-protected preview may run
// while the owner updates copy. Never guess the duration or silently rewrite data.
export function clinicDurationConsistencyErrors(advertisedMinutes, serviceMinutes) {
  if (!advertisedMinutes.length) return [];
  if (advertisedMinutes.some((minutes) => !Number.isInteger(minutes) || minutes <= 0))
    return ["consultationDurationMismatch"];
  return serviceMinutes.some((minutes) => !Number.isInteger(minutes) || !advertisedMinutes.every((claim) => claim === minutes))
    ? ["consultationDurationMismatch"]
    : [];
}
const services = JSON.parse(fs.readFileSync(new URL("../src/content/services.json", import.meta.url), "utf8"));
// Scan all route, shared component and content copy for duration claims.
function listing(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? listing(target)
      : entry.isFile() && /\.(?:tsx?|json)$/.test(entry.name) ? [target]
      : [];
  });
}
export function advertisedConsultationMinutes(text) {
  return Array.from(
    text.matchAll(/\b(one.hour|1.hour|45.minute|60.minute)\s+(?:appointments?|consultations?)\b/gi),
    ([, duration]) => /^(one|1|60)/i.test(duration) ? 60 : 45,
  );
}
const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const timingCopyFiles = ["app", "components", "content"].flatMap((folder) =>
  listing(path.join(sourceRoot, folder)));
const advertisedMinutes = timingCopyFiles.flatMap((filename) =>
  advertisedConsultationMinutes(fs.readFileSync(filename, "utf8")));
const contentConsistencyIssues = clinicDurationConsistencyErrors(advertisedMinutes,
  services.map((service) => service.durationMinutes));
export function clinicReleaseErrors(config) {
  const errors = [];
  for (const field of [
    "professionalClaimsVerified",
    "clinicalCopyApproved",
    "contactDetailsConfirmed",
    "mediaRightsApproved",
    "homepageMediaComplete",
    "canonicalDomainConfirmed",
  ]) {
    if (config[field] !== true) errors.push(field);
    if (
      typeof config.evidenceReferences?.[field] !== "string" ||
      !config.evidenceReferences[field].trim()
    )
      errors.push(`${field} evidence reference`);
  }
  errors.push(...contentConsistencyIssues);
  if (config.releaseStatus !== "approved") errors.push("releaseStatus");
  if (config.booking?.enabled === true) {
    if (
      typeof config.booking.privacyNoticePath !== "string" ||
      !/^\/[a-z0-9][a-z0-9/-]*$/.test(config.booking.privacyNoticePath)
    )
      errors.push("booking.privacyNoticePath");
    for (const field of [
      "recipientBindingVerified",
      "privacyNoticeApproved",
      "retentionApproved",
      "rateProtectionVerified",
    ]) {
      if (config.booking[field] !== true) errors.push(`booking.${field}`);
      if (
        typeof config.evidenceReferences?.[field] !== "string" ||
        !config.evidenceReferences[field].trim()
      )
        errors.push(`${field} evidence reference`);
    }
  } else if (config.booking?.contactOnlyFallbackApproved !== true)
    errors.push("booking.contactOnlyFallbackApproved");
  return errors;
}
export function assertClinicBuildAllowed(
  env = process.env,
  config = clinicReadiness,
) {
  if (env.CF_PAGES !== "1" && env.CLINIC_RELEASE !== "approved") return;
  if (
    env.CLINIC_REVIEW_BUILD === "1" &&
    config.privatePreviewAccessVerified === true &&
    typeof config.evidenceReferences?.privatePreviewAccessVerified ===
      "string" &&
    config.evidenceReferences.privatePreviewAccessVerified.trim() &&
    typeof config.productionBranch === "string" &&
    config.productionBranch.trim() &&
    env.CF_PAGES_BRANCH &&
    env.CF_PAGES_BRANCH !== config.productionBranch
  )
    return;
  const errors = clinicReleaseErrors(config);
  if (errors.length)
    throw new Error(
      `Clinic release is pending: ${errors.join(", ")}. Local review builds remain available. Record verified approval before a public Cloudflare build.`,
    );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = clinicReleaseErrors(clinicReadiness);
  if (errors.length) {
    console.error(`Not ready for public release: ${errors.join(", ")}`);
    process.exitCode = 1;
  } else console.log("Clinic release checks passed.");
}
