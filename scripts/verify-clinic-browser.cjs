/* Static-export browser checks. No patient submissions or external requests. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const contactOnly = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "config/clinic-release.json"), "utf8"),
).booking.enabled !== true;
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
            Array.from(document.images).map(async (im) => {
              im.loading = "eager";
              await (im.complete
                ? Promise.resolve()
                : new Promise((r) => {
                    im.onload = r;
                    im.onerror = r;
                  }));
              await im.decode().catch(() => {});
            }),
          );
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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
        if (route === "/") {
          const geometry = await page.locator(".clinic-care-scroll").evaluate((el) => {
            const card = el.firstElementChild;
            return { width: card.getBoundingClientRect().width, height: card.getBoundingClientRect().height, image: card.querySelector(".clinic-media-slot").getBoundingClientRect().height, gap: parseFloat(getComputedStyle(el).columnGap) };
          });
          assert.equal(geometry.width, width <= 1100 ? 268 : 295, `Care card width at ${width}`);
          assert.equal(geometry.image, width <= 1100 ? 233 : 226.75, `Care image height at ${width}`);
          assert.equal(geometry.height, width <= 1100 ? 335 : 368.75, `Care card height at ${width}`);
          assert.equal(geometry.gap, width <= 1100 ? 12 : 30, `Care gap at ${width}`);
          if (contactOnly) {
            assert.equal(await page.locator('[data-booking-mode="contact-only"]').count(), 1, "Contact-only homepage panel");
            assert.equal(await page.locator("#quick-reason").count(), 0, "No inactive homepage intake");
          } else {
            const preferences = await page.locator('[class*="quickForm"] [class*="fields"]').evaluate((el) => new Set(Array.from(el.children, (child) => Math.round(child.getBoundingClientRect().left))).size);
            assert.equal(preferences, width <= 1100 ? 1 : 4, `Native quick preference columns at ${width}`);
          }
          await page.waitForFunction((expected) => document.querySelector(".clinic-rail-controls > span").textContent.replace(/\s+/g, " ").trim() === expected, width === 390 ? "1 / 6" : width === 768 ? "1–2 / 6" : "1–4 / 6");
          assert.equal(
            await page.locator('img[src="/images/dr_hakeem.webp"]').count(),
            1,
            "Single homepage portrait",
          );
        }
        if (route === "/publications" || route === "/publications/achievements") {
          const columns = await page.locator(".clinic-resource-layout").evaluate((el) => new Set(Array.from(el.children, (child) => Math.round(child.getBoundingClientRect().left))).size);
          assert.equal(columns, width <= 1100 ? 1 : 2, `Resource columns at ${width}`);
        }
        if (route === "/insights") {
          assert.equal(await page.locator("#awaiting-title").count(), 1, "Truthful awaiting-content feature");
          assert.equal(await page.getByText("No articles, videos or clinic news have been published here yet.", { exact: true }).count(), 1, "Existing empty state preserved");
          const titleRows = await page.locator("h1 > span").evaluateAll((els) => new Set(els.map((el) => Math.round(el.getBoundingClientRect().top))).size);
          assert.equal(titleRows, width === 390 ? 2 : 1, `Editorial heading rows at ${width}`);
        }
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
    if (contactOnly) {
      assert.equal(await page.locator('[data-booking-mode="contact-only"]').count(), 1);
      assert.equal(await page.locator("#quick-reason").count(), 0);
      await page.goto(origin + "/appointments/book");
      assert.equal(await page.locator('[data-booking-mode="contact-only"]').count(), 1);
      assert.equal(await page.locator("form").count(), 0, "No patient form in contact-only mode");
      assert.equal(await page.locator("#booking-fullName").count(), 0);
      assert.equal(await page.locator('a[href^="https://wa.me/2348035751154"]').count() > 0, true);
      assert.equal(await page.locator('a[href="tel:+2348035751154"]').count() > 0, true);
      assert.equal(await page.locator('a[href="mailto:contact@drolaosebikan.com"]').count() > 0, true);
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } else {
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
    }
    await page.goto(origin + "/services");
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    assert.equal(await page.locator('#clinic-mobile-navigation a[aria-current="page"]').textContent(), "Our care");
    await page.keyboard.press("Escape");
    const discussion = page.locator(".clinic-services-discussion details");
    await discussion.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await discussion.getAttribute("open"), null);
    assert.equal(await page.locator(".clinic-services-identity img").isVisible(), true);
    await page.keyboard.press("Enter");
    assert.equal(await discussion.getAttribute("open"), "");
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
    await page.emulateMedia({ reducedMotion: "reduce" });
    const scroll = page.locator(".clinic-care-scroll");
    const step = await scroll.evaluate((e) => e.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(e).columnGap));
    const before = await scroll.evaluate((e) => e.scrollLeft);
    await page.getByRole("button", { name: "Next care area" }).click();
    await page.waitForFunction(
      () => document.querySelector(".clinic-care-scroll").scrollLeft > 0,
    );
    assert.ok(Math.abs((await scroll.evaluate((e) => e.scrollLeft)) - before - step) <= 2, "Care control advances one card plus its actual CSS gap");
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
