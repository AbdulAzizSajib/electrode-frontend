import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pinned to this directory. Without it Turbopack infers the root by walking
    // up for a lockfile, finds the repo root's (which exists only to hold the
    // `concurrently` dev dependency that starts all three apps together), and
    // warns on every boot. The storefront's sources are all under here.
    root: __dirname,
  },
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
