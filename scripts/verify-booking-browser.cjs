/* Local synthetic state harness; never bundled into the public application. */
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os"),
  http = require("node:http"),
  assert = require("node:assert/strict");
const root = process.cwd();
const esbuild = require(process.env.ESBUILD_MODULE || "esbuild");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright",
);
(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "clinic-booking-review-"));
  await esbuild.build({
    stdin: {
      contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {AppointmentForm} from './src/components/AppointmentForm'; import {AppointmentDraftProvider,useAppointmentDraft} from './src/components/booking/AppointmentDraftProvider';
 const transport=async()=>{window.mockCalls++; return window.mockMode==='deferred'? new Promise(r=>window.mockResolve=r):{kind:window.mockMode};};
 function Fixture(){const {resetDraft}=useAppointmentDraft();return <><button onClick={resetDraft}>Discard draft during delivery</button><AppointmentForm transport={transport} timeoutMs={window.mockTimeout??1000} now={()=>new Date('2026-10-11T10:00:00Z')}/></>};createRoot(document.getElementById('root')).render(<AppointmentDraftProvider><Fixture/></AppointmentDraftProvider>);`,
      resolveDir: root,
      loader: "tsx",
    },
    outfile: temp + "/app.js",
    bundle: true,
    jsx: "automatic",
    alias: { "@": root + "/src" },
    nodePaths: [root + "/node_modules"],
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.NEXT_PUBLIC_CLINIC_PRIVACY_NOTICE_PATH": '""',
    },
  });
  fs.writeFileSync(
    temp + "/index.html",
    '<!DOCTYPE html><html><head><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>',
  );
  const server = http.createServer((q, r) => {
    const file = path.join(temp, q.url === "/" ? "index.html" : q.url);
    r.setHeader(
      "Content-Type",
      q.url.endsWith(".js")
        ? "application/javascript"
        : q.url.endsWith(".css")
          ? "text/css"
          : "text/html",
    );
    r.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: process.env.CHROMIUM_LIBRARY_PATH,
      FONTCONFIG_PATH: "/etc/fonts",
    },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (r) =>
    new URL(r.request().url()).origin === origin ? r.continue() : r.abort(),
  );
  async function init(kind, timeout = 1000) {
    await page.addInitScript(
      ({ kind, timeout }) => {
        window.mockMode = kind;
        window.mockTimeout = timeout;
        window.mockCalls = 0;
      },
      { kind, timeout },
    );
    await page.goto(origin);
    await page.locator("#booking-fullName").fill("Synthetic Reviewer");
    await page.locator("#booking-phone").fill("+12025550147");
    await page.locator("input[value=virtual]").check();
  }
  const submit = () =>
    page
      .getByRole("button", { name: "Send appointment request", exact: true })
      .click();
  try {
    await init("acknowledged");
    await submit();
    await page
      .getByRole("status")
      .filter({ hasText: "Request submitted." })
      .waitFor();
    assert.equal(await page.locator("#booking-fullName").inputValue(), "");
    assert.equal(await page.locator("input[value=virtual]").isChecked(), false);
    assert.equal(await page.evaluate(() => window.mockCalls), 1);
    await init("definite-failure");
    await submit();
    await page
      .getByRole("status")
      .filter({ hasText: "We could not submit" })
      .waitFor();
    assert.equal(
      await page.locator("#booking-fullName").inputValue(),
      "Synthetic Reviewer",
    );
    await page
      .getByRole("button", { name: "Try request again", exact: true })
      .click();
    assert.equal(await page.evaluate(() => window.mockCalls), 2);
    await init("uncertain");
    await submit();
    await page
      .getByRole("status")
      .filter({ hasText: "could not verify" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Send appointment request", exact: true })
        .isDisabled(),
      true,
    );
    assert.equal(
      await page.locator("#booking-fullName").inputValue(),
      "Synthetic Reviewer",
    );
    await init("deferred", 3000);
    await submit();
    await page.locator("form").evaluate((f) => {
      f.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      f.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    assert.equal(await page.evaluate(() => window.mockCalls), 1);
    await page
      .getByRole("button", { name: "Discard draft during delivery" })
      .click();
    await page.locator("#booking-fullName").fill("New Synthetic Draft");
    await page.evaluate(() => window.mockResolve({ kind: "acknowledged" }));
    await page.waitForTimeout(30);
    assert.equal(
      await page.locator("#booking-fullName").inputValue(),
      "New Synthetic Draft",
    );
    assert.equal(
      await page
        .getByRole("status")
        .filter({ hasText: "Request submitted." })
        .count(),
      0,
    );
    await init("deferred", 60);
    await submit();
    await page
      .getByRole("status")
      .filter({ hasText: "could not verify" })
      .waitFor();
    await page.evaluate(() => window.mockResolve({ kind: "acknowledged" }));
    await page.waitForTimeout(30);
    assert.equal(
      await page.locator("#booking-fullName").inputValue(),
      "Synthetic Reviewer",
    );
    assert.equal(await page.evaluate(() => window.mockCalls), 1);
    assert.deepEqual(errors, []);
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    fs.writeFileSync(
      path.resolve(process.env.CLINIC_REVIEW_OUTPUT_DIR || "docs/figma-review", "booking-state-results.json"),
      JSON.stringify(
        {
          method:
            "Local React harness; injected synthetic transports, no provider calls; not proof of real recipient delivery",
          passed: [
            "Acknowledged success clears all fields/type",
            "Definite failure preserves values and permits deliberate retry",
            "Uncertain outcome preserves values and blocks automatic retry",
            "Duplicate submit lock",
            "Reset during delivery invalidates stale acknowledgement",
            "Timeout stays uncertain after late acknowledgement",
            "No browser storage",
            "No client errors",
          ],
        },
        null,
        2,
      ),
    );
    console.log(
      "Booking acknowledgement, failure, uncertainty, duplicate, reset and timeout browser checks passed.",
    );
  } finally {
    await browser.close();
    await new Promise((r) => server.close(r));
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
