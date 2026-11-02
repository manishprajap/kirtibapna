"use client";

import { useState } from "react";
import GarmentArt from "./GarmentArt";

/**
 * A real photo. If the photo cannot be loaded (offline, wrong URL),
 * a matching illustration is shown instead so the layout never breaks.
 */
export default function Photo({
  src,
  alt,
  category,
  colors,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  category: string;
  colors: [string, string];
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <GarmentArt category={category} colors={colors} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
    />
  );
}
