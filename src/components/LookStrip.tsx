import Link from "next/link";
import type { Product } from "@/lib/products";

function Row({ items, reverse }: { items: Product[]; reverse?: boolean }) {
  return (
    <div className="group/row flex w-max gap-4" style={{ animation: `${reverse ? "strip-rev" : "strip"} 60s linear infinite` }}>
      {[0, 1].map((k) => (
        <div key={k} className="flex gap-4" aria-hidden={k === 1}>
          {items.map((p) => (
            <Link
              key={p.slug + k}
              href={`/product/${p.slug}`}
              tabIndex={k === 1 ? -1 : 0}
              className="relative block h-64 w-48 shrink-0 overflow-hidden rounded-2xl bg-surface transition duration-500 hover:-translate-y-2 hover:ring-2 hover:ring-brand md:h-80 md:w-60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 hover:scale-110" />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Lookbook strip: two rows of product photos drifting in opposite directions. Pauses on hover. */
export default function LookStrip({ products }: { products: Product[] }) {
  const half = Math.ceil(products.length / 2);
  return (
    <div className="strip-wrap space-y-4 overflow-hidden py-12">
      <Row items={products.slice(0, half)} />
      <Row items={products.slice(half)} reverse />
    </div>
  );
}
