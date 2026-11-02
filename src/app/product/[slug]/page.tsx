import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { discountPercent, formatPrice, getGallery, getProduct, getRelated, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = getRelated(product);

  return (
    <div className="container-x py-10">
      <nav className="mb-8 text-xs uppercase tracking-widest text-ink/50" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/shop" className="hover:text-brand">Shop</Link> /{" "}
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand">{product.category}</Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery
          images={getGallery(product)}
          name={product.name}
          category={product.category}
          palette={product.palette}
        />

        <div className="lg:py-4">
          {product.tag && (
            <span className="mb-4 inline-block rounded-full bg-blush px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-brand">
              {product.tag}
            </span>
          )}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
          {product.fabric && <p className="mt-2 text-sm text-ink/55">{product.fabric}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-brand">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink/40 line-through">{formatPrice(product.mrp)}</span>
                <span className="text-sm font-medium text-emerald-700">{discountPercent(product)}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes</p>

          <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>

          <div className="mt-8 border-t border-blush pt-8">
            <AddToCart product={product} />
          </div>

          <div className="mt-10 divide-y divide-blush rounded-2xl border border-blush bg-white">
            {[
              ...(product.fabric ? [["Fabric", product.fabric]] : []),
              ["Care", product.care],
              ["Shipping", "Free above ₹1,999. Dispatched within 2 working days."],
              ["Returns", "7-day easy returns & exchanges on unused items."],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-4 text-sm">
                <span className="font-medium text-brand">{k}</span>
                <span className="text-ink/70">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="pt-24">
        <h2 className="mb-10 text-center text-4xl font-semibold">You may also love</h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
