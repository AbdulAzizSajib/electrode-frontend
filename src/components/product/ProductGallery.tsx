"use client";

import Image from "next/image";
import clsx from "clsx";
import type { ProductImage } from "@/types/product";

/**
 * Presentational gallery: renders the images it is given and reports which one
 * was picked. It holds no selection state and knows nothing about variants —
 * deciding *which* images to show, and what picking one means, belongs to the
 * page that owns the variant choice.
 *
 * Selection travels by image url rather than by index. The list is filtered by
 * the selected variant, so an index means a different photo depending on what
 * is selected, and an index held across a variant change silently points at the
 * wrong image.
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
  if (images.length === 0) return null;

  const active = images.find((img) => img.url === activeUrl) ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => onSelect(img)}
              className={clsx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded border-2",
                active.url === img.url ? "border-brand" : "border-transparent"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
