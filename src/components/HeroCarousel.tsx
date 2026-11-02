"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Home-page hero: banner images in a carousel with the intro text on top.
 * Set showText={false} (in app/page.tsx) if your banner images already contain their own text.
 * Banners come from /public/banners/banner-1.jpg, banner-2.jpg … (picked up automatically).
 */
export default function HeroCarousel({ slides, showText = true }: { slides: string[]; showText?: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setActive(count ? (i + count) % count : 0), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count, paused]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-white to-blush"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* banner slides (cross-fade) */}
      {slides.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== active}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* soft fade on the left keeps the text readable on any banner */}
      {showText && <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />}

      {/* text on top of the banner */}
      {showText ? (
      <div className="container-x relative flex min-h-[480px] items-center py-14 sm:min-h-[600px] lg:min-h-[680px] lg:py-20">
        <div className="animate-fadeUp">
          <p className="eyebrow !text-white/80">The new collection</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
            Vintage elegance,
            <br />
            <span className="italic text-[#f7d9a0]">with a modern twist</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
            Suits, lehengas, sarees, co-ord sets and dresses for women — designed by Kriti Bapna, a NIFT-trained designer from Kota, with vintage elegance and a modern twist.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary !bg-white !text-brand hover:!bg-blush">Shop the collection</Link>
            <Link href="/about" className="btn-outline !border-white !text-white hover:!bg-white/15">Meet Kriti</Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            {["Free shipping above ₹1,999", "7-day easy returns", "Cash on delivery"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[10px] text-brand">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      ) : (
        <div className="relative min-h-[480px] sm:min-h-[600px] lg:min-h-[680px]" />
      )}

      {count > 1 && (
        <>
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow transition hover:bg-white sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow transition hover:bg-white sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === active}
                className={`h-2.5 rounded-full transition-all ${i === active ? "w-7 bg-white" : "w-2.5 bg-white/45 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
