import assert from "node:assert/strict";
import { readFile, access, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { prepareEditorial } from "./prepare-editorial.mjs";
import { entry, research, body } from "./fixtures/editorial.mjs";
const root = new URL("../", import.meta.url);
function build() {
  const clean = spawnSync(
    process.execPath,
    ["scripts/clean-static-export.mjs"],
    { cwd: root, stdio: "inherit" },
  );
  if (clean.status !== 0) throw new Error("Static export cleanup failed.");
  const result = spawnSync(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build"],
    {
      cwd: root,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: "inherit",
    },
  );
  if (result.status !== 0) throw new Error("Static export failed.");
}
const read = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), "utf8");
async function absent(path) {
  await assert.rejects(access(new URL(`../out/${path}`, import.meta.url)));
}
try {
  const docs = [
    await entry("article", {
      tags: ["Demo"],
      body: body(
        'Synthetic <script>alert("test")</script> text must render as escaped text.',
      ),
    }),
    await entry("video", { tags: ["Demo"] }),
    await entry("news", { tags: ["News"] }),
    research(),
  ];
  await prepareEditorial({
    env: {
      SANITY_CONTENT_MODE: "sanity",
      SANITY_PROJECT_ID: "example1",
      SANITY_DATASET: "production",
    },
    fetcher: async () => new Response(JSON.stringify({ result: docs })),
  });
  build();
  for (const [folder, kind, type] of [
    ["articles", "article", "Article"],
    ["videos", "video", "VideoObject"],
    ["news", "news", "NewsArticle"],
  ]) {
    const html = await read(`insights/${folder}/synthetic-${kind}-test.html`);
    assert.ok(html.includes(`Synthetic ${kind} export test`));
    assert.ok(html.includes("Synthetic test author"));
    assert.ok(html.includes(`"@type":"${type}"`));
    assert.ok(
      html.includes(
        `https://www.drolaosebikan.com/insights/${folder}/synthetic-${kind}-test`,
      ),
    );
    assert.ok(!html.includes("TEST-APPROVAL-1"));
    assert.ok(!html.includes("TEST-MEDIA-1"));
  }
  for (const path of [
    "insights/articles.html",
    "insights/videos.html",
    "insights/news.html",
    "insights/topics/rheumatology-care.html",
    "insights/topics/clinic-news.html",
  ])
    assert.ok((await read(path)).includes("Synthetic"));
  if (process.env.CLINIC_TEST_POPULATED_BROWSER === "1") {
    const browser = spawnSync(
      process.execPath,
      ["scripts/verify-editorial-browser.cjs"],
      { cwd: root, env: process.env, stdio: "inherit" },
    );
    if (browser.status !== 0)
      throw new Error("Populated editorial browser checks failed.");
  }
  const article = await read("insights/articles/synthetic-article-test.html");
  assert.ok(article.includes("&lt;script&gt;"));
  assert.ok(!article.includes('<script>alert("test")</script>'));
  const video = await read("insights/videos/synthetic-video-test.html");
  assert.ok(video.includes("Transcript"));
  assert.ok(video.includes("PT125S"));
  assert.ok(!video.includes("<iframe"));
  const paper = await read("publications/synthetic-research-test.html");
  assert.ok(paper.includes("Actual fixture author"));
  const sitemap = await read("sitemap.xml");
  assert.ok(sitemap.includes("/insights/articles/synthetic-article-test"));
  assert.ok(sitemap.includes("2020-01-03T09:00:00.000Z"));
  // Review builds remain noindex even when the synthetic collection is populated.
  assert.ok((await read("insights.html")).includes("noindex"));
  await writeFile(
    new URL("../out/stale-synthetic-page.html", import.meta.url),
    "<h1>Stale synthetic page</h1>",
  );
  console.log("Populated static export checks passed.");
} finally {
  // Always restore the real configured source. Synthetic content cannot remain in the final export.
  await prepareEditorial();
  build();
}
await absent("stale-synthetic-page.html");
await absent("insights/articles/synthetic-article-test.html");
await absent("insights/videos/synthetic-video-test.html");
await absent("insights/news/synthetic-news-test.html");
await absent("publications/synthetic-research-test.html");
assert.ok((await read("insights.html")).includes("noindex"));
assert.ok(!(await read("sitemap.xml")).includes("/insights"));
// Empty destinations remain discoverable; withdrawal still removes every content route above.
for (const href of ["/insights", "/publications", "/publications/achievements"]) {
  assert.ok((await read("index.html")).includes(`href="${href}"`));
}
console.log("Withdrawal, empty hub, navigation and sitemap checks passed.");

await absent("insights/articles.html");
await absent("insights/topics/rheumatology-care.html");
