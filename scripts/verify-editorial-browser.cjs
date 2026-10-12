/* Runs only during synthetic export verification; restores real data in the calling script. */
const fs = require("node:fs"),
  http = require("node:http"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright",
);
(async () => {
  const root = path.join(process.cwd(), "out");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://local").pathname);
    let file = path.join(root, pathname);
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      return res.end();
    }
    if (!path.extname(file)) file += req.headers.rsc === "1" ? ".txt" : ".html";
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".txt": "text/x-component",
        ".js": "application/javascript",
        ".css": "text/css",
        ".woff2": "font/woff2",
        ".jpg": "image/jpeg",
        ".webp": "image/webp",
        ".png": "image/png",
      }[path.extname(file)] || "application/octet-stream",
    );
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      ...(process.env.CHROMIUM_EXECUTABLE
        ? [
            "--single-process",
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
          ]
        : []),
    ],
    env: {
      ...process.env,
      ...(process.env.CHROMIUM_LIBRARY_PATH
        ? { LD_LIBRARY_PATH: process.env.CHROMIUM_LIBRARY_PATH }
        : {}),
    },
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => { errors.push(e.message); console.error("Client error:", e.message); });
    page.on("requestfailed", r => console.error("Request failed:", new URL(r.url()).pathname, r.failure()?.errorText));
    await page.route("**/*", (route) => {
      const u = route.request().url();
      if (new URL(u).origin === origin) return route.continue();
      if (u.startsWith("https://cdn.sanity.io/images/"))
        return route.fulfill({
          contentType: "image/jpeg",
          body: fs.readFileSync("public/images/clinic-symbol.jpg"),
        });
      if (u.startsWith("https://www.youtube-nocookie.com/"))
        return route.fulfill({
          contentType: "text/html",
          body: "<p>Synthetic video player</p>",
        });
      return route.abort();
    });
    let checks = 0;
    for (const width of [390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of [
        "/insights",
        "/insights/articles",
        "/insights/videos",
        "/insights/news",
        "/insights/topics/rheumatology-care",
        "/insights/topics/clinic-news",
        "/insights/articles/synthetic-article-test",
        "/insights/videos/synthetic-video-test",
        "/insights/news/synthetic-news-test",
        "/publications/synthetic-research-test",
      ]) {
        const res = await page.goto(origin + route);
        assert.equal(res.status(), 200, route);
        await page.evaluate(() => document.fonts.ready);
        await page.locator("h1").waitFor({ state: "visible", timeout: 10000 });
        assert.equal(await page.locator("h1").count(), 1, route);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${route} overflow at ${width}`,
        );
        checks++;
        if (route.includes("synthetic-video")) {
          assert.equal(await page.locator("iframe").count(), 0);
          await page
            .getByRole("button", { name: "Load video", exact: true })
            .click();
          await page.locator("iframe").waitFor();
          assert.equal(await page.locator("iframe").count(), 1);
          assert.equal(
            await page.locator("iframe").getAttribute("src"),
            "https://www.youtube-nocookie.com/embed/abcdefghijk",
          );
          await page.locator("#transcript-heading").waitFor();
        }
      }
      await page.goto(origin + "/insights");
      await page.locator("#insights-search").waitFor();
      assert.equal(await page.locator("#insights-results article").count(), 3);
      await page
        .getByLabel("Search resources", { exact: true })
        .fill("Synthetic video");
      await page
        .getByRole("status")
        .filter({ hasText: "1 resource found." })
        .waitFor();
      await page.waitForFunction(
        () =>
          document.querySelectorAll("#insights-results article").length === 1,
      );
      assert.equal(await page.locator("#insights-results article").count(), 1);
      await page.getByLabel("Search resources", { exact: true }).fill("");
      await page
        .getByLabel("Topic", { exact: true })
        .selectOption("Clinic News");
      await page.waitForFunction(
        () =>
          document.querySelectorAll("#insights-results article").length === 1,
      );
      assert.equal(await page.locator("#insights-results article").count(), 1);
      await page.getByLabel("Topic", { exact: true }).selectOption("");
      await page.getByLabel("Tag", { exact: true }).selectOption("Demo");
      await page.waitForFunction(
        () =>
          document.querySelectorAll("#insights-results article").length === 2,
      );
      assert.equal(await page.locator("#insights-results article").count(), 2);
      await page.getByLabel("Format", { exact: true }).selectOption("news");
      await page.waitForFunction(
        () =>
          document.querySelectorAll("#insights-results article").length === 0,
      );
      assert.equal(await page.locator("#insights-results article").count(), 0);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.equal(await page.locator("#insights-results article").count(), 3);
      console.log(
        "10 populated editorial routes and filters passed at " + width + "px.",
      );
    }
    assert.deepEqual(errors, []);
    const outputDirectory = process.env.CLINIC_REVIEW_OUTPUT_DIR || "docs/figma-review";
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(outputDirectory, "editorial-browser-results.json"),
      JSON.stringify(
        {
          checks,
          widths: [390, 768, 1440, 1920],
          passed: [
            "Published article/video/news/research templates",
            "Three format archives",
            "Two topic archives",
            "Search, topic, tag and format filters, no-results and clear",
            "Privacy-enhanced video click to load and transcript",
            "No horizontal overflow, one h1, no client errors",
          ],
          limits:
            "Synthetic approved fixtures; thumbnail and player mocked. No live CMS connection or publish/deploy pipeline verified.",
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
    await new Promise((r) => server.close(r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
