"use client";

import { useEffect, useRef } from "react";

/** Global effects: scroll progress bar, soft cursor glow, magnetic buttons. */
export default function Fx() {
  const bar = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    let last: HTMLElement | null = null;
    const reset = () => {
      if (last) last.style.transform = "";
      last = null;
    };
    const onMove = (e: PointerEvent) => {
      if (glow.current) {
        glow.current.style.opacity = "1";
        glow.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      }
      const el = (e.target as HTMLElement).closest?.(".btn-primary,.btn-outline") as HTMLElement | null;
      if (last && last !== el) reset();
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        last = el;
      }
    };
    // Product-card tilt (mouse only)
    const onTilt = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as HTMLElement).closest?.(".pcard-img") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 10}deg) scale(1.02)`;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    const onTiltOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest?.(".pcard-img") as HTMLElement | null;
      if (el && !el.contains(e.relatedTarget as Node | null)) el.style.transform = "";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointermove", onTilt, { passive: true });
      document.addEventListener("pointerout", onTiltOut);
      document.addEventListener("pointerleave", reset);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onTilt);
      document.removeEventListener("pointerout", onTiltOut);
      document.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <>
      <div ref={bar} aria-hidden="true" className="fixed left-0 top-0 z-[95] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-brand-dark via-brand to-accent-light" />
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[5] -ml-[200px] -mt-[200px] h-[400px] w-[400px] rounded-full opacity-0 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle, rgba(232,64,122,.16), transparent 65%)" }}
      />
    </>
  );
}
