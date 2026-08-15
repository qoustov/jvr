const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function send(res, status, body, contentType) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": status === 200 ? "public, max-age=300" : "no-store",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    return send(res, 200, JSON.stringify({ ok: true, service: "jennifer-victoria.com" }), "application/json; charset=utf-8");
  }

  const route = url.pathname === "/" ? "/index.html" : url.pathname;
  const resolved = path.resolve(publicDir, `.${route}`);
  if (!resolved.startsWith(`${publicDir}${path.sep}`)) {
    return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
  }

  fs.stat(resolved, (error, stats) => {
    if (error || !stats.isFile()) return send(res, 404, "Not found", "text/plain; charset=utf-8");

    const contentType = types[path.extname(resolved)] || "application/octet-stream";
    const range = req.headers.range;
    if (range && contentType.startsWith("audio/")) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) return send(res, 416, "Invalid range", "text/plain; charset=utf-8");
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : stats.size - 1;
      if (start > end || end >= stats.size) return send(res, 416, "Invalid range", "text/plain; charset=utf-8");

      res.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      });
      return fs.createReadStream(resolved, { start, end }).pipe(res);
    }

    fs.readFile(resolved, (readError, file) => {
      if (readError) return send(res, 404, "Not found", "text/plain; charset=utf-8");
      send(res, 200, file, contentType);
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Jennifer Victoria site listening on ${port}`);
});
