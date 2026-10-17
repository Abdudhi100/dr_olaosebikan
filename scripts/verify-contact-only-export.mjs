/**
 * Deployment-safe check of the ACTUAL static export, not just source conditionals.
 * Runs during CI after next build. No patient data, credentials or network calls.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const config = JSON.parse(readFileSync("config/clinic-release.json", "utf8"));
if (config.booking.enabled !== false) {
  console.log("Contact-only export check skipped: real booking release uses separate approvals.");
} else {
  assert.equal(config.releaseStatus, "pending", "CI must not approve release");
  assert.equal(config.booking.contactOnlyFallbackApproved, false, "Owner acceptance must remain a manual gate before this PR is finalized");
  for (const file of ["out/index.html", "out/appointments/book.html"]) {
    assert.ok(existsSync(file), `Missing export: ${file}`);
    const html = readFileSync(file, "utf8");
    assert.match(html, /data-booking-mode="contact-only"/, `${file}: must show contact-only panel`);
    assert.doesNotMatch(html, /<form\b/i, `${file}: must not render patient intake form`);
    assert.doesNotMatch(html, /<input\b/i, `${file}: must not request contact data`);
    assert.match(html, /https:\/\/wa\.me\/2348035751154/, `${file}: WhatsApp channel missing`);
    assert.match(html, /tel:\+2348035751154/, `${file}: telephone channel missing`);
    assert.match(html, /mailto:contact@drolaosebikan\.com/, `${file}: email channel missing`);
    assert.doesNotMatch(html, /href="\/appointment-privacy"/, `${file}: draft Web3Forms policy should not be promoted`);
  }
  console.log("Contact-only export verified: both pages show channels without patient intake forms.");
}
