"use client";

import Photo from "./Photo";
import { getProduct } from "@/lib/products";

/**
 * Product photo (from `image` in src/lib/products.ts).
 * Falls back to a tinted illustration if the photo is missing.
 *
 * With `hoverImage`, a second photo (e.g. the back view) fades in when the
 * parent element that has the `group` class is hovered.
 */
export default function ProductImage({
  slug,
  name,
  palette,
  className = "",
  priority = false,
  hoverImage = false,
}: {
  slug: string;
  name: string;
  palette: [string, string];
  className?: string;
  priority?: boolean;
  hoverImage?: boolean;
}) {
  const product = getProduct(slug);
  const backImage = hoverImage ? product?.images?.[0] : undefined;

  return (
    <div className={`relative overflow-hidden bg-blush ${className}`}>
      <Photo
        src={product?.image}
        alt={name}
        category={product?.category ?? "Sarees"}
        colors={palette}
        priority={priority}
        className={`absolute inset-0 h-full w-full transition duration-700 ${backImage ? "" : "group-hover:scale-105"}`}
      />
      {backImage && (
        <Photo
          src={backImage}
          alt={`${name} – back view`}
          category={product?.category ?? "Sarees"}
          colors={palette}
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
