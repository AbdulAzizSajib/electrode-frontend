"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cloudinaryUrl, cloudinaryVideoUrl } from "@/lib/cloudinary-url";

/**
 * The product's video, shown beneath the gallery.
 *
 * Deliberately a sibling of `ProductGallery` rather than an entry inside it.
 * The gallery's images are filtered by the variant a shopper has selected — a
 * video belongs to the product as a whole, so folding it in would either make
 * it disappear when a variant is chosen or force the gallery to hold two kinds
 * of thing. See `link-product-images-to-variants`, which established that
 * filtering.
 *
 * The poster frame is shown first and the video only loads on click:
 * `preload="none"` alone still costs a request, and a product page should not
 * fetch several megabytes for a video most shoppers never play.
 */
export default function ProductVideo({
  url,
  thumbnail,
  title,
}: {
  url: string;
  /** Always supplied by the API — it derives a frame when the merchant gives none. */
  thumbnail?: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        // Automatic quality and codec rather than the upload's own bitrate.
        src={cloudinaryVideoUrl(url)}
        poster={thumbnail && cloudinaryUrl(thumbnail, { width: 1280 })}
        controls
        autoPlay
        className="mt-4 w-full rounded-lg border border-gray-100 bg-black"
      >
        <track kind="captions" />
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video for ${title}`}
      className="group relative mt-4 block w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100"
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt=""
          width={800}
          height={450}
          // Full width of the description column, which stops growing at
          // 768px; without `sizes` a fixed-width image is fetched at 1x/2x of
          // 800 whatever the screen.
          sizes="(min-width: 1024px) 768px, 100vw"
          className="h-auto w-full object-cover"
        />
      ) : (
        <div className="aspect-video w-full bg-gray-200" />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-brand shadow">
          <Play size={22} className="ml-1 fill-current" />
        </span>
      </span>
    </button>
  );
}
