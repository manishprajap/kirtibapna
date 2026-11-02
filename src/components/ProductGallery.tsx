"use client";

import { useState } from "react";
import Photo from "./Photo";
import type { Category } from "@/lib/products";

/**
 * Product-page gallery: thumbnails + large image with prev/next arrows.
 * Thumbnails sit on the left on desktop and below the image on mobile.
 */
export default function ProductGallery({
  images,
  name,
  category,
  palette,
}: {
  images: string[];
  name: string;
  category: Category;
  palette: [string, string];
}) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (i: number) => setActive((i + count) % count);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-start">
      {count > 1 && (
        <div className="flex gap-3 overflow-x-auto lg:max-h-[640px] lg:w-24 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg border-2 transition lg:w-full ${
                i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Photo src={src} alt={`${name} – view ${i + 1}`} category={category} colors={palette} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 overflow-hidden rounded-3xl bg-blush">
        <div className="relative aspect-[4/5] w-full">
          {images.map((src, i) => (
            <Photo
              key={src}
              src={src}
              alt={`${name} – view ${i + 1}`}
              category={category}
              colors={palette}
              priority={i === 0}
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
