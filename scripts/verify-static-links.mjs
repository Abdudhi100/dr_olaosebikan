/**
 * Validate actual exported navigation rather than assuming Next.js <Link> destinations exist.
 * Runs after next build; no network calls, browser, patient data or third-party packages.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const exportDir = path.resolve("out");
if (!existsSync(path.join(exportDir, "index.html"))) {
  throw new Error("Static export is missing: run npm run build first.");
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filepath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? htmlFiles(filepath)
      : entry.isFile() && entry.name.endsWith(".html")
        ? [filepath]
        : [];
  });
}
function decodeAttribute(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'");
}
function normalizeHref(href, page) {
  try {
    const pageRoute = path.relative(exportDir, page).replaceAll(path.sep, "/");
    const relativePath = pageRoute === "index.html"
      ? "/"
      : "/" + pageRoute.replace(/\.html$/, "");
    const target = new URL(decodeAttribute(href), "https://clinic.invalid" + relativePath);
    return target.hostname === "clinic.invalid" ? target : null;
  } catch {
    return null;
  }
}
function exportedTarget(route) {
  let decoded;
  try {
    decoded = decodeURIComponent(route);
  } catch {
    return null;
  }
  if (decoded.includes("\0") || decoded.split("/").includes("..")) return null;
  const rel = decoded.replace(/^\/+/, "");
  if (!rel) return path.join(exportDir, "index.html");
  const exact = path.join(exportDir, rel);
  if (existsSync(exact)) {
    try {
      if (readdirSync(exact, { withFileTypes: true }).length >= 0) {
        const nested = path.join(exact, "index.html");
        if (existsSync(nested)) return nested;
      }
    } catch {
      return exact; // An existing asset file, not an HTML directory.
    }
  }
  if (existsSync(exact + ".html")) return exact + ".html";
  return null;
}
function containsId(file, fragment) {
  if (!fragment || !file.endsWith(".html")) return true;
  if (fragment.startsWith(":~:text=")) return true;
  let id;
  try {
    id = decodeURIComponent(fragment);
  } catch {
    return false;
  }
  const html = readFileSync(file, "utf8");
  const rx = /\bid=["']([^"']+)["']/g;
  for (const match of html.matchAll(rx)) if (match[1] === id) return true;
  return false;
}

const errors = new Map();
let anchors = 0;
let checked = 0;
const files = htmlFiles(exportDir);
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const relative = path.relative(exportDir, file).replaceAll(path.sep, "/");
  for (const match of html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)) {
    anchors++;
    const href = match[2];
    if (!href || /^(?:mailto:|tel:|sms:|javascript:|data:)/i.test(href)) continue;
    const target = normalizeHref(href, file);
    if (!target) continue; // External links are not part of the static export.
    checked++;
    const destination = exportedTarget(target.pathname);
    const reason = !destination
      ? "missing exported route or file"
      : !containsId(destination, target.hash.slice(1))
        ? "missing destination anchor"
        : null;
    if (reason) {
      const key = target.pathname + target.hash + " — " + reason;
      if (!errors.has(key)) errors.set(key, []);
      const pages = errors.get(key);
      if (pages.length < 5) pages.push(relative + " (href=" + href + ")");
    }
  }
}
if (errors.size) {
  console.error("Broken internal navigation in static export:");
  for (const [target, refs] of errors) {
    console.error(" • " + target + ": " + refs.join(", "));
  }
  process.exitCode = 1;
} else {
  console.log("Static link audit passed: " + files.length + " HTML pages; "
    + anchors + " anchor elements; " + checked + " local links resolved.");
}
