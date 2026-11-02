"use client";

import { useEffect, useState } from "react";

/**
 * Owner portrait. Put the photo at /public/owner/kriti-bapna.jpg
 * (any of .jpg/.webp works if you change OWNER_PHOTO below).
 * Until the file exists, an elegant "KB" monogram is shown instead.
 */
export const OWNER_PHOTO = "/owner/kriti-bapna.jpg";

export default function OwnerPhoto({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(true); // monogram until the photo is confirmed to exist

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setFailed(false);
    probe.onerror = () => setFailed(true);
    probe.src = OWNER_PHOTO;
  }, []);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark ${className}`}>
        <span className="font-display text-7xl italic text-white/90">KB</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={OWNER_PHOTO}
      alt="Kriti Bapna, founder and designer"
      className={`object-cover object-top ${className}`}
    />
  );
}
