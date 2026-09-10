"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ProductImage } from "@/types/product";

/**
 * Presentational gallery: renders the images it is given and reports which one
 * was picked. It holds no selection state and knows nothing about variants —
 * deciding *which* images to show, and what picking one means, belongs to the
 * page that owns the variant choice.
 *
 * Selection travels by image url rather than by index. An index means a
 * different photo whenever the list changes, and an index held across a variant
 * change silently points at the wrong image.
 *
 * The order of `images` is the caller's and is never rearranged here. It is
 * deliberately stable across selections: a strip that reorders itself so the
 * selected photo leads pins the highlight ring to the first thumbnail forever,
 * which reads as a ring that does not move. Keeping the strip still and moving
 * the ring is the whole point of the two rules below.
 */
export default function ProductGallery({
  images,
  activeUrl,
  onSelect,
  title,
}: {
  images: ProductImage[];
  /** Url of the image to display. Falls back to the first when it is not in `images`. */
  activeUrl?: string;
  onSelect: (image: ProductImage) => void;
  title: string;
}) {
  const active = images.find((img) => img.url === activeUrl) ?? images[0];

  // With the strip no longer reordered, the selected thumbnail can sit outside
  // the scrolled region on a product with many photos. Bringing it into view is
  // what the reordering was really for. `nearest` on both axes so this nudges
  // the strip's own scroll and leaves the page where the shopper put it.
  const activeThumb = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeThumb.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden sm:max-h-112 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto">
          {images.map((img, i) => {
            const isActive = active.url === img.url;
            return (
              // Keyed by url *and* variant: the same file can be assigned to two
              // variants, and the list is not filtered, so a url alone is not
              // unique and React would silently reuse the wrong element.
              <button
                key={`${img.variantId ?? "shared"}:${img.url}`}
                ref={isActive ? activeThumb : undefined}
                type="button"
                onClick={() => onSelect(img)}
                // The ring is the only thing saying which photo is showing, so
                // it needs a non-visual equivalent too.
                aria-pressed={isActive}
                className={clsx(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 bg-gray-100 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  isActive ? "border-brand" : "border-transparent hover:border-gray-300"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${title} thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
      {/*
        `object-contain`, not `object-cover`. This is the shopper's one full
        look at the thing they are buying, and cover crops it to the square —
        which silently removes the edges of anything not photographed square,
        exactly where a product's shape is. `ProductCard` reached this same
        answer; the two now agree, so a photo cannot change shape between the
        listing and the page it links to.

        `sizes` is what stops `fill` from serving a full-viewport-width image
        into a half-width column on desktop.
      */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
