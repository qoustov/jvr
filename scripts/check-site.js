const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const index = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const jsonLdMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch, "Missing JSON-LD structured data");
const person = JSON.parse(jsonLdMatch[1]);
assert(person["@type"] === "Person", "JSON-LD must describe a Person");

const jsonLdHash = crypto.createHash("sha256").update(jsonLdMatch[1]).digest("base64");
assert(server.includes(`'sha256-${jsonLdHash}'`), "CSP hash does not match the JSON-LD block");

const requiredFiles = [
  "robots.txt",
  "sitemap.xml",
  "assets/jennifer-social-card.jpg",
  "assets/video/kidzania-voiceover.mp4",
];
requiredFiles.forEach((file) => assert(fs.existsSync(path.join(publicDir, file)), `Missing ${file}`));

const imageTags = index.match(/<img\b[^>]*>/g) || [];
imageTags
  .filter((tag) => !tag.includes("data-lightbox-image"))
  .forEach((tag) => {
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `Image is missing dimensions: ${tag}`);
  });

const thumbnailDir = path.join(publicDir, "assets", "gallery", "thumbs");
const thumbnails = fs.readdirSync(thumbnailDir).filter((file) => file.endsWith(".jpg"));
assert(thumbnails.length === 8, "Expected eight gallery thumbnails");
assert(fs.statSync(path.join(publicDir, "assets", "video", "kidzania-voiceover.mp4")).size === 31431785, "Original video size changed");

const robots = fs.readFileSync(path.join(publicDir, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
assert(robots.includes("https://jennifer-victoria.com/sitemap.xml"), "robots.txt is missing the sitemap URL");
assert(sitemap.includes("<loc>https://jennifer-victoria.com/</loc>"), "Sitemap is missing the canonical URL");
assert(/\/styles\.css\?v=[\w-]+/.test(index) && /\/app\.js\?v=[\w-]+/.test(index), "Site assets must be versioned");

console.log("Site metadata, assets and media invariants are valid.");
