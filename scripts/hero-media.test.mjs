import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { heroMedia, heroVideoSource, heroRoutes } from "../src/lib/hero-media.ts";
test("hero mapping preserves real posters and fails closed on every remote host", () => {
  for (const media of Object.values(heroMedia)) {
    if (media.approvedSource) {
      assert.equal(media.rightsApproved, true);
      assert.ok(fs.existsSync("public" + media.approvedSource));
      if (media.approvedMobileSource) assert.ok(fs.existsSync("public" + media.approvedMobileSource));
      if (media.approvedPoster) assert.ok(fs.existsSync("public" + media.approvedPoster));
    } else assert.equal(media.rightsApproved, false);
    assert.equal(media.fallback, "existing");
    if (media.poster) assert.ok(fs.existsSync("public" + media.poster));
    else if (media.approvedPoster) assert.ok(fs.existsSync("public" + media.approvedPoster));
    else assert.ok(media.missing);
    for (const host of ["clinic.example", "preview.pages.dev", "localhost.evil.test"]) assert.equal(heroVideoSource(media, host, "?heroVideoReview=1", 1440, false), undefined);
    assert.equal(heroVideoSource(media, "localhost", "", 1440, false), undefined);
  }
});
test("explicit loopback review maps only the two matched real clips", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
    assert.equal(heroVideoSource(heroMedia.home, host, "?heroVideoReview=1"), "/__clinic-review-media/home.mp4");
    assert.equal(heroVideoSource(heroMedia.services, host, "?heroVideoReview=1"), "/__clinic-review-media/services.mp4");
    assert.equal(heroVideoSource(heroMedia.specialist, host, "?heroVideoReview=1"), undefined);
  }
});
test("an approved source still requires explicit rights approval", () => {
  const candidate = { fallback: "existing", approvedSource: "/media/approved.mp4", rightsApproved: false };
  assert.equal(heroVideoSource(candidate, "clinic.example", ""), undefined);
  assert.equal(heroVideoSource({ ...candidate, rightsApproved: true }, "clinic.example", "", 1440, true), candidate.approvedSource);
});

test("every major hero route has a specific ready-or-missing media record", () => {
  assert.equal(Object.keys(heroRoutes).length, 14);
  for (const variant of Object.values(heroRoutes)) assert.ok(heroMedia[variant]);
});
test("mobile selection uses the smaller clip without changing release rights", () => {
  assert.equal(heroVideoSource(heroMedia.home, "localhost", "?heroVideoReview=1", 390), "/__clinic-review-media/home-mobile.mp4");
  assert.equal(heroVideoSource(heroMedia.services, "localhost", "?heroVideoReview=1", 390), "/__clinic-review-media/services-mobile.mp4");
  assert.equal(heroVideoSource(heroMedia.home, "localhost", "?heroVideoReview=1", 768), "/__clinic-review-media/home.mp4");
  assert.equal(heroVideoSource(heroMedia.home, "preview.pages.dev", "?heroVideoReview=1", 390), undefined);
});

test("knee assessment keeps loopback review and production remains still", () => {
  const knee = heroMedia["clinical:joint-pain-and-stiffness-clinic-lagos"];
  assert.equal(knee.rightsApproved, true);
  assert.equal(knee.poster, undefined);
  assert.equal(knee.reviewPoster, "/__clinic-review-media/joint-pain-poster.webp");
  assert.equal(heroVideoSource(knee, "127.0.0.1", "?heroVideoReview=1", 390), "/__clinic-review-media/joint-pain-mobile.mp4");
  assert.equal(heroVideoSource(knee, "localhost", "?heroVideoReview=1", 1440), "/__clinic-review-media/joint-pain.mp4");
  for (const host of ["preview.pages.dev", "drolaosebikan.com", "localhost.evil.test"]) {
    assert.equal(heroVideoSource(knee, host, "?heroVideoReview=1", 1440, false), undefined);
  }
  assert.equal(heroVideoSource(knee, "localhost", ""), undefined);
});

test("explicit preview retains nine matched videos and condition-appropriate still fallbacks", () => {
  const expected = {
    home: "home", services: "services", appointments: "appointments", contact: "contact",
    faq: "faq", insights: "insights", publications: "publications", achievements: "achievements",
    "clinical:joint-pain-and-stiffness-clinic-lagos": "joint-pain",
  };
  for (const [variant, stem] of Object.entries(expected)) {
    const media = heroMedia[variant];
    assert.equal(heroVideoSource(media, "example-preview.pages.dev", "", 390, true), `/video/clinic/${stem}-mobile.mp4`);
    assert.equal(heroVideoSource(media, "example-preview.pages.dev", "", 1440, true), `/video/clinic/${stem}-desktop.mp4`);
    assert.equal(heroVideoSource(media, "drolaosebikan.com", "", 1440, false), undefined);
  }
  // The Figma Specialist page is deliberately paper-coloured, not a reused
  // neck-pain video. Condition pages retain condition-related still posters.
  const specialist = heroMedia[heroRoutes["/about-dr-olaosebikan"]];
  assert.equal(specialist.approvedSource, undefined);
  assert.equal(specialist.poster, undefined);
  assert.equal(heroVideoSource(specialist, "example-preview.pages.dev", "", 1440, true), undefined);
  const conditionPosters = {
    "/rheumatoid-arthritis-treatment-lagos": "/images/figma/arthritis.webp",
    "/gout-treatment-lagos": "/images/figma/gout.webp",
    "/lupus-care-lagos": "/images/figma/autoimmune.webp",
    "/autoimmune-disease-specialist-lagos": "/images/figma/autoimmune.webp",
  };
  for (const [route, poster] of Object.entries(conditionPosters)) {
    const media = heroMedia[heroRoutes[route]];
    assert.equal(media.poster, poster);
    assert.ok(fs.existsSync("public" + poster));
    assert.equal(media.approvedSource, undefined);
    assert.equal(media.rightsApproved, false);
    assert.equal(heroVideoSource(media, "example-preview.pages.dev", "", 390, true), undefined);
    assert.equal(heroVideoSource(media, "example-preview.pages.dev", "", 1440, true), undefined);
  }

});
