"use client";

/**
 * How every `next/image` in the storefront gets a correctly sized image.
 *
 * Image optimization used to be switched off (`unoptimized: true`), a leftover
 * from when every product image was the local `/api/placeholder` SVG. Real
 * images now come from Cloudinary, so each product card, banner and gallery
 * downloaded the merchant's original upload at full resolution — on a phone,
 * over a mobile connection — whatever size it was drawn at.
 *
 * Cloudinary resizes on its own CDN, so it does the work here rather than
 * Next's `/_next/image` optimizer. That keeps optimization off Vercel's
 * metered image usage entirely, serves from the same CDN the originals already
 * came from, and shrinks Cloudinary bandwidth rather than adding to it. Each
 * width in the `srcset` becomes a URL with a transformation inserted right
 * after `/image/upload/`:
 *
 *   f_auto   the smallest format the browser accepts (AVIF / WebP)
 *   c_limit  scale DOWN to the width, never up past the original
 *   w_<n>    the width this `srcset` entry is for
 *   q_<n>    the `quality` prop when one is set, otherwise Cloudinary's q_auto
 *
 * Anything else is left as it is, because it cannot be resized this way: the
 * local placeholder is resized by its own `w`/`h` parameters, and an image from
 * any other host is passed through untouched rather than broken.
 *
 * Registered through `images.loaderFile` in next.config.ts. See Next's image
 * config docs, "Example Loader Configuration → Cloudinary".
 */

/** `https://res.cloudinary.com/<cloud>/image/upload/` and everything after it. */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/** The placeholder route clamps to this, so scaling past it would only distort the ratio. */
const PLACEHOLDER_MAX = 1600;

type ImageLoaderInput = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: ImageLoaderInput): string {
  const cloudinary = CLOUDINARY_UPLOAD.exec(src);
  if (cloudinary) {
    const transformation = ["f_auto", "c_limit", `w_${width}`, `q_${quality ?? "auto"}`].join(",");
    return `${cloudinary[1]}${transformation}/${cloudinary[2]}`;
  }

  // Keeps the placeholder's aspect ratio while honouring the requested width.
  // It is SVG, so no size looks worse — this only stops every srcset entry
  // being the identical URL.
  if (src.startsWith("/api/placeholder?")) {
    const params = new URLSearchParams(src.slice(src.indexOf("?") + 1));
    const baseWidth = Number(params.get("w")) || 800;
    const baseHeight = Number(params.get("h")) || 800;
    const target = Math.min(width, PLACEHOLDER_MAX);
    params.set("w", String(target));
    params.set("h", String(Math.round((baseHeight * target) / baseWidth)));
    return `/api/placeholder?${params.toString()}`;
  }

  return src;
}
