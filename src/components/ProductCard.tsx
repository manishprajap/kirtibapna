"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { discountPercent, formatPrice, Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[22px] w-[22px]",
  "aria-hidden": true,
};

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const router = useRouter();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.slug);
  const href = `/product/${product.slug}`;
  const singleSize = product.sizes.length === 1;

  // Sized pieces need a size choice, so the cart icon opens the product page (like the original site).
  const onCart = () => {
    if (singleSize) {
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: product.sizes[0],
        color: product.colors[0].name,
        qty: 1,
        palette: product.palette,
      });
      router.push("/cart");
    } else {
      router.push(href);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-blush bg-white p-2.5 transition-colors duration-300 hover:border-brand/60">
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-2xl">
          <ProductImage
            slug={product.slug}
            name={product.name}
            palette={product.palette}
            hoverImage
            className="aspect-[3/4] w-full rounded-2xl"
          />
          {product.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-brand shadow-sm">
              {product.tag}
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1.5 px-1">
          <p className="text-[11px] uppercase tracking-widest text-ink/50">{product.category}</p>
          <h3 className="font-display text-lg leading-snug text-ink">{product.name}</h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-brand">{formatPrice(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-sm text-ink/40 line-through">{formatPrice(product.mrp)}</span>
                <span className="text-xs font-medium text-emerald-700">
                  You save {formatPrice(product.mrp - product.price)} ({off}%)
                </span>
              </>
            )}
          </div>
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/15"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      </Link>

      {/* Hover actions: add to cart + wishlist (always visible on touch screens) */}
      <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex aspect-[3/4] items-end justify-center pb-0">
        <div className="pointer-events-auto flex translate-y-2 items-center bg-white opacity-100 shadow-sm transition duration-300 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            onClick={onCart}
            aria-label={singleSize ? `Add ${product.name} to cart` : `Select options for ${product.name}`}
            title={singleSize ? "Add to cart" : "Select options"}
            className="flex h-12 w-12 items-center justify-center text-ink transition hover:text-brand"
          >
            <svg {...iconProps}>
              <path d="M2.5 4h2.6l2.1 10.2h10.4l2.1-7.4H6" />
              <circle cx="9" cy="19" r="1.3" />
              <circle cx="17" cy="19" r="1.3" />
            </svg>
          </button>
          <button
            onClick={() => toggle(product.slug)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            title={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-12 w-12 items-center justify-center transition hover:text-brand ${wished ? "text-brand" : "text-ink"}`}
          >
            <svg {...iconProps} fill={wished ? "currentColor" : "none"}>
              <path d="M12 20s-7-4.4-9-9.2C1.8 7.6 3.9 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.1 0 5.2 3.1 4 6.3-2 4.8-9 9.2-9 9.2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
