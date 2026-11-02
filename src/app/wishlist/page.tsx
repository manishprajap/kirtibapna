"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/components/WishlistProvider";
import { getProduct, Product } from "@/lib/products";

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const items = slugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);

  if (items.length === 0) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-5xl font-semibold">Your wishlist is empty</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/60">Tap the heart on any piece you love and it will be saved here.</p>
        <Link href="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="mb-10 text-center text-5xl font-semibold">Wishlist</h1>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
