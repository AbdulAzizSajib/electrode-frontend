import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { NextConfig } from "next";

const parentDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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

const nextConfig: NextConfig = {
  ...(isMonorepoCheckout ? { turbopack: { root: parentDir } } : {}),

  /*
   * `serverExternalPackages: ["jsdom"]` was here for isomorphic-dompurify's
   * server-side DOM. Both are gone — `lib/sanitize-html.ts` now uses
   * `sanitize-html`, which parses with htmlparser2 and needs no DOM. Leaving
   * the entry would pin a package nothing imports.
   */
  images: {

    unoptimized: true,
  },
};

export default nextConfig;
