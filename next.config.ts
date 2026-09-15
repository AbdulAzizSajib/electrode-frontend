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

  serverExternalPackages: ["jsdom"],
  images: {

    unoptimized: true,
  },
};

export default nextConfig;
