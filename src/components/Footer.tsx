import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer mt-24 bg-brand-dark text-white/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo variant="light" />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            Designer womenswear by Kriti Bapna — vintage elegance with a modern twist, delivered to your doorstep.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent-light">Shop</h4>
          <ul className="space-y-3 text-sm">
            {["Suits", "Lehengas", "Sarees", "Co-ord Sets", "Formal Sets", "Dresses"].map((c) => (
              <li key={c}>
                <Link href={`/shop?category=${encodeURIComponent(c)}`} className="transition hover:text-accent-light">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent-light">Help</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="transition hover:text-accent-light">Our Story</Link></li>
            <li><Link href="/contact" className="transition hover:text-accent-light">Contact Us</Link></li>
            <li><Link href="/cart" className="transition hover:text-accent-light">Your Cart</Link></li>
            <li><span className="text-white/60">7-day easy returns</span></li>
            <li><span className="text-white/60">Cash on delivery</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-luxe text-accent-light">Visit & Call</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li>Kriti Bapna</li>
            <li>Andheri West, Mumbai – 400053</li>
            <li><a href="tel:+919594494123" className="hover:text-accent-light">+91 95944 94123</a></li>
            <li><a href="mailto:info@kritibapna.com" className="hover:text-accent-light">info@kritibapna.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Kriti Bapna. All rights reserved.</p>
          <p className="tracking-widest uppercase">Made in India</p>
        </div>
      </div>
    </footer>
  );
}
