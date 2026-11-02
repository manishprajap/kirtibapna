"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

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
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError("");
              }}
              className={`min-w-12 rounded-full border px-4 py-2.5 text-sm transition ${
                size === s ? "border-brand bg-brand text-white" : "border-blush bg-white text-ink/70 hover:border-brand"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-blush bg-white">
          <button className="h-12 w-12 text-lg hover:text-brand" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
          <span className="w-8 text-center text-sm font-medium" aria-live="polite">{qty}</span>
          <button className="h-12 w-12 text-lg hover:text-brand" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button onClick={add} className="btn-primary flex-1 sm:flex-none sm:min-w-56">
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>

      {added && (
        <Link href="/cart" className="inline-block text-sm text-brand underline underline-offset-4">
          View cart &amp; checkout →
        </Link>
      )}
    </div>
  );
}
