"use client";

import { useEffect, useState } from "react";

const finish = () => {
  document.documentElement.dataset.intro = "done";
  // Tell other components (e.g. the newsletter popup) that the loader is gone.
  window.dispatchEvent(new Event("kb-intro-done"));
};

/** Short brand intro shown once per visit. Sets html[data-intro="done"] so hero text can animate in. */
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [out, setOut] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("kb-intro") === "1";
    } catch {
      /* ignore */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setOut(true), 2600);
    const t2 = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
      finish();
      try {
        sessionStorage.setItem("kb-intro", "1");
      } catch {
        /* ignore */
      }
    }, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night transition-transform duration-[800ms] ease-[cubic-bezier(.76,0,.24,1)] ${
        out ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="animate-fadeUp">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Kirti Bapna" className="brightness-0 invert" style={{ height: 66, width: "auto", maxWidth: "80vw" }} />
      </div>
      <div className="mt-10 h-px w-40 overflow-hidden bg-white/10">
        <div className="h-full origin-left bg-brand" style={{ animation: "progress 2.4s cubic-bezier(.65,0,.35,1) both" }} />
      </div>
    </div>
  );
}
