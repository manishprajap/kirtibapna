"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";

type NavItem = { label: string; href: string; cat?: string };

/** Category names match the store catalogue (and the admin panel). */
const nav: NavItem[] = [
  { label: "Shop All", href: "/shop", cat: "All" },
  { label: "Sarees", href: "/shop?category=Sarees", cat: "Sarees" },
  { label: "Suits", href: "/shop?category=Suits", cat: "Suits" },
  { label: "Co-ord Sets", href: "/shop?category=Co-ord%20Sets", cat: "Co-ord Sets" },
  { label: "Dresses", href: "/shop?category=Dresses", cat: "Dresses" },
  { label: "Formal Sets", href: "/shop?category=Formal%20Sets", cat: "Formal Sets" },
  { label: "Lehengas", href: "/shop?category=Lehengas", cat: "Lehengas" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
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
  const pathname = usePathname();
  const params = useSearchParams();
  const ref = useRef<HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  // Keep --hh in sync with the real header height (used by the hero and the pinned collection).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--hh", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("load", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", set);
    };
  }, []);

  const category = params.get("category") ?? "All";
  const isActive = (n: NavItem) => {
    if (n.cat) return pathname === "/shop" && category === n.cat;
    return pathname === n.href;
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setQ("");
  };

  const iconBtn = "relative rounded-full p-2 text-neutral-800 transition hover:bg-neutral-100 hover:text-brand";
  const badge =
    "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white";

  return (
    <header ref={ref} className="sticky top-0 z-[70] border-b border-neutral-200 bg-white text-neutral-800">
      <div className="container-x relative flex flex-col items-center gap-1 py-2.5 xl:h-[76px] xl:flex-row xl:justify-between xl:gap-8 xl:py-0">
        <Link href="/" aria-label="Kirti Bapna – Home" className="inline-flex shrink-0 items-center self-start sm:self-center xl:self-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kirti Bapna" className="h-8 w-auto max-w-[55vw] sm:h-9" />
        </Link>

        <nav aria-label="Main" className="no-scrollbar w-full sm:w-auto max-w-full overflow-x-auto sm:overflow-visible">
          <ul className="flex items-center gap-x-5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-800 sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-0 sm:text-[12px] sm:tracking-[0.14em] xl:flex-nowrap xl:gap-x-7">
            {nav.map((n) => {
              const on = isActive(n);
              return (
                <li key={n.label}>
                  <Link
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    className={`nav-link block py-1.5 sm:py-2 ${on ? "active" : ""}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute right-3 top-2 flex items-center sm:right-6 xl:static xl:ml-0">
          <button className={iconBtn} onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" aria-expanded={searchOpen}>
            <Icon d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
          </button>
          <Link href="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wished.length} items`}>
            <Icon d="M12 20s-7-4.4-9-9.2C1.8 7.6 3.9 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.1 0 5.2 3.1 4 6.3-2 4.8-9 9.2-9 9.2Z" />
            {wished.length > 0 && <span className={badge}>{wished.length}</span>}
          </Link>
          <Link href="/cart" className={iconBtn} aria-label={`Cart, ${count} items`}>
            <Icon d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0" />
            {count > 0 && <span className={badge}>{count}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={onSearch} className="border-t border-neutral-200 bg-white">
          <div className="container-x flex items-center gap-3 py-3">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search kurta sets, kaftans, sharara…"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand"
              aria-label="Search products"
            />
            <button className="btn-primary !py-3">Search</button>
          </div>
        </form>
      )}
    </header>
  );
}
