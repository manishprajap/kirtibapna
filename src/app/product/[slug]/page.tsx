import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductTabs from "@/components/ProductTabs";
import { discountPercent, formatPrice, getGallery, getProduct, getRelated, products } from "@/lib/products";
import { site } from "@/lib/site";

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
  const index = products.findIndex((p) => p.slug === product.slug);
  const prev = products[index - 1];
  const next = products[index + 1];
  const sku = `KB${String(index + 1).padStart(3, "0")}`;
  const categories = [product.category, ...(product.alsoIn ?? [])];
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${product.name} – ${site.name}`)}`;

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <nav className="text-xs uppercase tracking-widest text-ink/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/shop" className="hover:text-brand">Shop</Link> /{" "}
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand">{product.category}</Link>
        </nav>
        <div className="flex items-center gap-3 text-ink/60">
          {prev && <Link href={`/product/${prev.slug}`} aria-label={`Previous: ${prev.name}`} title={prev.name} className="hover:text-brand">‹</Link>}
          <Link href="/shop" aria-label="All products" className="hover:text-brand">▦</Link>
          {next && <Link href={`/product/${next.slug}`} aria-label={`Next: ${next.name}`} title={next.name} className="hover:text-brand">›</Link>}
        </div>
      </div>

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
                <span className="text-sm font-medium text-emerald-400">{discountPercent(product)}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes</p>

          <div className="mt-8 border-t border-blush pt-8">
            <AddToCart product={product} />
          </div>

          <dl className="mt-8 space-y-3 border-t border-blush pt-6 text-sm">
            <div className="flex gap-2"><dt className="font-semibold text-ink">SKU:</dt><dd className="text-ink/70">{sku}</dd></div>
            <div className="flex flex-wrap gap-x-1">
              <dt className="font-semibold text-ink">Categories:</dt>
              <dd className="text-ink/70">
                {categories.map((c, i) => (
                  <span key={c}>
                    <Link href={`/shop?category=${encodeURIComponent(c)}`} className="hover:text-brand">{c}</Link>
                    {i < categories.length - 1 && ", "}
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="font-semibold text-ink">Share:</dt>
              <dd>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="text-ink/70 hover:text-brand">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21Z" />
                    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-.9-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.9-1.8L9 9.5Z" />
                  </svg>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ProductTabs
        description={product.description}
        details={[
          ...(product.fabric ? [["Fabric", product.fabric]] : []),
          ["Colour", product.colors.map((c) => c.name).join(", ")],
          ["Sizes", [...product.sizes, ...(product.sizes.length > 1 ? ["Custom Tailored"] : [])].join(", ")],
          ["Care", product.care],
          ["Shipping", "Free above ₹1,999. Dispatched within 2 working days."],
          ["Returns", "7-day easy returns & exchanges on unused items."],
        ]}
      />

      <section className="pt-24">
        <h2 className="mb-10 text-center text-4xl font-semibold">Related products</h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}