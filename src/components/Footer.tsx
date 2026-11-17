import Link from "next/link";
import { site } from "@/lib/site";

const shop = ["Sarees", "Suits", "Co-ord Sets", "Dresses", "Formal Sets", "Lehengas"];

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10 bg-night">
      <div className="container-x grid gap-12 pb-10 pt-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Link href="/" aria-label="Kirti Bapna – Home" className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Kirti Bapna" className="brightness-0 invert" style={{ height: 32, width: "auto" }} />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Sarees, kurta sets, co-ord sets, dresses and more for women — vintage elegance with a modern twist.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent">Shop</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {shop.map((c) => (
              <li key={c}>
                <Link href={`/shop?category=${encodeURIComponent(c)}`} className="link-u hover:text-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent">Help</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/about" className="link-u hover:text-white">Our Story</Link></li>
            <li><Link href="/contact" className="link-u hover:text-white">Contact Us</Link></li>
            <li><Link href="/cart" className="link-u hover:text-white">Your Cart</Link></li>
            <li><Link href="/wishlist" className="link-u hover:text-white">Wishlist</Link></li>
            <li><span className="text-white/50">7-day easy returns</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent">Reach us</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li>{site.address}</li>
            <li><a href={site.phoneHref} className="link-u hover:text-white">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="link-u hover:text-white">{site.email}</a></li>
            <li>
              <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className="link-u hover:text-white">
                Instagram · @{site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p aria-hidden="true" className="text-outline-shine select-none whitespace-nowrap px-4 text-center font-display text-[clamp(3rem,14.5vw,15rem)] leading-[0.85] tracking-tight">
        KIRTI BAPNA
      </p>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Kirti Bapna. All rights reserved.</p>
          <p className="italic">“Dress the way you want to be remembered.”</p>
        </div>
      </div>
    </footer>
  );
}
