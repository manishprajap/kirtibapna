"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Logo from "./Logo";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";

const nav = [
  { href: "/about", label: "About Us" },
  { href: "/shop?category=Suits", label: "Suits" },
  { href: "/shop?category=Lehengas", label: "Lehengas" },
  { href: "/shop?category=Sarees", label: "Sarees" },
  { href: "/shop?category=Co-ord%20Sets", label: "Co-ord Sets" },
  { href: "/shop?category=Formal%20Sets", label: "Formal Sets" },
  { href: "/shop?category=Dresses", label: "Dresses" },
  
];

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function Header() {
  const { count } = useCart();
  const { slugs: wished } = useWishlist();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setOpen(false);
    setQ("");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blush bg-white/90 backdrop-blur-md">
      <div className="bg-brand-dark text-white">
        <p className="container-x py-2 text-center text-[11px] tracking-[0.2em] uppercase">
          Free shipping above ₹1,999 &nbsp;•&nbsp; Easy 7-day returns &nbsp;•&nbsp; Handpicked textiles
        </p>
      </div>

      <div className="container-x flex h-20 items-center justify-between gap-4">
        <button
          className="rounded-full p-2 hover:bg-blush lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Icon d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} className="h-6 w-6" />
        </button>

        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="relative text-sm tracking-wide text-ink/80 transition hover:text-brand after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="rounded-full p-2.5 hover:bg-blush" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <Icon d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
          </button>
          <Link href="/wishlist" className="relative rounded-full p-2.5 hover:bg-blush" aria-label={`Wishlist, ${wished.length} items`}>
            <Icon d="M12 20s-7-4.4-9-9.2C1.8 7.6 3.9 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.1 0 5.2 3.1 4 6.3-2 4.800-9 9.200-9 9.200Z" />
            {wished.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {wished.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative rounded-full p-2.5 hover:bg-blush" aria-label={`Cart, ${count} items`}>
            <Icon d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={onSearch} className="border-t border-blush bg-white">
          <div className="container-x flex items-center gap-3 py-3">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search kurta sets, kaftans, sharara…"
              className="input"
              aria-label="Search products"
            />
            <button className="btn-primary !py-3">Search</button>
          </div>
        </form>
      )}

      {open && (
        <nav className="border-t border-blush bg-white lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-blush/70 py-3.5 text-base text-ink/80 last:border-0">
                {n.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="py-3.5 text-base text-ink/80">
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
