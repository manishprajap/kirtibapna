"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const KEY = "kb-newsletter";

/** Newsletter pop-up: image left, form right. Shown once, remembered after "No, thanks" or subscribing. */
export default function NewsletterPopup() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }
    let opened = false;
    // Open the popup right when the loader is hidden.
    const openNow = () => {
      if (opened) return;
      opened = true;
      setOpen(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    };
    // Loader already finished (e.g. revisit in the same session) -> show immediately.
    if (document.documentElement.dataset.intro === "done") {
      openNow();
      return;
    }
    window.addEventListener("kb-intro-done", openNow);
    return () => window.removeEventListener("kb-intro-done", openNow);
  }, [onHome]);

  const close = (remember = true) => {
    setShown(false);
    if (remember) {
      try {
        localStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }
    setTimeout(() => setOpen(false), 500);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send the email to Mailchimp / Brevo / your own API.
    setDone(true);
    setTimeout(() => close(), 2200);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter"
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
      onClick={() => close()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative grid max-h-[92vh] w-full max-w-[800px] overflow-hidden bg-white text-[#111] shadow-2xl transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] md:grid-cols-[0.9fr_1.1fr] ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Photo */}
        <div className="relative hidden overflow-hidden bg-[#eee] md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/pink-jacket-pant-coord-set.jpg" alt="Kirti Bapna new arrival" className="kenburns absolute inset-0 h-full w-full object-cover object-top" />
        </div>

        {/* Form */}
        <div className="relative flex flex-col justify-center px-7 py-10 sm:px-10">
          <button onClick={() => close()} aria-label="Close" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-2xl leading-none text-[#111] transition hover:rotate-90 hover:text-brand">
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kirti Bapna" style={{ height: 40, width: "auto", maxWidth: "100%", alignSelf: "flex-start" }} />

          <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-[#777]">Newsletter</p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-[#111] sm:text-4xl">Join the Kirti Bapna circle</h2>
          <p className="mt-4 text-sm leading-7 text-[#444]">Be the first to see new arrivals, offers and the stories behind each collection.</p>

          {done ? (
            <p className="mt-8 text-sm font-medium text-brand-dark">Thank you! You’re on the list 💗</p>
          ) : (
            <form onSubmit={submit} className="mt-6">
              <input
                type="email"
                required
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full border border-[#ccc] bg-white px-4 py-3.5 text-sm text-[#111] outline-none transition placeholder:text-[#777] focus:border-[#111]"
              />
              <button className="group relative mt-3 w-full overflow-hidden bg-[#111] py-4 text-xs font-medium uppercase tracking-[0.25em] text-white">
                <span className="relative z-10">Subscribe</span>
                <span className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
              </button>
              <button type="button" onClick={() => close()} className="mt-4 text-xs text-[#555] underline underline-offset-2 transition hover:text-[#111]">
                No, thanks
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
