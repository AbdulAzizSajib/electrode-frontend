import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { NextConfig } from "next";

/*
 * The MONOREPO root, not this directory — and that distinction is the whole
 * point of this block.
 *
 * pnpm installs from the repo root, so `node_modules/next` here is a symlink
 * into `<repo-root>/node_modules/.pnpm/...`. Turbopack will not compile files
 * outside its root, so pinning the root to this folder makes its own framework
 * unresolvable: "Could not find the Next.js package".
 *
 * Setting it explicitly (rather than letting Turbopack infer it) keeps the
 * boot warning away and makes the intent legible. `__dirname` is unavailable —
 * this config is loaded as an ES module, where referencing it yields
 * `undefined` and silently sets no root at all.
 *
 * ...but ONLY when the monorepo is actually there. This app is also pushed on
 * its own to a standalone deploy repo (`electrode-frontend`), where this folder
 * IS the repo root: `..` is then some unrelated parent of the build container,
 * and pinning Turbopack there makes it try to compile the whole thing. The
 * pnpm-workspace.yaml one level up is the thing that distinguishes the two —
 * present in the monorepo checkout, absent in the deploy repo. Absent means
 * dependencies are installed locally and Turbopack's own inference is correct,
 * so we say nothing and let it infer.
 */
const parentDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isMonorepoCheckout = existsSync(resolve(parentDir, "pnpm-workspace.yaml"));

const nextConfig: NextConfig = {
  ...(isMonorepoCheckout ? { turbopack: { root: parentDir } } : {}),
  images: {
    // Product images are served from the local /api/placeholder route (SVG)
    // so the storefront never depends on an external image CDN. Once real
    // product photos come from your backend, either add their domain to
    // `remotePatterns` or drop `unoptimized` if you want Next's built-in
    // image optimization.
    unoptimized: true,
  },
};

export default nextConfig;
