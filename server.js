const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
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

  fs.readFile(resolved, (error, file) => {
    if (error) return send(res, 404, "Not found", "text/plain; charset=utf-8");
    send(res, 200, file, types[path.extname(resolved)] || "application/octet-stream");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Jennifer Victoria site listening on ${port}`);
});
