const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".vtt": "text/vtt; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function isCanonicalHost(req) {
  const hostname = String(req.headers.host || "").split(":")[0].toLowerCase();
  return hostname === "jennifer-victoria.com" || hostname === "www.jennifer-victoria.com";
}

function securityHeaders(req) {
  return {
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; media-src 'self' https://jvr.up.railway.app; style-src 'self'; script-src 'self' 'sha256-remXwjkVkGr6yV2aszLTrSbtKfpiIbpMKak79x59O/Y='; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...(isCanonicalHost(req) ? {} : { "X-Robots-Tag": "noindex, nofollow" }),
  };
}

function send(req, res, status, body, contentType, cacheControl = "no-store", extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
    ...securityHeaders(req),
    ...extraHeaders,
  });
  res.end(body);
}

function cacheControlFor(url, resolved) {
  if (path.basename(resolved) === "index.html") return "no-cache";
  // Let the origin answer Safari's byte-range requests directly. Caching the
  // complete MP4 at the CDN can turn later range requests into a 200 response.
  if (path.extname(resolved) === ".mp4") return "no-store";
  if (url.searchParams.has("v")) return "public, max-age=31536000, immutable";
  if (resolved.includes(`${path.sep}assets${path.sep}`)) return "public, max-age=604800, stale-while-revalidate=86400";
  return "public, max-age=3600";
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    return send(req, res, 200, JSON.stringify({ ok: true, service: "jennifer-victoria.com" }), "application/json; charset=utf-8", "no-cache");
  }

  const route = url.pathname === "/" ? "/index.html" : url.pathname;
  const resolved = path.resolve(publicDir, `.${route}`);
  if (!resolved.startsWith(`${publicDir}${path.sep}`)) {
    return send(req, res, 403, "Forbidden", "text/plain; charset=utf-8");
  }

  fs.stat(resolved, (error, stats) => {
    if (error || !stats.isFile()) return send(req, res, 404, "Not found", "text/plain; charset=utf-8");

    const contentType = types[path.extname(resolved)] || "application/octet-stream";
    const cacheControl = cacheControlFor(url, resolved);
    const etag = `W/"${stats.size}-${Math.floor(stats.mtimeMs)}"`;
    const commonHeaders = {
      "ETag": etag,
      "Last-Modified": stats.mtime.toUTCString(),
      ...(contentType.startsWith("audio/") || contentType.startsWith("video/") ? { "Accept-Ranges": "bytes" } : {}),
    };

    if (!req.headers.range && req.headers["if-none-match"] === etag) {
      res.writeHead(304, { "Cache-Control": cacheControl, ...securityHeaders(req), ...commonHeaders });
      return res.end();
    }

    const range = req.headers.range;
    if (range && (contentType.startsWith("audio/") || contentType.startsWith("video/"))) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) return send(req, res, 416, "Invalid range", "text/plain; charset=utf-8");

      let start;
      let end;
      if (!match[1]) {
        const suffixLength = Number(match[2]);
        if (!suffixLength) return send(req, res, 416, "Invalid range", "text/plain; charset=utf-8");
        start = Math.max(stats.size - suffixLength, 0);
        end = stats.size - 1;
      } else {
        start = Number(match[1]);
        end = match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;
      }
      if (start > end || start >= stats.size) return send(req, res, 416, "Invalid range", "text/plain; charset=utf-8");

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        ...securityHeaders(req),
        ...commonHeaders,
      });
      if (req.method === "HEAD") return res.end();
      return fs.createReadStream(resolved, { start, end }).pipe(res);
    }

    if (req.method === "HEAD") {
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stats.size,
        "Cache-Control": cacheControl,
        ...securityHeaders(req),
        ...commonHeaders,
      });
      return res.end();
    }

    fs.readFile(resolved, (readError, file) => {
      if (readError) return send(req, res, 404, "Not found", "text/plain; charset=utf-8");
      send(req, res, 200, file, contentType, cacheControl, commonHeaders);
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Jennifer Victoria site listening on ${port}`);
});
