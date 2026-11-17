"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import SizeGuide from "./SizeGuide";
import SizeGuideLink from "./SizeGuideLink";
import type { Product } from "@/lib/products";

const CUSTOM = "Custom Tailored";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [showTailor, setShowTailor] = useState(false);
  const [wished, setWished] = useState(false);

  // Multi-size products also get a "Custom Tailored" option.
  const sizeOptions = product.sizes.length > 1 ? [...product.sizes, CUSTOM] : product.sizes;

  const pickSize = (s: string) => {
    setSize(s);
    setError("");
    if (s === CUSTOM) setShowTailor(true);
  };

  const add = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError("");
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color,
      qty,
      palette: product.palette,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="label">Colour: <span className="normal-case tracking-normal text-ink">{color}</span></p>
        <div className="flex gap-3">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              aria-pressed={color === c.name}
              className={`h-9 w-9 rounded-full border-2 transition ${color === c.name ? "border-brand ring-2 ring-accent/60 ring-offset-2" : "border-ink/10"}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="label">Size</p>
        <div className="flex flex-wrap items-center gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              onClick={() => pickSize(s)}
              className={`min-w-12 rounded-full border px-4 py-2.5 text-sm transition ${
                size === s ? "border-brand bg-brand text-white" : "border-blush bg-surface text-ink/70 hover:border-brand"
              }`}
            >
              {s}
            </button>
          ))}
          {size && product.sizes.length > 1 && (
            <button
              type="button"
              onClick={() => { setSize(""); setError(""); }}
              className="ml-1 text-xs text-ink/50 hover:text-brand"
            >
              ✕ Clear
            </button>
          )}
        </div>
        {size === CUSTOM && (
          <button type="button" onClick={() => setShowTailor(true)} className="mt-2 text-xs text-brand underline underline-offset-4">
            Edit custom measurements
          </button>
        )}
        {error && <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-blush bg-surface">
          <button className="h-12 w-12 text-lg hover:text-brand" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
          <span className="w-8 text-center text-sm font-medium" aria-live="polite">{qty}</span>
          <button className="h-12 w-12 text-lg hover:text-brand" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button onClick={add} className="btn-primary flex-1 sm:flex-none sm:min-w-56">
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-pressed={wished}
          className="inline-flex items-center gap-1.5 text-sm text-ink/80 hover:text-brand"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.6 5 6.7 5c1.9 0 3.5 1 5.3 3 1.8-2 3.4-3 5.3-3 3.100 0 5 3 3.900 6.200-1.700 4.700-9.200 9.300-9.200 9.300Z" />
          </svg>
          {wished ? "Added to wishlist" : "Add to wishlist"}
        </button>
        <SizeGuideLink />
      </div>

      {added && (
        <Link href="/cart" className="inline-block text-sm text-brand underline underline-offset-4">
          View cart &amp; checkout →
        </Link>
      )}

      {showTailor && <SizeGuide productName={product.name} onClose={() => setShowTailor(false)} />}
    </div>
  );
}