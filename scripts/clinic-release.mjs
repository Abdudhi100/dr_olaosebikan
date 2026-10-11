import fs from "node:fs";
import { fileURLToPath } from "node:url";
const configPath = new URL("../config/clinic-release.json", import.meta.url);
export const clinicReadiness = JSON.parse(fs.readFileSync(configPath, "utf8"));
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
