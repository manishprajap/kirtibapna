"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaskLines } from "./motion";

const SLIDE_MS = 5500;

/** Category banners. Swap the `img` URLs for your own photos (or files in /public/banners). */
const slides = [
  { label: "Sarees", cat: "Sarees", img: "https://images.unsplash.com/photo-1742287724816-4a8a1cc7ad5c?auto=format&fit=crop&w=1600&q=80" },
  { label: "Suits", cat: "Suits", img: "https://images.unsplash.com/photo-1745313452052-0e4e341f326c?auto=format&fit=crop&w=1600&q=80" },
  { label: "Co-ord Sets", cat: "Co-ord Sets", img: "https://images.unsplash.com/photo-1743229995753-69be4b438204?auto=format&fit=crop&w=1600&q=80" },
  { label: "Lehengas", cat: "Lehengas", img: "https://images.unsplash.com/photo-1697347815876-924f6a358ee2?auto=format&fit=crop&w=1600&q=80" },
  { label: "Dresses", cat: "Dresses", img: "https://images.unsplash.com/photo-1731335391054-bcb9df422982?auto=format&fit=crop&w=1600&q=80" },
] as const;

const sparkles = [
  ["8%", "18%", "0s", 14], ["22%", "70%", "1.2s", 10], ["46%", "10%", "2.1s", 18], ["58%", "84%", "0.6s", 12],
  ["74%", "30%", "1.7s", 16], ["88%", "62%", "2.6s", 10], ["34%", "46%", "3.2s", 12],
] as const;

const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, paused]);

  const current = slides[i];

  return (
    <section
      id="hero"
      className={`relative min-h-[calc(100svh-var(--hh,76px))] overflow-hidden ${paused ? "paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div
          key={s.label}
          aria-hidden={idx !== i}
          className={`absolute inset-0 bg-gradient-to-br from-[#D81B60] to-[#880E4F] transition-opacity duration-[1400ms] ease-out ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <div key={idx === i ? `on-${i}` : `off-${idx}`} className={`absolute inset-0 ${idx === i ? "kenburns" : ""}`}>
            {!broken[idx] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.img}
                alt={`${s.label} banner`}
                loading={idx === 0 ? "eager" : "lazy"}
                onError={() => setBroken((b) => ({ ...b, [idx]: true }))}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/60 to-night/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/50" />

      {sparkles.map(([l, t, d, s]) => (
        <span key={`${l}${t}`} aria-hidden="true" className="animate-twinkle pointer-events-none absolute text-accent" style={{ left: l, top: t, animationDelay: d, fontSize: s }}>
          ✦
        </span>
      ))}

      <div className="container-x relative z-10 flex min-h-[calc(100svh-var(--hh,76px))] flex-col justify-end gap-8 pb-24 pt-10 md:pb-16">
        <div>
          <p className="eyebrow mb-6 animate-fadeUp">Kirti Bapna · Ladies Fashion</p>
          <MaskLines
            as="h1"
            hero
            className="font-display text-[clamp(2.2rem,6.2vw,5.6rem)] font-medium uppercase leading-[0.9] tracking-tight text-white"
            lines={["Wear the story,", <span key="b" className="italic">not the trend.</span>]}
          />
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-primary">Shop the collection</Link>
            <Link href={`/shop?category=${encodeURIComponent(current.cat)}`} className="btn-outline">Explore {current.label}</Link>
          </div>

          <ul className="mt-12 hidden space-y-2 md:block">
            {slides.map((s, idx) => (
              <li key={s.label}>
                <button
                  onClick={() => setI(idx)}
                  aria-label={`Show ${s.label}`}
                  className={`hero-dot flex items-center gap-3 text-xs uppercase tracking-widest transition ${idx === i ? "on text-white" : "text-white/40 hover:text-white/80"}`}
                >
                  <span>{pad(idx)}</span>
                  <span className="relative h-px w-16 overflow-hidden bg-white/20">
                    <span key={idx === i ? `bar-${i}` : "idle"} className="hero-bar absolute inset-0 origin-left bg-brand" />
                  </span>
                  <span>{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {slides.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => setI(idx)}
              aria-label={`Show ${s.label}`}
              className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-brand" : "w-4 bg-white/30"}`}
            />
          ))}
          <span className="ml-3 text-xs uppercase tracking-widest text-white/60">{current.label}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">Scroll</span>
        <span className="block h-10 w-px bg-white/60" style={{ animation: "scrollline 2.2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
