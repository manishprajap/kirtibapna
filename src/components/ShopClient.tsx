"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { categories, formatPrice, inCategory, Product, products } from "@/lib/products";

/* ------------------------------------------------------------------ */
/* Filter model                                                        */
/* ------------------------------------------------------------------ */

interface Filters {
  category: string; // "All" or a Category
  colors: string[];
  sizes: string[];
  fabrics: string[];
  min: number;
  max: number;
  stock: boolean;
  sale: boolean;
  q: string;
}

type Facet = "category" | "colors" | "sizes" | "fabrics" | "stock" | "sale";

const sorts = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

const PRICE_STEP = 500;
const allPrices = products.map((p) => p.price);
const BOUND_MIN = Math.floor(Math.min(...allPrices) / 1000) * 1000;
const BOUND_MAX = Math.ceil(Math.max(...allPrices) / 1000) * 1000;

const uniq = (list: string[]) => Array.from(new Set(list));
const allColors = uniq(products.flatMap((p) => p.colors.map((c) => c.name))).sort();
const colorHex: Record<string, string> = {};
products.forEach((p) => p.colors.forEach((c) => (colorHex[c.name] ??= c.hex)));
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const allSizes = uniq(products.flatMap((p) => p.sizes)).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
const allFabrics = uniq(products.map((p) => p.fabric).filter((f): f is string => !!f)).sort();

/** Does a product match the filters? `skip` leaves one facet out so its option counts stay meaningful. */
function matches(p: Product, f: Filters, skip?: Facet) {
  if (skip !== "category" && f.category !== "All" && !inCategory(p, f.category)) return false;
  if (skip !== "colors" && f.colors.length && !p.colors.some((c) => f.colors.includes(c.name))) return false;
  if (skip !== "sizes" && f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s))) return false;
  if (skip !== "fabrics" && f.fabrics.length && !(p.fabric && f.fabrics.includes(p.fabric))) return false;
  if (skip !== "stock" && f.stock && p.soldOut) return false;
  if (skip !== "sale" && f.sale && p.mrp <= p.price) return false;
  if (p.price < f.min || p.price > f.max) return false;
  if (f.q && !`${p.name} ${p.category} ${p.fabric ?? ""} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(f.q)) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-blush py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-dark [&::-webkit-details-marker]:hidden">
        {title}
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="pt-5">{children}</div>
    </details>
  );
}

function Check({ checked }: { checked: boolean }) {
  return (
    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${checked ? "border-brand bg-brand" : "border-brand/30 bg-white"}`}>
      {checked && (
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </span>
  );
}

function OptionRow({ label, count, checked, onClick, lead }: { label: string; count: number; checked: boolean; onClick: () => void; lead?: React.ReactNode }) {
  const disabled = count === 0 && !checked;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      className={`flex w-full items-center gap-3 py-1.5 text-left text-[13px] transition ${disabled ? "cursor-not-allowed text-ink/30" : checked ? "text-brand" : "text-ink/70 hover:text-brand"}`}
    >
      {lead ?? <Check checked={checked} />}
      <span className={`flex-1 ${checked ? "font-medium" : ""}`}>{label}</span>
      <span className="text-[11px] tabular-nums text-ink/40">{count}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ShopClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  /* ---- read filters from the URL (shareable & back-button friendly) ---- */
  const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);
  const filters: Filters = {
    category: params.get("category") ?? "All",
    colors: list("colors"),
    sizes: list("sizes"),
    fabrics: list("fabrics"),
    min: Math.max(BOUND_MIN, Number(params.get("min")) || BOUND_MIN),
    max: Math.min(BOUND_MAX, Number(params.get("max")) || BOUND_MAX),
    stock: params.get("stock") === "1",
    sale: params.get("sale") === "1",
    q: (params.get("q") ?? "").toLowerCase().trim(),
  };
  const sort = params.get("sort") ?? "featured";

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null || v === "" ? next.delete(k) : next.set(k, v)));
    // history.replaceState keeps dragging the price slider smooth (no server round trip)
    window.history.replaceState(null, "", `/shop${next.toString() ? `?${next}` : ""}`);
  };

  const toggle = (key: "colors" | "sizes" | "fabrics", value: string) => {
    const cur = filters[key];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    update({ [key]: next.join(",") || null });
  };

  const clearAll = () => router.replace("/shop", { scroll: false });

  /* ---- results + live facet counts ---- */
  const results = useMemo(() => {
    let out = products.filter((p) => matches(p, filters));
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") out = [...out].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const count = (facet: Facet, test: (p: Product) => boolean) =>
    products.filter((p) => matches(p, filters, facet) && test(p)).length;

  const categoryCount = (c: string) => count("category", (p) => c === "All" || inCategory(p, c));

  /* ---- active filter chips ---- */
  const chips: { label: string; remove: () => void }[] = [];
  if (filters.category !== "All") chips.push({ label: filters.category, remove: () => update({ category: null }) });
  filters.colors.forEach((c) => chips.push({ label: c, remove: () => toggle("colors", c) }));
  filters.sizes.forEach((s) => chips.push({ label: `Size ${s}`, remove: () => toggle("sizes", s) }));
  filters.fabrics.forEach((f) => chips.push({ label: f, remove: () => toggle("fabrics", f) }));
  if (filters.min > BOUND_MIN || filters.max < BOUND_MAX)
    chips.push({ label: `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`, remove: () => update({ min: null, max: null }) });
  if (filters.stock) chips.push({ label: "In stock", remove: () => update({ stock: null }) });
  if (filters.sale) chips.push({ label: "On sale", remove: () => update({ sale: null }) });
  if (filters.q) chips.push({ label: `“${filters.q}”`, remove: () => update({ q: null }) });

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const categoryHasStock = filters.category === "All" || products.some((p) => inCategory(p, filters.category));

  /* ---- the filter panel (used in the sidebar and in the mobile drawer) ---- */
  const panel = (
    <div>
      <div className="relative border-b border-blush pb-5">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-[13px] h-4 w-4 text-ink/40" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
        </svg>
        <input
          value={params.get("q") ?? ""}
          onChange={(e) => update({ q: e.target.value || null })}
          placeholder="Search this collection"
          aria-label="Search this collection"
          className="input !pl-10"
        />
      </div>

      <Section title="Category">
        <OptionRow label="All pieces" count={categoryCount("All")} checked={filters.category === "All"} onClick={() => update({ category: null })} lead={<Check checked={filters.category === "All"} />} />
        {categories.map((c) => (
          <OptionRow
            key={c.name}
            label={c.name}
            count={categoryCount(c.name)}
            checked={filters.category === c.name}
            onClick={() => update({ category: filters.category === c.name ? null : c.name })}
          />
        ))}
      </Section>

      <Section title="Price">
        <div className="dual-range">
          <div className="absolute left-0 right-0 top-[9px] h-[2px] rounded bg-blush" />
          <div
            className="absolute top-[9px] h-[2px] rounded bg-brand"
            style={{
              left: `${((filters.min - BOUND_MIN) / (BOUND_MAX - BOUND_MIN)) * 100}%`,
              right: `${100 - ((filters.max - BOUND_MIN) / (BOUND_MAX - BOUND_MIN)) * 100}%`,
            }}
          />
          <input
            type="range"
            aria-label="Minimum price"
            min={BOUND_MIN}
            max={BOUND_MAX}
            step={PRICE_STEP}
            value={filters.min}
            onChange={(e) => update({ min: String(Math.min(Number(e.target.value), filters.max - PRICE_STEP)) })}
          />
          <input
            type="range"
            aria-label="Maximum price"
            min={BOUND_MIN}
            max={BOUND_MAX}
            step={PRICE_STEP}
            value={filters.max}
            onChange={(e) => update({ max: String(Math.max(Number(e.target.value), filters.min + PRICE_STEP)) })}
          />
        </div>
        <div className="mt-5 flex items-center gap-3 text-[13px]">
          <span className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-center tabular-nums">{formatPrice(filters.min)}</span>
          <span className="text-ink/40">to</span>
          <span className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-center tabular-nums">{formatPrice(filters.max)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { l: "Under ₹15k", a: BOUND_MIN, b: 15000 },
            { l: "₹15k – ₹25k", a: 15000, b: 25000 },
            { l: "Above ₹25k", a: 25000, b: BOUND_MAX },
          ].map((r) => {
            const active = filters.min === r.a && filters.max === r.b;
            return (
              <button
                key={r.l}
                type="button"
                onClick={() => update(active ? { min: null, max: null } : { min: String(r.a), max: String(r.b) })}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition ${active ? "border-brand bg-brand text-white" : "border-brand/25 text-ink/70 hover:border-brand hover:text-ink"}`}
              >
                {r.l}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Colour">
        {allColors.map((c) => (
          <OptionRow
            key={c}
            label={c}
            count={count("colors", (p) => p.colors.some((x) => x.name === c))}
            checked={filters.colors.includes(c)}
            onClick={() => toggle("colors", c)}
            lead={
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand/25 ${filters.colors.includes(c) ? "ring-2 ring-brand ring-offset-2 ring-offset-blush-50" : ""}`}
                style={{ background: colorHex[c] }}
              />
            }
          />
        ))}
      </Section>

      <Section title="Size">
        <div className="grid grid-cols-3 gap-2">
          {allSizes.map((s) => {
            const n = count("sizes", (p) => p.sizes.includes(s));
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle("sizes", s)}
                disabled={n === 0 && !on}
                aria-pressed={on}
                className={`rounded-xl border py-2.5 text-[12px] transition ${
                  on ? "border-brand bg-brand text-white" : n === 0 ? "cursor-not-allowed border-blush text-ink/25 line-through" : "border-brand/25 text-ink/80 hover:border-brand"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Fabric" defaultOpen={false}>
        {allFabrics.map((f) => (
          <OptionRow key={f} label={f} count={count("fabrics", (p) => p.fabric === f)} checked={filters.fabrics.includes(f)} onClick={() => toggle("fabrics", f)} />
        ))}
      </Section>

      <Section title="Availability">
        <OptionRow label="In stock" count={count("stock", (p) => !p.soldOut)} checked={filters.stock} onClick={() => update({ stock: filters.stock ? null : "1" })} />
        <OptionRow label="On sale" count={count("sale", (p) => p.mrp > p.price)} checked={filters.sale} onClick={() => update({ sale: filters.sale ? null : "1" })} />
      </Section>
    </div>
  );

  const gridClass = "grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {/* Title band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-white to-blush">
        <div className="container-x py-14 text-center sm:py-16">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-3 text-5xl font-semibold sm:text-6xl">{filters.category === "All" ? "Shop All" : filters.category}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/60">
            {categories.find((c) => c.name === filters.category)?.blurb ?? "Every piece, designed with vintage elegance and a modern twist."}
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-10 lg:grid-cols-[250px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-3">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-dark">Filters</h2>
              {chips.length > 0 && (
                <button onClick={clearAll} className="text-[11px] text-ink/60 underline underline-offset-4 hover:text-ink">
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <nav className="text-[12px] text-ink/50" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span>
              <span className="text-brand">{filters.category === "All" ? "Shop" : filters.category}</span>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawer(true)}
                className="flex items-center gap-2 border border-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] lg:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />
                </svg>
                Filters{chips.length > 0 && ` (${chips.length})`}
              </button>

              <label className="flex items-center gap-2 text-[12px] text-ink/60">
                <span className="hidden sm:inline">Sort</span>
                <select value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })} className="border-0 border-b border-ink/30 bg-transparent py-1 pr-6 text-[13px] text-ink outline-none focus:border-ink" aria-label="Sort products">
                  {sorts.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.label} onClick={c.remove} className="flex items-center gap-2 rounded-full border border-brand/25 bg-white px-3 py-1.5 text-[12px] hover:border-brand">
                  {c.label}
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button onClick={clearAll} className="px-2 text-[12px] text-ink/60 underline underline-offset-4 hover:text-ink">Clear all</button>
            </div>
          )}

          <p className="mb-6 text-sm text-ink/55" aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>

          {results.length === 0 ? (
            <div className="rounded-3xl bg-blush/60 py-24 text-center">
              {categoryHasStock ? (
                <>
                  <h2 className="text-3xl">No pieces match these filters</h2>
                  <p className="mt-2 text-sm text-ink/60">Try widening the price range or removing a filter.</p>
                  <button onClick={clearAll} className="btn-outline mt-7">Clear all filters</button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl">New {filters.category} arriving soon</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">Kriti is putting the finishing touches on this collection. Meanwhile, explore the suits.</p>
                  <Link href="/shop?category=Suits" className="btn-primary mt-7">Shop suits</Link>
                </>
              )}
            </div>
          ) : (
            <div className={`grid gap-x-5 gap-y-10 ${gridClass}`}>
              {results.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-brand/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-blush-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-blush px-5 py-4">
              <h2 className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em]">Filters</h2>
              <button onClick={() => setDrawer(false)} aria-label="Close filters" className="p-1">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">{panel}</div>
            <div className="flex gap-3 border-t border-blush bg-blush-50 p-4">
              <button onClick={clearAll} className="btn-outline flex-1 !px-4 !py-3.5">Clear</button>
              <button onClick={() => setDrawer(false)} className="btn-primary flex-[2] !px-4 !py-3.5">Show {results.length} pieces</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
