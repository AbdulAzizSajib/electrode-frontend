import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
