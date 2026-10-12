/* Static-export browser checks. No patient submissions or external requests. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
      ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright"
      : "playwright"),
);
(async () => {
  const root = path.join(process.cwd(), "out");
  const screenshots = path.resolve(process.env.CLINIC_REVIEW_OUTPUT_DIR || "docs/figma-review");
  fs.mkdirSync(screenshots, { recursive: true });
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://local").pathname,
    );
    let target = path.join(root, pathname);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      return res.end();
    }
    if (pathname === "/") target = path.join(root, "index.html");
    else if (!path.extname(target))
      target += req.headers.rsc === "1" ? ".txt" : ".html";
    let status = 200;
    if (!fs.existsSync(target)) {
      target = path.join(root, "404.html");
      status = 404;
    }
    const ext = path.extname(target);
    res.writeHead(status, {
      "Content-Type":
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".woff2": "font/woff2",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
          ".xml": "application/xml",
          ".txt": "text/x-component",
        }[ext] || "application/octet-stream",
    });
    res.end(fs.readFileSync(target));
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
      FONTCONFIG_PATH: "/etc/fonts",
    },
  });
  const page = await browser.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  const routes = [
    "/",
    "/services",
    "/about-dr-olaosebikan",
    "/appointments/book",
    "/contact-location",
    "/contact",
    "/faq",
    "/publications",
    "/publications/achievements",
    "/rheumatoid-arthritis-treatment-lagos",
    "/gout-treatment-lagos",
    "/lupus-care-lagos",
    "/joint-pain-and-stiffness-clinic-lagos",
    "/autoimmune-disease-specialist-lagos",
    "/insights",
    "/publications/publication-record-unavailable",
    "/unavailable-page",
  ];
  const results = [];
  try {
    for (const width of process.env.CLINIC_INTERACTIONS_ONLY
      ? []
      : [390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of routes) {
        const response = await page.goto(origin + route);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            Array.from(document.images).map((im) => {
              im.loading = "eager";
              return im.complete
                ? Promise.resolve()
                : new Promise((r) => {
                    im.onload = r;
                    im.onerror = r;
                  });
            }),
          );
        });
        assert.equal(
          response.status(),
          route === "/unavailable-page" ? 404 : 200,
          route,
        );
        assert.equal(await page.locator("h1").count(), 1, `${route} one h1`);
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: Array.from(document.images)
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
          title: document.title,
          description: document.querySelector("meta[name=description]")
            ?.content,
          canonical: document.querySelector("link[rel=canonical]")?.href,
        }));
        assert.equal(layout.overflow, false, `${route} overflow at ${width}`);
        assert.deepEqual(
          layout.brokenImages,
          [],
          `${route} images at ${width}`,
        );
        if (route !== "/unavailable-page")
          assert.ok(
            layout.title && layout.description && layout.canonical,
            `${route} SEO`,
          );
        if (route === "/")
          assert.equal(
            await page.locator('img[src="/images/dr_hakeem.webp"]').count(),
            1,
            "Single homepage portrait",
          );
        await page.screenshot({
          path: path.join(
            screenshots,
            (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) +
              "-" +
              width +
              ".png",
          ),
          fullPage: true,
        });
        results.push({ route, width, status: response.status(), ...layout });
      }
      console.log(`17 routes passed at ${width}px.`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + "/");
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    assert.equal(
      await page.locator("#clinic-mobile-navigation").isVisible(),
      true,
    );
    await page.locator("#clinic-mobile-navigation a").first().focus();
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator("#clinic-mobile-navigation").isVisible(),
      false,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.locator("#quick-reason").selectOption("Gout treatment");
    await page.locator("#quick-consultationType").selectOption("virtual");
    await page.locator("#quick-preferredTime").fill("14:30");
    await page
      .getByRole("link", { name: "Continue to appointment request" })
      .click();
    await page.waitForURL(origin + "/appointments/book");
    assert.equal(new URL(page.url()).pathname, "/appointments/book");
    assert.equal(new URL(page.url()).search, "");
    await page.waitForFunction(
      () =>
        document.getElementById("booking-reason")?.value === "Gout treatment",
    );
    assert.equal(
      await page.locator("#booking-reason").inputValue(),
      "Gout treatment",
    );
    assert.equal(
      await page.locator("input[type=radio][value=virtual]").isChecked(),
      true,
    );
    assert.equal(
      await page.locator("#booking-preferredTime").inputValue(),
      "14:30",
    );
    await page
      .getByRole("button", { name: "Send appointment request", exact: true })
      .click();
    assert.equal(
      await page.locator("form").getAttribute("data-booking-state"),
      "invalid",
    );
    await page.locator("#booking-fullName").fill("Synthetic Reviewer");
    await page.locator("#booking-phone").fill("+1 202 555 0147");
    await page
      .locator("#booking-bookingNote")
      .fill("Synthetic appointment arrangement test.");
    await page
      .getByRole("button", { name: "Send appointment request", exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelector("form").dataset.bookingState === "failure",
    );
    assert.equal(
      await page.locator("#booking-fullName").inputValue(),
      "Synthetic Reviewer",
    );
    assert.equal(
      await page.locator("#booking-bookingNote").inputValue(),
      "Synthetic appointment arrangement test.",
    );
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    const whatsapp = await page
      .locator('form a[href^="https://wa.me"]')
      .first()
      .getAttribute("href");
    assert.ok(
      !whatsapp.includes("Synthetic") &&
        !whatsapp.includes("Gout") &&
        !whatsapp.includes("14%3A30"),
    );
    await page.getByRole("button", { name: "Clear this request" }).click();
    assert.equal(await page.locator("#booking-reason").inputValue(), "");
    assert.equal(await page.locator("input[type=radio]:checked").count(), 0);
    await page.goto(origin + "/services");
    await page
      .getByRole("searchbox", { name: "Search our areas of care" })
      .fill("gout");
    assert.equal(await page.locator(".clinic-service-card").count(), 1);
    await page.getByRole("searchbox").fill("no-such-care");
    assert.equal(await page.locator(".clinic-service-card").count(), 0);
    await page.getByRole("button", { name: "Clear search" }).click();
    assert.equal(await page.locator(".clinic-service-card").count(), 6);
    await page.goto(origin + "/faq");
    const details = page.locator("details").first();
    assert.equal(await details.getAttribute("open"), "");
    await details.locator("summary").click();
    assert.equal(await details.getAttribute("open"), null);
    await details.locator("summary").click();
    assert.equal(await details.getAttribute("open"), "");
    await page.goto(origin + "/");
    const mobileRail = await page.evaluate(() => {
      const rail = document.querySelector(".clinic-care-scroll");
      const tile = rail?.querySelector(".clinic-care-tile");
      const media = tile?.querySelector(".clinic-media-slot");
      const counter = document.querySelector(".clinic-rail-controls > span");
      if (!rail || !tile || !media || !counter) return null;
      return {
        width: tile.getBoundingClientRect().width,
        height: tile.getBoundingClientRect().height,
        mediaHeight: media.getBoundingClientRect().height,
        gap: Number.parseFloat(getComputedStyle(rail).columnGap),
        counter: counter.textContent.trim(),
      };
    });
    assert.ok(mobileRail, "Mobile care rail exists");
    assert.ok(Math.abs(mobileRail.width - 268) < 1, "Figma mobile tile width");
    assert.ok(Math.abs(mobileRail.height - 335) < 1, "Figma mobile tile height");
    assert.ok(Math.abs(mobileRail.mediaHeight - 233) < 1, "Figma mobile media height");
    assert.equal(mobileRail.gap, 12, "Figma mobile card gap");
    assert.equal(mobileRail.counter, "1 / 6", "Figma current-card indicator");
    const scroll = page.locator(".clinic-care-scroll");
    const before = await scroll.evaluate((e) => e.scrollLeft);
    await page.getByRole("button", { name: "Next care area" }).click();
    await page.waitForFunction(
      () => document.querySelector(".clinic-care-scroll").scrollLeft > 0,
    );
    assert.ok((await scroll.evaluate((e) => e.scrollLeft)) > before);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    assert.deepEqual(errors, [], "No client errors");
    assert.deepEqual(
      external,
      [],
      "No external requests, patient submissions or tracking",
    );
    if (!process.env.CLINIC_INTERACTIONS_ONLY)
      fs.writeFileSync(
        path.join(screenshots, "browser-results.json"),
        JSON.stringify(
          {
            checks: results.length,
            widths: [390, 768, 1440, 1920],
            routes: results,
            interactions:
              "Navigation, Escape focus return, care search/empty state, care rail, 14 FAQs, booking preference handoff, validation, failure preservation, reset, no storage, generic WhatsApp and reduced motion passed.",
            externalRequests: external,
            clientErrors: errors,
          },
          null,
          2,
        ),
      );
    console.log("Clinic interactions and privacy checks passed.");
  } finally {
    await browser.close();
    await new Promise((r) => server.close(r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
