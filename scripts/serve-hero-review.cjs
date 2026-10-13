/* Local-only media review. Nothing is copied to public/out or uploaded. */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
function createReviewServer(files = {}, root = path.resolve("out")) {
  return http.createServer((req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); return res.end(); }
    const url = new URL(req.url, "http://127.0.0.1");
    let target;
    try {
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.startsWith("/__clinic-review-media/")) target = files[pathname];
      else {
        target = path.resolve(root, "." + pathname);
        if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); return res.end(); }
        if (pathname === "/") target = path.join(root, "index.html");
        else if (!path.extname(target)) target += req.headers.rsc === "1" ? ".txt" : ".html";
      }
      if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404); return res.end(); }
      const size = fs.statSync(target).size;
      const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".txt": "text/x-component", ".mp4": "video/mp4", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" }[path.extname(target)] || "application/octet-stream";
      const headers = { "Content-Type": mime, "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Accept-Ranges": "bytes" };
      let start = 0, end = size - 1, status = 200;
      if (req.headers.range) {
        const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
        if (!match || Number(match[1]) >= size) { res.writeHead(416, { "Content-Range": `bytes */${size}` }); return res.end(); }
        start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end;
        if (end < start) { res.writeHead(416); return res.end(); }
        status = 206; headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      }
      res.writeHead(status, { ...headers, "Content-Length": end - start + 1 });
      if (req.method === "HEAD") return res.end();
      fs.createReadStream(target, { start, end }).pipe(res);
    } catch { if (!res.headersSent) res.writeHead(400); res.end(); }
  });
}
module.exports = { createReviewServer };
if (require.main === module) {
  const [home, services] = process.argv.slice(2);
  if (!home || !services) throw new Error("Usage: node scripts/serve-hero-review.cjs <home MP4> <services MP4>");
  for (const file of [home, services]) if (!path.isAbsolute(file) || !fs.statSync(file).isFile()) throw new Error("Use explicit absolute media file paths");
  createReviewServer({ "/__clinic-review-media/home.mp4": home, "/__clinic-review-media/services.mp4": services }).listen(4178, "127.0.0.1", () => console.log("Local review: http://127.0.0.1:4178/?heroVideoReview=1 (also /services?heroVideoReview=1)"));
}
