"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import OrderSummary from "@/components/OrderSummary";
import { formatPrice } from "@/lib/products";

const payments = [
  { value: "upi", label: "UPI (GPay, PhonePe, Paytm)" },
  { value: "card", label: "Credit / Debit card" },
  { value: "cod", label: "Cash on delivery" },
];

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [payment, setPayment] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const customer = Object.fromEntries(f.entries());
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total, payment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");
      setOrderId(data.orderId);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="container-x py-28 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="text-5xl font-semibold">Thank you for your order!</h1>
        <p className="mt-4 text-ink/65">
          Your order <strong className="text-brand">#{orderId}</strong> has been placed. A confirmation will be sent to you shortly.
        </p>
        <Link href="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-5xl font-semibold">Nothing to checkout</h1>
        <p className="mt-4 text-ink/60">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-8">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="mb-10 text-5xl font-semibold">Checkout</h1>
      <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-blush bg-white p-7">
            <h2 className="mb-6 text-2xl font-semibold">Contact &amp; delivery</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required className="input" autoComplete="name" /></div>
              <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" required pattern="[0-9+\s-]{10,15}" className="input" autoComplete="tel" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="address">Address</label><textarea id="address" name="address" required rows={3} className="input" autoComplete="street-address" /></div>
              <div><label className="label" htmlFor="city">City</label><input id="city" name="city" required className="input" autoComplete="address-level2" /></div>
              <div><label className="label" htmlFor="state">State</label><input id="state" name="state" required className="input" autoComplete="address-level1" /></div>
              <div><label className="label" htmlFor="pincode">PIN code</label><input id="pincode" name="pincode" required pattern="[0-9]{6}" className="input" autoComplete="postal-code" /></div>
            </div>
          </section>

          <section className="rounded-3xl border border-blush bg-white p-7">
            <h2 className="mb-6 text-2xl font-semibold">Payment</h2>
            <div className="space-y-3">
              {payments.map((p) => (
                <label key={p.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${payment === p.value ? "border-brand bg-brand/5" : "border-blush hover:border-brand/40"}`}>
                  <input type="radio" name="payment" value={p.value} checked={payment === p.value} onChange={() => setPayment(p.value)} className="accent-brand" />
                  {p.label}
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink/50">Demo checkout: connect Razorpay / Stripe in <code>/api/orders</code> to accept real payments.</p>
          </section>
        </div>

        <OrderSummary>
          <ul className="mt-6 space-y-2 border-t border-blush pt-5 text-sm text-ink/70">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span>{i.name} × {i.qty}</span><span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          <button disabled={loading} className="btn-primary mt-6 w-full">{loading ? "Placing order…" : `Place order · ${formatPrice(total)}`}</button>
        </OrderSummary>
      </form>
    </div>
  );
}
