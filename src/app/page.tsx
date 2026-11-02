import Link from "next/link";
import Photo from "@/components/Photo";
import AvailableOn from "@/components/AvailableOn";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import { categories, categoryCover, categoryPalette, getProduct, photos, products } from "@/lib/products";

const promises = [
  { title: "Designed by Kriti", text: "Every piece is designed with vintage elegance and a modern twist." },
  { title: "Free Shipping", text: "Complimentary delivery on orders above ₹1,999." },
  { title: "Easy Returns", text: "Not the right fit? Return or exchange within 7 days." },
  { title: "Flexible Payment", text: "Pay by UPI, card or cash on delivery." },
];

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const arrivals = [
    "mirror-blouse-and-layered-skirt-lehenga-set",
    "pink-viscose-organza-mirror-embroidered-saree-set",
    "blue-animal-motif-coord-set",
    "animal-embroidery-a-line-dress",
  ]
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-white to-blush">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-light/50 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blush blur-3xl" />

        <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fadeUp">
            <p className="eyebrow">The new collection</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              Vintage elegance,
              <br />
              <span className="italic text-brand">with a modern twist</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">
              Suits, lehengas, sarees, co-ord sets and dresses for women — designed by Kriti Bapna, a NIFT-trained designer from Kota, with vintage elegance and a modern twist.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">Shop the collection</Link>
              <Link href="/about" className="btn-outline">Meet Kriti</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/65">
              {["Free shipping above ₹1,999", "7-day easy returns", "Cash on delivery"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] text-white">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Showcase */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[14rem] rounded-b-[2rem] bg-blush shadow-2xl shadow-brand/15 ring-8 ring-white">
              <Photo src={photos.hero} alt="Emerald green embroidered kurta set" category="Suits" colors={["#3FBF9F", "#145C46"]} priority className="absolute inset-0 h-full w-full" />
            </div>
            <div className="absolute -left-4 bottom-10 w-28 animate-floaty overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl shadow-brand/20 sm:-left-12 sm:w-36">
              <Photo src={photos.heroLehenga} alt="Georgette brasso kaftan" category="Suits" colors={["#CDBB94", "#6B5B4B"]} className="aspect-[3/4] w-full rounded-xl" />
              <p className="py-1.5 text-center text-[10px] font-medium uppercase tracking-widest text-brand">Kaftans</p>
            </div>
            <div className="absolute -right-3 top-16 w-24 animate-floaty overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl shadow-brand/20 [animation-delay:1.5s] sm:-right-10 sm:w-32">
              <Photo src={photos.heroKurti} alt="Green flared kurta set" category="Suits" colors={["#1F5A4B", "#0F2E27"]} className="aspect-[3/4] w-full rounded-xl" />
              <p className="py-1.5 text-center text-[10px] font-medium uppercase tracking-widest text-brand">Kurta sets</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-brand py-3.5">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-xs uppercase tracking-luxe text-white/90">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12">
              {["Kurta Sets", "Kaftans", "Handpainted Dupattas", "Gota Patti", "Mirror Work", "Sharara Sets", "Festive Edit", "New Arrivals"].map((t) => (
                <span key={t + i}>✦ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="container-x pt-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Shop by category</h2>
          </div>
          <Link href="/shop" className="hidden text-sm text-brand underline-offset-4 hover:underline sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-blush"
            >
              <Photo
                src={getProduct(categoryCover[c.name])?.image}
                alt={c.name}
                category={c.name}
                colors={categoryPalette[c.name]}
                className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/85 to-transparent px-4 pb-4 pt-12">
                <h3 className="text-2xl font-semibold text-brand-dark">{c.name}</h3>
                <p className="mt-0.5 text-xs text-ink/60">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-x pt-24">
        <div className="mb-10 text-center">
          <p className="eyebrow">Most loved</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Bestsellers &amp; signatures</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="container-x pt-24">
        <div className="relative grid items-center overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-brand-dark text-white md:grid-cols-[1.2fr_1fr]">
          <div className="relative px-8 py-14 sm:px-14 sm:py-20">
            <p className="eyebrow !text-accent-light">Festive season</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Dressed for every celebration</h2>
            <p className="mt-4 max-w-md text-white/80">
              From mehndi to reception — statement kurtas, handpainted dupattas and mirror-work sets for the whole season.
            </p>
            <Link href="/shop" className="btn-primary mt-8 !bg-white !text-brand hover:!bg-blush">
              Explore the edit
            </Link>
          </div>
          <div className="relative hidden h-full min-h-[22rem] md:block">
            <Photo src={photos.banner} alt="Red flared kurta with dhoti pants" category="Suits" colors={["#D9262E", "#7A1217"]} className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </section>

      {/* NEW & SALE */}
      <section className="container-x pt-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Just in</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">New arrivals &amp; offers</h2>
          </div>
          <Link href="/shop" className="hidden text-sm text-brand underline-offset-4 hover:underline sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {arrivals.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* PROMISES */}
      <section className="container-x pt-24">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-blush bg-blush sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="bg-white p-8">
              <div className="mb-4 h-1 w-10 rounded-full bg-brand" />
              <h3 className="text-xl font-semibold text-brand-dark">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AVAILABLE ON */}
      <AvailableOn />

      {/* NEWSLETTER */}
      <section className="container-x pt-24">
        <div className="rounded-3xl bg-blush px-6 py-14 text-center sm:px-12">
          <p className="eyebrow">Stay in the loop</p>
          <h2 className="mt-3 text-4xl font-semibold">New arrivals, straight to your inbox</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
            Join the Kriti Bapna list for new drops, festive edits and special offers.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
