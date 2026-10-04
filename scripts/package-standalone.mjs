/*
 * Turns `.next/standalone` into one archive a cPanel / Passenger host runs
 * with `node server.js`. Run after `next build` — `npm run build:cpanel` does
 * both. Deployment steps are in CPANEL-DEPLOY.md.
 *
 * The standalone copy deliberately omits `public/` and `.next/static/` (Next
 * expects a CDN in front of them), so they are copied in here. The archive is
 * packed with `tar` rather than PowerShell's Compress-Archive, whose 5.1 build
 * writes `\` separators that Linux `unzip` turns into literal filenames.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");
const ARCHIVE = "storefront.tar.gz";

/*
 * Where the entrypoint lands depends on `outputFileTracingRoot`: Next mirrors
 * the app's path relative to that root inside `.next/standalone`. In this
 * monorepo the root is the repo root, so the app is at `standalone/nextjs/`,
 * not at `standalone/`. Both layouts are real (see the `isMonorepoCheckout`
 * note in next.config.ts; server/openspec/changes/fix-cpanel-deploy-blockers
 * design.md Decision 2), so find the entrypoint rather than assume one —
 * `public/` and `.next/static/` must be copied *beside server.js*, and the
 * archive must unpack with server.js at its top level for `node server.js`.
 */
const appDir = existsSync(join(standalone, "server.js"))
  ? standalone
  : readdirSync(standalone, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(standalone, entry.name))
      .find((dir) => existsSync(join(dir, "server.js")));

if (!appDir) {
  console.error(
    '.next/standalone/**/server.js not found — run `next build` with `output: "standalone"` first.',
  );
  process.exit(1);
}

cpSync(join(root, "public"), join(appDir, "public"), { recursive: true });
cpSync(join(root, ".next", "static"), join(appDir, ".next", "static"), {
  recursive: true,
});

/*
 * When the entrypoint is nested, the traced `node_modules` sits one level up
 * at the standalone root. Move it in beside server.js so the archive is
 * self-contained — Node resolves upward from server.js, and once unpacked on
 * the host there is no level above it.
 */
if (appDir !== standalone && existsSync(join(standalone, "node_modules"))) {
  cpSync(join(standalone, "node_modules"), join(appDir, "node_modules"), {
    recursive: true,
  });
}

rmSync(join(root, ARCHIVE), { force: true });
// Relative, POSIX-separated path only: GNU tar (Git Bash) reads the `E:` in
// an absolute Windows path as a remote host, and `\` as an escape.
const appDirArg = relative(root, appDir).split(sep).join("/");
execFileSync("tar", ["-czf", ARCHIVE, "-C", appDirArg, "."], {
  cwd: root,
  stdio: "inherit",
});

console.log(`Packed ${join(root, ARCHIVE)}`);
