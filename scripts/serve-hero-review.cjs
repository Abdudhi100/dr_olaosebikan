/* Local-only media review. Nothing is copied to public/out or uploaded. */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
function reviewGallery() {
  const routes = ["/", "/services", "/about-dr-olaosebikan", "/appointments/book", "/contact-location", "/faq", "/insights", "/publications", "/publications/achievements", "/joint-pain-and-stiffness-clinic-lagos", "/rheumatoid-arthritis-treatment-lagos", "/gout-treatment-lagos", "/lupus-care-lagos", "/autoimmune-disease-specialist-lagos"];
  const labels = ["Homepage", "Our Services", "Specialist profile", "Appointment booking", "Contact & Location", "FAQ", "Insights & Media", "Research & Publications", "Achievements & Recognitions", "Joint pain", "Rheumatoid arthritis", "Gout", "Lupus", "Autoimmune care"];
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Clinic local video review</title><style>body{font:16px system-ui;background:#f8f7f2;color:#002a30;margin:24px}button,select{font:inherit;padding:10px;margin:4px}iframe{height:850px;border:1px solid #567;flex-shrink:0;background:white}.frames{overflow:auto;display:flex;gap:20px}label{display:block}header{max-width:1000px}</style><header><h1>Clinic video review</h1><p>Local-only footage review. Usage rights remain pending. No form should be submitted. Other hero pages retain their existing background until matching footage and posters are approved.</p><label>Page <select id="route">${routes.map((r,i)=>`<option value="${r}">${labels[i]}</option>`).join("")}</select></label><label>Viewport <select id="width">${[390,768,1440,1920].map(w=>`<option>${w}</option>`).join("")}</select></label><button id="load">Compare poster and video</button><p id="status" role="status"></p><p>Use the background Pause/Play button in the video frame. Your OS/browser reduced-motion and data-saving preferences remain respected; reduced motion shows the poster without loading video.</p></header><div class="frames"><section><h2>Poster / ordinary review</h2><iframe title="Poster page" id="poster"></iframe></section><section><h2>Video review</h2><iframe title="Video page" id="video"></iframe></section></div><script>function render(){const route=document.querySelector('#route').value;const width=document.querySelector('#width').value;for(const id of ['poster','video']){const frame=document.getElementById(id);frame.style.width=width+'px';frame.src=route+(id==='video'?'?heroVideoReview=1':'');}document.getElementById('status').textContent=['/','/services'].includes(route)?'Matched local review footage; 480p selected below 768px, 720p otherwise.':'Matching footage/poster missing: both frames preserve the current design.';}document.getElementById('load').addEventListener('click',render);render();</script></html>`;
}
function mediaFiles(directory) {
  return Object.fromEntries([['home.mp4','home-desktop.mp4'],['home-mobile.mp4','home-mobile.mp4'],['services.mp4','services-desktop.mp4'],['services-mobile.mp4','services-mobile.mp4']].map(([url,file])=>['/__clinic-review-media/'+url,path.resolve(directory,file)]));
}
function createReviewServer(files = {}, root = path.resolve("out")) {
  return http.createServer((req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); return res.end(); }
    const url = new URL(req.url, "http://127.0.0.1");
    if (url.pathname === "/__hero-review") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }); return res.end(reviewGallery()); }
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
module.exports = { createReviewServer, mediaFiles };
if (require.main === module) {
  const [first, second] = process.argv.slice(2);
  const files = first === "--media-dir" ? mediaFiles(second) : {
    "/__clinic-review-media/home.mp4": first, "/__clinic-review-media/home-mobile.mp4": first,
    "/__clinic-review-media/services.mp4": second, "/__clinic-review-media/services-mobile.mp4": second,
  };
  for (const file of Object.values(files)) if (!file || !path.isAbsolute(file) || !fs.statSync(file).isFile()) throw new Error("Provide --media-dir <prepared directory> or two explicit absolute MP4 paths");
  createReviewServer(files).listen(4178, "127.0.0.1", () => console.log("Open http://127.0.0.1:4178/__hero-review ? local-only poster/video comparisons"));
}
