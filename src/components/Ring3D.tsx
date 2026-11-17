"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

/**
 * 3D lookbook carousel: product photos stand on a rotating cylinder.
 * - turns slowly by itself (pauses while you hold it)
 * - drag / swipe to spin it, it keeps its momentum
 * - scrolling the page nudges it, and the photos facing away dim down
 */
export default function Ring3D({ products }: { products: Product[] }) {
  const items = products.slice(0, 10);
  const n = items.length;
  const step = 360 / n;

  const [cardW, setCardW] = useState(190);
  useEffect(() => {
    const fit = () => setCardW(window.innerWidth < 640 ? 132 : window.innerWidth < 1024 ? 176 : 214);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const cardH = Math.round(cardW * 1.36);
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n)) + 26;

  const wrap = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const st = useRef({ angle: 0, vel: 0, drag: false, moved: 0, lastX: 0, visible: true, lastScroll: 0 });

  useEffect(() => {
    const w = wrap.current;
    const r = ring.current;
    if (!w || !r) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = st.current;
    s.lastScroll = window.scrollY;
    let raf = 0;

    const paint = () => {
      r.style.transform = `translateZ(${-radius}px) rotateY(${s.angle.toFixed(2)}deg)`;
      for (let k = 0; k < n; k++) {
        const el = cards.current[k];
        if (!el) continue;
        const a = (((k * step + s.angle) % 360) + 360) % 360;
        const facing = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 = facing you
        el.style.opacity = (0.3 + 0.7 * facing).toFixed(2);
        el.style.filter = `brightness(${(0.45 + 0.55 * facing).toFixed(2)})`;
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.visible) return;
      if (!s.drag) {
        const auto = reduce ? 0 : 0.16;
        s.angle += s.vel + auto;
        s.vel *= 0.95;
      }
      paint();
    };

    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(w);

    const down = (e: PointerEvent) => {
      s.drag = true;
      s.moved = 0;
      s.lastX = e.clientX;
      s.vel = 0;
    };
    const move = (e: PointerEvent) => {
      if (!s.drag) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      s.angle += dx * 0.32;
      s.vel = dx * 0.32;
    };
    const up = () => {
      s.drag = false;
    };
    const onScroll = () => {
      const d = window.scrollY - s.lastScroll;
      s.lastScroll = window.scrollY;
      if (!s.drag) s.vel += Math.max(-4, Math.min(4, d * 0.02));
    };

    w.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      w.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("scroll", onScroll);
    };
  }, [n, step, radius]);

  return (
    <div className="relative select-none">
      <div
        ref={wrap}
        className="relative mx-auto cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
        style={{ height: cardH + 90, perspective: "1700px" }}
        aria-label="3D lookbook. Drag to spin."
      >
        {/* glow on the floor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-1/2 h-10 -translate-x-1/2 rounded-[50%] blur-xl"
          style={{ width: cardW * 2.4, background: "radial-gradient(closest-side, rgba(232,64,122,.55), transparent)" }}
        />
        <div
          ref={ring}
          className="absolute left-1/2 top-6"
          style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, transformStyle: "preserve-3d" }}
        >
          {items.map((p, k) => (
            <Link
              key={p.slug}
              ref={(el) => {
                cards.current[k] = el;
              }}
              href={`/product/${p.slug}`}
              draggable={false}
              onClickCapture={(e) => {
                // a drag must not open the product
                if (st.current.moved > 6) e.preventDefault();
              }}
              className="ring3d-card absolute inset-0 block overflow-hidden rounded-2xl bg-surface shadow-[0_30px_60px_-25px_rgba(0,0,0,.9)] ring-1 ring-white/15"
              style={{ transform: `rotateY(${k * step}deg) translateZ(${radius}px)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} draggable={false} loading="lazy" className="h-full w-full object-cover object-top" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 to-transparent px-3 pb-3 pt-10 text-[11px] uppercase leading-tight tracking-widest text-white">
                {p.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/45">Drag to spin ↔</p>
    </div>
  );
}
