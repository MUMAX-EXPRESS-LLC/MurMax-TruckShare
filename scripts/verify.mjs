import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.dirname(url.fileURLToPath(import.meta.url)) + "/..";

function fail(msg) {
  console.error("❌ Verify:", msg);
  process.exit(1);
}

function ok(msg) {
  console.log("✅", msg);
}

// 1) Required files exist
const required = [
  "package.json",
  "index.html",
  "vite.config.ts",
  "tsconfig.json",
  "src/main.tsx",
  "src/App.tsx",
  "vercel.json"
];
for (const f of required) {
  if (!fs.existsSync(path.join(root, f))) fail(`Missing required file: ${f}`);
}
ok("All required files present");

// 2) package.json sanity
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
if (!pkg.scripts?.build || pkg.scripts.build !== "vite build") {
  fail(`package.json scripts.build must be "vite build"`);
}
if (!pkg.devDependencies?.vite) fail("vite must be in devDependencies");
if (!pkg.devDependencies?.["@vitejs/plugin-react"]) fail("@vitejs/plugin-react must be in devDependencies");
ok("package.json scripts & devDependencies look good");

// 3) vercel.json valid JSON + SPA rewrite present
try {
  const vjson = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
  const hasRewrite = Array.isArray(vjson.rewrites) && vjson.rewrites.some(r => r.destination === "/");
  if (!hasRewrite) fail("vercel.json must include SPA rewrite { source: '/(.*)', destination: '/' }");
  ok("vercel.json parsed & SPA rewrite found");
} catch (e) {
  fail(`vercel.json invalid JSON: ${e.message}`);
}

// 4) vite.config.ts contains outDir = "dist" and plugin-react usage
const viteCfg = fs.readFileSync(path.join(root, "vite.config.ts"), "utf-8");
if (!viteCfg.includes("@vitejs/plugin-react")) fail("vite.config.ts must import @vitejs/plugin-react");
if (!viteCfg.includes('outDir: "dist"') && !viteCfg.includes("outDir:'dist'") && !viteCfg.includes("outDir:\"dist\"")) {
  console.warn("ℹ️ vite.config.ts does not explicitly set outDir:'dist' (Vite defaults to 'dist', but we recommend keeping it explicit).");
} else {
  ok('vite.config.ts sets build.outDir = "dist"');
}

// 5) Warn if package-lock.json missing (not fatal)
if (!fs.existsSync(path.join(root, "package-lock.json"))) {
  console.warn("ℹ️ package-lock.json not found yet. Run `npm install` locally to generate it for deterministic builds.");
} else {
  ok("package-lock.json present");
}

ok("Verify checks completed.");
