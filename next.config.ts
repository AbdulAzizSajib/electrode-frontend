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
  /*
   * Turbopack bundles PostCSS under an internal hashed module name
   * (e.g. `postcss-9745a0d11e3197ae`) that is NOT a real npm package.
   * The standalone output file-tracer never finds it in node_modules, so
   * the server crashes at runtime with "Cannot find module 'postcss-<hash>'".
   * `turbopack` config key is intentionally absent here.
   *
   * When NEXT_TURBOPACK=0, Next falls back to Webpack which resolves PostCSS
   * as a real dependency and includes it in the standalone trace correctly.
   * Keep Turbopack for `dev` (fast HMR) and disable it only for the
   * `build:cpanel` script (set via cross-env in package.json).
   * Having `turbopack: { root }` in next.config makes `next build` use
   * Turbopack, which bundles PostCSS under an internal hashed module name
   * (e.g. `postcss-9745a0d11e3197ae`). That name is not a real npm package,
   * so the standalone file-tracer never copies it — the server crashes at
   * runtime with "Cannot find module 'postcss-<hash>'".
   *
   * `next build` always uses Webpack when this key is absent.
   * Turbopack is enabled for local dev only via `--turbopack` in the
   * `dev` script in package.json.
   */
  ...(process.env.NEXT_TURBOPACK !== "0" && {
    turbopack: { root: tracingRoot },
  }),

  /*
   * `serverExternalPackages: ["jsdom"]` was here for isomorphic-dompurify's
   * server-side DOM. Both are gone — `lib/sanitize-html.ts` now uses
   * `sanitize-html`, which parses with htmlparser2 and needs no DOM.
   *
   * These two are BUNDLED rather than left external, and that is the whole
   * point of the entry.
   *
   * Turbopack emits a server-side external under a CONTENT-HASHED specifier
   * when the package resolves outside the app directory — which is always here,
   * because npm workspaces hoist every shared dependency to the monorepo root.
   * The chunk ends up holding `require("sanitize-html-6ef27188a4b3dc42")`, a
   * name no package has. The build reports success, the standalone server
   * boots, and then every server render of a page that touches the module dies
   * with `Cannot find module`. The package itself is traced into the standalone
   * `node_modules/` perfectly well — only the NAME in the bundle is
   * unresolvable, which is why the failure survives a complete, correct
   * dependency tree and reads as a packaging bug.
   *
   * `serverExternalPackages: ["sanitize-html"]` does NOT fix this. It was tried:
   * it only moved the hash from the dependency to the parent
   * (`postcss-9745a0d11e3197ae` became `sanitize-html-6ef27188a4b3dc42`),
   * because marking something external is precisely what triggers the hashing.
   * `transpilePackages` makes Turbopack compile both into the chunks instead,
   * so there is no external specifier left to mangle. `postcss` is listed
   * explicitly because `sanitize-html` depends on it and it is hoisted too.
   *
   * See server/openspec/changes/fix-cpanel-deploy-blockers/design.md Decision 1 for the
   * failed first attempt and why it looked like it had worked.
   *
   * VERIFY BY BOOTING, NOT BY BUILDING. `next build` exits 0 in every broken
   * variant above. The check that distinguishes them is:
   *
   *     grep -rhoE 'a\.x\("[^"]+"' .next/server/chunks/ssr/*.js | sort -u
   *
   * Every specifier it prints must be a real, resolvable name. A trailing
   * 16-hex-character suffix on any of them is this bug.
   */
  transpilePackages: ["sanitize-html", "postcss"],

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
    // Next's defaults plus 160: the cart and checkout thumbnails are 64–80px,
    // and without 160 a 2x screen jumps from 128 straight to 256.
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384],
  },
};

export default nextConfig;
