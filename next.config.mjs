import {
  assertClinicBuildAllowed,
  clinicReadiness,
  clinicReleaseErrors,
} from "./scripts/clinic-release.mjs";
import fs from "node:fs";
assertClinicBuildAllowed();
if (
  clinicReadiness.booking.enabled &&
  clinicReleaseErrors(clinicReadiness).length === 0 &&
  !fs.existsSync(
    new URL(
      `./src/app${clinicReadiness.booking.privacyNoticePath}/page.tsx`,
      import.meta.url,
    ),
  )
)
  throw new Error("Approved booking privacy notice route is missing.");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_CLINIC_HERO_PREVIEW: process.env.CLINIC_REVIEW_BUILD === "1" && process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== clinicReadiness.productionBranch ? "1" : "0",
    NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH: clinicReadiness.booking.enabled
      ? clinicReadiness.booking.privacyNoticePath
      : "",
    // Protected preview builds must never send real patient requests.
    NEXT_PUBLIC_BOOKING_DELIVERY_APPROVED:
      clinicReleaseErrors(clinicReadiness).length === 0 &&
      clinicReadiness.booking.enabled &&
      process.env.CF_PAGES === "1" &&
      process.env.CF_PAGES_BRANCH === clinicReadiness.productionBranch
        ? "1"
        : "0",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
