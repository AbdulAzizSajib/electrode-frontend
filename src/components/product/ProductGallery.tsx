"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={clsx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded border-2",
                active === i ? "border-brand" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-gray-100">
        <Image src={images[active]} alt={title} fill className="object-cover" priority />
      </div>
    </div>
  );
}
