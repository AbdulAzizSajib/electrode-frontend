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
