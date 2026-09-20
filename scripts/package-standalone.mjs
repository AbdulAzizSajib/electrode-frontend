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
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");
const ARCHIVE = "storefront.tar.gz";

if (!existsSync(join(standalone, "server.js"))) {
  console.error(
    '.next/standalone/server.js not found — run `next build` with `output: "standalone"` first.',
  );
  process.exit(1);
}

cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), {
  recursive: true,
});

rmSync(join(root, ARCHIVE), { force: true });
// Relative paths only: GNU tar (Git Bash) reads the `E:` in an absolute
// Windows path as a remote host.
execFileSync("tar", ["-czf", ARCHIVE, "-C", ".next/standalone", "."], {
  cwd: root,
  stdio: "inherit",
});

console.log(`Packed ${join(root, ARCHIVE)}`);
