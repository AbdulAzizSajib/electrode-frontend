"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { LandingPageMedia } from "@/types/landing-page";

/**
 * The campaign gallery: images and video, in the merchant's own order.
 *
 * The first item is what shows before any interaction, which is why order is
 * authored rather than derived — the merchant decides what a visitor arriving
 * from an ad sees in the first second.
 *
 * A video never autoplays with sound. `controls` and no `autoPlay` means it
 * plays on a deliberate tap: ad traffic frequently lands with the phone
 * unmuted in a public place, and a page that starts shouting is a page that
 * gets closed.
 */
export default function LandingGallery({
  items,
  productName,
}: {
  items: LandingPageMedia[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Guarded rather than assumed: the gallery is only rendered when it has
  // items, but a stale index after a merchant reorders would blank the frame.
  const active = items[activeIndex] ?? items[0];

  if (!active) return null;

  return (
    <div className="w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        {active.type === "VIDEO" ? (
          <video
            key={active.url}
            src={active.url}
            poster={active.thumbnailUrl}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={active.url}
            alt={active.alt || productName}
            fill
            // The gallery is the full column on mobile and half of it above
            // `md`, so the browser is told that rather than left to download a
            // full-width image for a half-width slot.
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            // The hero image is the largest thing above the fold on a page
            // whose whole job is the first impression.
            priority={activeIndex === 0}
          />
        )}
      </div>

      {items.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, index) => (
            <li key={`${item.url}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${item.type === "VIDEO" ? "video" : "image"} ${index + 1} of ${items.length}`}
                aria-current={index === activeIndex}
                className={clsx(
                  "relative block h-16 w-16 overflow-hidden rounded-lg border-2 transition",
                  index === activeIndex
                    ? "border-brand"
                    : "border-transparent hover:border-gray-300",
                )}
              >
                <Image
                  src={item.type === "VIDEO" ? (item.thumbnailUrl ?? item.url) : item.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                {item.type === "VIDEO" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center bg-black/35 text-white"
                  >
                    ▶
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
