import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { NextConfig } from "next";

const projectDir = dirname(fileURLToPath(import.meta.url));
const parentDir = resolve(projectDir, "..");
const parentManifest = resolve(parentDir, "package.json");
const isMonorepoCheckout = (() => {
  if (!existsSync(parentManifest)) return false;
  try {
    const { workspaces } = JSON.parse(readFileSync(parentManifest, "utf8"));
    const globs: string[] = Array.isArray(workspaces)
      ? workspaces
      : (workspaces?.packages ?? []);
    return globs.some((glob) => glob === "nextjs" || glob === "*");
  } catch {
  
    return false;
  }
})();

/*
 * Pinned rather than inferred. The launcher above this app carries its own
 * package-lock.json without declaring workspaces, and Next would otherwise
 * take that lockfile's directory as the root — putting the standalone
 * entrypoint at `.next/standalone/frontend/server.js` instead of
 * `.next/standalone/server.js`. Turbopack and output tracing must share it.
 */
const tracingRoot = isMonorepoCheckout ? parentDir : projectDir;

const nextConfig: NextConfig = {
  /*
   * Self-contained server for hosts that run `node server.js` directly
   * (cPanel / Passenger): `.next/standalone` carries only the traced
   * node_modules, so the host never runs `npm install`. Vercel builds its
   * own output either way.
   * `scripts/package-standalone.mjs` adds `public/` and `.next/static/`,
   * which the standalone copy leaves out. See CPANEL-DEPLOY.md.
   */
  output: "standalone",
  outputFileTracingRoot: tracingRoot,
  turbopack: { root: tracingRoot },

  /*
   * `serverExternalPackages: ["jsdom"]` was here for isomorphic-dompurify's
   * server-side DOM. Both are gone — `lib/sanitize-html.ts` now uses
   * `sanitize-html`, which parses with htmlparser2 and needs no DOM. Leaving
   * the entry would pin a package nothing imports.
   */
  /*
   * Images are sized by Cloudinary, not by Next's `/_next/image` optimizer and
   * no longer left unoptimized. The loader inserts a resize-and-format
   * transformation into each Cloudinary URL per `srcset` width and passes
   * every other source through; see src/lib/image-loader.ts for why Cloudinary
   * rather than Next does the work. No `remotePatterns` are needed — that list
   * only gates Next's own optimizer, which a custom loader never calls.
   */
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
