"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import OrderSummary from "@/components/OrderSummary";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-5xl font-semibold">Your cart is empty</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/60">Looks like you haven’t added anything yet. Discover our latest sarees, kurtis and festive wear.</p>
        <Link href="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="mb-10 text-5xl font-semibold">Shopping cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-blush rounded-3xl border border-blush bg-white">
          {items.map((i) => (
            <li key={i.key} className="flex gap-5 p-5 sm:p-6">
              <Link href={`/product/${i.slug}`} className="group w-24 shrink-0 sm:w-32">
                <ProductImage slug={i.slug} name={i.name} palette={i.palette} className="aspect-[3/4] w-full rounded-xl" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/product/${i.slug}`} className="font-display text-xl hover:text-brand">{i.name}</Link>
                    <p className="mt-1 text-sm text-ink/55">{i.color} · {i.size}</p>
                  </div>
                  <p className="font-semibold text-brand">{formatPrice(i.price * i.qty)}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-blush">
                    <button className="h-10 w-10 hover:text-brand" onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease quantity">−</button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button className="h-10 w-10 hover:text-brand" onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button onClick={() => removeItem(i.key)} className="text-sm text-ink/50 underline-offset-4 hover:text-brand hover:underline">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <OrderSummary>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to checkout</Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-brand underline-offset-4 hover:underline">Continue shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}
