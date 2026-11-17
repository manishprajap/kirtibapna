"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** True once the element has scrolled into view (fires once). */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

/** Fades + rises into place when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${seen ? "is-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Headline whose lines slide up from behind a mask.
 * `hero` lines play once the intro/preloader has finished; others play when scrolled into view.
 */
export function MaskLines({
  lines,
  hero = false,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  lines: ReactNode[];
  hero?: boolean;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p";
}) {
  const [ref, seen] = useInView<HTMLElement>(0.2);
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`mask ${hero ? "mask-hero" : ""} ${seen ? "is-in" : ""}`}
          style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Big statement text whose words light up one by one as you scroll. */
export function ScrollWords({ lines, className = "" }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(clamp((vh * 0.9 - r.top) / (vh * 0.5 + r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = lines.map((l) => l.split(" "));
  const total = words.reduce((n, l) => n + l.length, 0);
  let idx = 0;

  return (
    <p ref={ref} className={className}>
      {words.map((line, li) => (
        <span key={li} className="block">
          {line.map((w, wi) => {
            const i = idx++;
            const o = 0.14 + 0.86 * clamp(p * (total + 2) - i);
            return (
              <span key={wi} style={{ opacity: o }} className="inline-block pr-[0.25em] transition-opacity duration-200">
                {w}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}

/** Wrapper that moves its content slower than the page for a depth effect. */
export function Parallax({
  children,
  speed = 0.1,
  zoom = 1.18,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  /** Scale of the inner layer. Use 1 to show the full image with no cropping. */
  zoom?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const n = inner.current;
    if (!w || !n) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = w.getBoundingClientRect();
      const offset = r.top + r.height / 2 - window.innerHeight / 2;
      n.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0) scale(${zoom})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, zoom]);

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform" style={{ transform: `scale(${zoom})` }}>
        {children}
      </div>
    </div>
  );
}

/** Image "curtain": the picture is wiped into view (and settles from a slight zoom) when scrolled into view. */
export function Curtain({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={className}>
      <div className={`curtain ${seen ? "is-in" : ""}`}>{children}</div>
    </div>
  );
}
