"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Reveal } from "./motion";
import { categories, inCategory, products } from "@/lib/products";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
] as const;

const ranges = [
  { value: "all", label: "All prices", min: 0, max: Infinity },
  { value: "u2500", label: "Under ₹2,500", min: 0, max: 2500 },
  { value: "2500-8000", label: "₹2,500 – ₹8,000", min: 2500, max: 8000 },
  { value: "o8000", label: "Above ₹8,000", min: 8000, max: Infinity },
] as const;

const chipCls = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm transition ${
    on ? "border-brand bg-brand text-white" : "border-blush bg-surface text-ink/70 hover:border-brand hover:text-brand"
  }`;

const off = (p: { mrp: number; price: number }) => (p.mrp - p.price) / p.mrp;

/** The in-page "Shop" block: category chips, search, price + sort, then the product grid. */
export default function HomeShop({ limit = 12 }: { limit?: number }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<(typeof sorts)[number]["value"]>("featured");
  const [price, setPrice] = useState<(typeof ranges)[number]["value"]>("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const range = ranges.find((r) => r.value === price) ?? ranges[0];
    const term = q.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (category === "All" || inCategory(p, category)) &&
        p.price >= range.min &&
        p.price < range.max &&
        (!term || `${p.name} ${p.category} ${p.fabric ?? ""}`.toLowerCase().includes(term)),
    );
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "discount") out.sort((a, b) => off(b) - off(a));
    if (sort === "featured") out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [category, sort, price, q]);

  const shown = list.slice(0, limit);
  const clear = () => {
    setCategory("All");
    setSort("featured");
    setPrice("all");
    setQ("");
  };

  return (
    <section id="shop" className="border-t border-white/10 pt-8">
      <div className="container-x py-12">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow">The collection</p>
          <h2 className="mt-3 text-5xl font-semibold">{category === "All" ? "Shop All" : category}</h2>
          {q.trim() && <p className="mt-3 text-sm text-ink/60">Results for “{q}”</p>}
        </Reveal>

        <Reveal className="mb-10 flex flex-col gap-5 rounded-2xl border border-blush bg-surface p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {["All", ...categories.map((c) => c.name)].map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={chipCls(category === c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              aria-label="Search products"
              className="input !w-44"
            />
            <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className="input !w-auto" aria-label="Filter by price">
              {ranges.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input !w-auto" aria-label="Sort products">
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </Reveal>

        <p className="mb-6 text-sm text-ink/55">
          {list.length} {list.length === 1 ? "product" : "products"}
        </p>

        {list.length === 0 ? (
          <div className="rounded-3xl bg-blush/60 py-24 text-center">
            <h2 className="text-3xl">No products found</h2>
            <p className="mt-2 text-sm text-ink/60">Try a different category or clear your filters.</p>
            <button onClick={clear} className="btn-outline mt-6">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {shown.map((p, i) => (
              <div key={p.slug} style={{ animation: "fadeUp .7s ease both", animationDelay: `${Math.min(i, 11) * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {list.length > shown.length && (
          <div className="mt-12 text-center">
            <Link
              href={category === "All" ? "/shop" : `/shop?category=${encodeURIComponent(category)}`}
              className="btn-outline"
            >
              View all {list.length} products →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
