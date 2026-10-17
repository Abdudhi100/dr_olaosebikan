/* Render the existing clinic identity into a static social-preview image. */
const fs = require("node:fs");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright",
);
(async () => {
  const font = fs
    .readFileSync(
      "node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2",
    )
    .toString("base64");
  const logo = fs
    .readFileSync("public/images/clinic-symbol.jpg")
    .toString("base64");
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
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!DOCTYPE html><html><head><style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font});font-weight:300}*{box-sizing:border-box}body{margin:0;background:#002a30;color:#f8f7f2;font-family:Inter,sans-serif;font-weight:300;width:1200px;height:630px;padding:56px 64px}.brand{display:flex;align-items:center;gap:24px;font-size:25px;line-height:1.45}.brand img{width:100px;height:100px}h1{font-size:78px;line-height:1.12;letter-spacing:-2px;margin:62px 0 28px}p{font-size:26px;color:#d6e1dc;margin:0}.base{position:absolute;bottom:0;left:0;width:100%;height:24px;background:#d6e1dc}</style></head><body><div class=brand><img src="data:image/jpeg;base64,${logo}" alt=""><div>Pain, Arthritis, Autoimmune<br>&amp; Rheumatology Clinic</div></div><h1>Specialist<br>rheumatology care.</h1><p>Dr Hakeem Olaosebikan · Lagos</p><div class=base></div></body></html>`,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: "public/images/og-clinic.png" });
    console.log("Generated 1200 × 630 clinic social-preview image.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
