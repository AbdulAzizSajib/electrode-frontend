/**
 * Cloudinary delivery URLs at a requested size.
 *
 * `next/image` gets this through `image-loader.ts`; this module is for the
 * images and videos that are not `next/image` — logos drawn at a merchant's
 * height, landing-page images, images inside rich text, and `<video>` sources
 * and posters. Each of those used to request the original upload. A plain
 * module (no "use client"), so Server Components can call it too: the loader
 * file has to be a client module, and a Server Component cannot call a
 * function exported from one.
 *
 * Only `https://res.cloudinary.com/<cloud>/(image|video)/upload/…` is touched.
 * Every other URL — the placeholder, another host, a lookalike host — comes
 * back exactly as given.
 */

/** `https://res.cloudinary.com/<cloud>/<image|video>/upload/` and everything after it. */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.+)$/;

/**
 * A `video/upload` URL with an image extension is a frame Cloudinary renders
 * from the video — what the upload controller hands back as a poster when the
 * merchant gives none. It takes image transformations, not video ones.
 */
const IMAGE_EXTENSION = /\.(jpe?g|png|webp|avif|gif)$/i;

export type CloudinarySize = {
  /** Largest width to deliver, in px. */
  width?: number;
  /** Largest height to deliver, in px. */
  height?: number;
  /** A fixed quality (1–100); Cloudinary's `q_auto` when absent. */
  quality?: number;
};

/**
 * An image delivered as `f_auto,c_limit,w_…,h_…,q_auto`: the smallest format
 * the browser takes, scaled down (never up) to fit the size.
 */
export function cloudinaryUrl(src: string, size: CloudinarySize = {}): string {
  const match = CLOUDINARY_UPLOAD.exec(src);
  if (!match) return src;

  const [, base, kind, rest] = match;
  if (kind === "video" && !IMAGE_EXTENSION.test(rest)) return src;

  const { width, height, quality } = size;
  const transformation = [
    "f_auto",
    "c_limit",
    width ? `w_${Math.round(width)}` : null,
    height ? `h_${Math.round(height)}` : null,
    `q_${quality ?? "auto"}`,
  ]
    .filter(Boolean)
    .join(",");

  return `${base}${transformation}/${rest}`;
}

/**
 * A video delivered with automatic quality and codec, instead of the original
 * upload's bitrate. Anything that is not a Cloudinary video (a poster frame
 * included) comes back unchanged.
 */
export function cloudinaryVideoUrl(src: string): string {
  const match = CLOUDINARY_UPLOAD.exec(src);
  if (!match) return src;

  const [, base, kind, rest] = match;
  if (kind !== "video" || IMAGE_EXTENSION.test(rest)) return src;

  return `${base}q_auto,vc_auto/${rest}`;
}
