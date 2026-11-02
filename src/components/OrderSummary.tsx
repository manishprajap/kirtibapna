"use client";

import { useCart } from "./CartProvider";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/products";

export default function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { subtotal, shipping, total } = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <aside className="h-fit rounded-3xl border border-blush bg-white p-7 lg:sticky lg:top-36">
      <h2 className="text-2xl font-semibold">Order summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Shipping</dt>
          <dd>{shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-blush pt-4 text-base font-semibold">
          <dt>Total</dt><dd className="text-brand">{formatPrice(total)}</dd>
        </div>
      </dl>
      {subtotal > 0 && remaining > 0 && (
        <div className="mt-5 rounded-xl bg-blush/70 p-3 text-xs text-ink/70">
          Add <strong className="text-brand">{formatPrice(remaining)}</strong> more for free shipping.
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
          </div>
        </div>
      )}
      {children}
    </aside>
  );
}
