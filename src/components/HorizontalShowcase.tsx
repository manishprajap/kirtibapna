"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

/**
 * "Pinned" horizontal gallery: as you scroll down the page, the collection slides sideways.
 * On phones it becomes a normal swipeable row.
 */
const headerHeight = () => document.querySelector("header")?.offsetHeight ?? 76;

export default function HorizontalShowcase({ products }: { products: Product[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const o = outer.current;
      const t = track.current;
      if (!o || !t || !mq.matches) return;
      const dist = Math.max(0, t.scrollWidth - window.innerWidth);
      const HEADER = headerHeight();
      const total = o.offsetHeight - (window.innerHeight - HEADER);
      const p = total > 0 ? Math.min(1, Math.max(0, -(o.getBoundingClientRect().top - HEADER) / total)) : 0;
      t.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
    };

    const measure = () => {
      const t = track.current;
      if (!t) return;
      if (!mq.matches) {
        setHeight(undefined);
        t.style.transform = "";
        return;
      }
      setHeight(Math.max(0, t.scrollWidth - window.innerWidth) + (window.innerHeight - headerHeight()));
      requestAnimationFrame(update);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section aria-label="The collection">
      {/* Desktop: pinned horizontal scroll */}
      <div ref={outer} className="relative hidden md:block" style={{ height }}>
        <div className="sticky top-[var(--hh,76px)] flex h-[calc(100vh-var(--hh,76px))] flex-col justify-center overflow-hidden">
          <div ref={track} className="flex w-max items-center gap-10 px-[6vw] will-change-transform">
            <div className="w-[30rem] shrink-0 pr-10">
              <p className="eyebrow">The collection</p>
              <h2 className="mt-5 font-display text-5xl uppercase leading-[0.95] tracking-tight text-white">
                Chosen
                <br />
                <span className="italic">piece</span>
                <br />
                by piece.
              </h2>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
                Keep scrolling — every outfit is picked for its fabric, its finish and the way it feels to wear.
              </p>
            </div>

            {products.map((p) => (
              <div key={p.slug} className="w-[21rem] shrink-0">
                <ProductCard product={p} />
              </div>
            ))}

            <Link
              href="/shop"
              className="group flex h-[28rem] w-[20rem] shrink-0 flex-col items-center justify-center rounded-3xl border border-white/15 text-center transition hover:border-brand"
            >
              <span className="font-display text-4xl uppercase text-white">View all</span>
              <span className="mt-4 text-4xl text-brand transition group-hover:translate-x-3">→</span>
            </Link>
          </div>

          <div className="absolute bottom-8 left-[6vw] right-[6vw] h-px bg-white/10">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-brand" />
          </div>
        </div>
      </div>

      {/* Mobile: swipe row */}
      <div className="md:hidden">
        <div className="container-x">
          <p className="eyebrow">The collection</p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white">
            Chosen piece <span className="italic">by piece.</span>
          </h2>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {products.map((p) => (
            <div key={p.slug} className="w-[68vw] shrink-0 snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="container-x mt-6">
          <Link href="/shop" className="btn-outline">View all products →</Link>
        </div>
      </div>
    </section>
  );
}
