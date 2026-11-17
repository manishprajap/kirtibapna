"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

const rows = [
  ["XS", 26, 32, 36],
  ["S", 28, 34, 38],
  ["M", 30, 36, 40],
  ["L", 32, 38, 42],
  ["XL", 34, 40, 44],
  ["XXL", 36, 42, 47],
] as const;

/** "Size Guidelines" pop-up: standard size chart (in inches). */
export default function SizeChart({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Size guidelines" className="fixed inset-0 z-[130] overflow-y-auto bg-black/70 p-4" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="fixed right-5 top-4 text-3xl leading-none text-white">✕</button>
      <div onClick={(e) => e.stopPropagation()} className="mx-auto my-16 w-full max-w-[800px] bg-white p-7 text-neutral-900 sm:p-[30px]">
        <h2 className="mb-6 text-center font-display text-2xl font-semibold uppercase tracking-wide">Size Guidelines</h2>
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-[#f4f4f4] text-xs uppercase tracking-wide">
              <th className="px-4 py-4 font-semibold">(In Inches)</th>
              <th className="px-4 py-4 font-semibold">Waist</th>
              <th className="px-4 py-4 font-semibold">Bust</th>
              <th className="px-4 py-4 font-semibold">Hip</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([size, waist, bust, hip]) => (
              <tr key={size} className="border-b border-neutral-200">
                <td className="px-4 py-4">{size}</td>
                <td className="px-4 py-4">{waist}</td>
                <td className="px-4 py-4">{bust}</td>
                <td className="px-4 py-4">{hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,
    document.body,
  );
}