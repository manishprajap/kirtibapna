"use client";

import { useState } from "react";
import SizeChart from "@/components/SizeChart";

/** "Size Guide" link (ruler icon) that opens the size chart pop-up. */
export default function SizeGuideLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-ink/80 hover:text-brand">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 17.5 17.5 3l3.5 3.5L6.5 21 3 17.5Z" />
          <path d="m7.5 13.5 2 2M10.5 10.5l2 2M13.5 7.5l2 2" />
        </svg>
        Size Guide
      </button>
      {open && <SizeChart onClose={() => setOpen(false)} />}
    </>
  );
}