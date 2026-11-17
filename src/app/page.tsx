import Link from "next/link";
import AvailableOn from "@/components/AvailableOn";
import ContactSection from "@/components/ContactSection";
import HeroSlider from "@/components/HeroSlider";
import HomeShop from "@/components/HomeShop";
import HorizontalShowcase from "@/components/HorizontalShowcase";
import LookStrip from "@/components/LookStrip";
import NewsletterForm from "@/components/NewsletterForm";
import { Curtain, MaskLines, Reveal, ScrollWords } from "@/components/motion";
import { getProduct, Product, products } from "@/lib/products";
import { site } from "@/lib/site";

const chapters = [
  {
    cat: "Sarees",
    slug: "pink-viscose-organza-mirror-embroidered-saree-set",
    lines: ["Six yards", "of heirloom."],
    text: "Organza drapes with mirror work and soft, luminous finishes — made to be worn once and remembered for years.",
    bg: ["#D81B60", "#880E4F"],
  },
  {
    cat: "Suits",
    slug: "emerald-green-embroidered-kurta-set",
    lines: ["Everyday,", "elevated."],
    text: "Embroidered, hand-painted and gota-lined kurta sets. Easy silhouettes, careful finishing and fabrics that move with you.",
    bg: ["#2E8B6E", "#145C46"],
  },
  {
    cat: "Co-ord Sets",
    slug: "pink-jacket-pant-coord-set",
    lines: ["Modern,", "made to mix."],
    text: "Sharp separates in clean lines and bold colour. Wear them together, or break them apart and style them your way.",
    bg: ["#F48FB1", "#AD1457"],
  },
  {
    cat: "Dresses",
    slug: "band-dress",
    lines: ["Easy, modern,", "entirely you."],
    text: "Brunch, dinner, a night out. Graphic stripes, soft overlays and flowing fabrics for the days you want to feel effortless.",
    bg: ["#C3A8E6", "#7E5FB0"],
  },
] as const;

const collectionSlugs = [
  "band-dress",
  "emerald-green-embroidered-kurta-set",
  "flaired-kurta-with-dhoti-pants",
  "mirror-blouse-and-layered-skirt-lehenga-set",
  "pink-jacket-pant-coord-set",
  "pink-viscose-organza-mirror-embroidered-saree-set",
  "airi-dress",
  "blue-animal-motif-coord-set",
];

const notes = [
  { cat: "Sarees", slug: "taarini-saree-with-jhaalar-blouse", tag: "Draping", title: "How to drape a ready-to-wear saree", bg: ["#D81B60", "#880E4F"] },
  { cat: "Co-ord Sets", slug: "kumo-blouse-with-pants-ivory", tag: "Styling", title: "One co-ord set, three ways to wear it", bg: ["#F48FB1", "#AD1457"] },
  { cat: "Lehengas", slug: "mirror-blouse-and-layered-skirt-lehenga-set", tag: "Occasion", title: "Choosing a look for sangeet night", bg: ["#8E4FA8", "#4B1F63"] },
] as const;

const marquee = ["Organza Sarees", "Kurta Sets", "Co-ord Sets", "Mirror Work", "Kaftans", "Evening Dresses"];

const values = [
  { t: "Chosen with care", d: "Every piece is picked for its fabric, finish and how it feels to wear." },
  { t: "Made to be worn", d: "Beautiful clothing should be comfortable, flattering and easy to style." },
  { t: "Fair & friendly", d: "Honest prices, easy returns and a team that is always happy to help." },
];

const shopLink = (cat: string) => `/shop?category=${encodeURIComponent(cat)}`;

export default function Home() {
  const picks = collectionSlugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  const collection = picks.length >= 8 ? picks : [...picks, ...products.filter((p) => !picks.includes(p))].slice(0, 8);

  return (
    <>
      <HeroSlider />

      <section className="container-x py-32 md:py-52">
        <ScrollWords
          lines={["Every thread", "holds a story —", "we help you", "wear yours."]}
          className="scroll-words font-display text-[clamp(2rem,6vw,5.2rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
        />
      </section>

      {/* Chapters */}
      {chapters.map((c, i) => {
        const p = getProduct(c.slug);
        const imageLeft = i % 2 === 0;
        return (
          <section key={c.cat} className="relative overflow-hidden border-t border-white/10 py-24 md:py-40">
            <span
              aria-hidden="true"
              className="text-outline pointer-events-none absolute -top-4 select-none font-display text-[clamp(7rem,20vw,18rem)] leading-none opacity-40"
              style={imageLeft ? { right: "-1rem" } : { left: "-1rem" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="container-x relative grid items-center gap-12 md:grid-cols-12 md:gap-8">
              <div className={`md:row-start-1 md:col-span-5 ${imageLeft ? "md:col-start-1" : "md:col-start-8"}`}>
                <Reveal>
                  <Curtain>
                    <div
                      className="aspect-[295/384] overflow-hidden rounded-[2rem] bg-surface"
                      style={{ background: `linear-gradient(160deg,${c.bg[0]},${c.bg[1]})` }}
                    >
                      {p && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover object-top" />
                      )}
                    </div>
                  </Curtain>
                </Reveal>
              </div>
              <div className={`md:row-start-1 md:col-span-6 ${imageLeft ? "md:col-start-7" : "md:col-start-1"}`}>
                <Reveal>
                  <p className="eyebrow">Chapter {String(i + 1).padStart(2, "0")} · {c.cat}</p>
                </Reveal>
                <MaskLines
                  as="h2"
                  className="mt-6 font-display text-[clamp(2rem,3.8vw,3.6rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
                  lines={[c.lines[0], c.lines[1]]}
                />
                <Reveal delay={200}>
                  <p className="mt-8 max-w-md text-base leading-relaxed text-white/65">{c.text}</p>
                  <Link href={shopLink(c.cat)} className="link-u group mt-8 inline-flex items-center gap-3 pb-1 text-sm uppercase tracking-[0.2em] text-white">
                    Explore {c.cat} <span className="text-brand transition group-hover:translate-x-2">→</span>
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="container-x border-t border-white/10 py-32 md:py-52">
        <ScrollWords
          lines={["Made with care,", "worn for years."]}
          className="scroll-words font-display text-[clamp(2rem,6vw,5.2rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
        />
      </section>

      <HorizontalShowcase products={collection} />

      <HomeShop />

      {/* Lookbook */}
      <section aria-label="Lookbook" className="border-t border-white/10 pt-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Lookbook</p>
          </Reveal>
          <MaskLines
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.2vw,3.9rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
            lines={["Every look,", <span key="i" className="italic">in motion.</span>]}
          />
        </div>
        <LookStrip products={products} />
      </section>

      <div className="overflow-hidden border-y border-white/10 py-10" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-16">
              {marquee.map((t) => (
                <span key={t + k} className="text-outline-shine font-display text-[clamp(2.2rem,5vw,4.4rem)] uppercase leading-none">
                  {t} <span className="text-brand">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Style notes */}
      <section className="container-x pt-32 md:pt-48">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow">Style notes</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="mt-5 font-display text-[clamp(2rem,4.2vw,3.9rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
              lines={["The journey", "is the reward."]}
            />
          </div>
          <Link href="/shop" className="link-u hidden pb-1 text-sm uppercase tracking-[0.2em] text-white/80 hover:text-white sm:block">
            All pieces →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {notes.map((n, i) => {
            const p = getProduct(n.slug);
            return (
              <Reveal key={n.title} delay={i * 120}>
                <Link href={shopLink(n.cat)} className="group block">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface"
                    style={{ background: `linear-gradient(160deg,${n.bg[0]},${n.bg[1]})` }}
                  >
                    {p && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={n.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top transition duration-[900ms] group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-night/70 px-3 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur">
                      {n.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl leading-snug text-white transition group-hover:text-brand-light">{n.title}</h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* About teaser */}
      <section id="about" className="container-x grid items-center gap-14 pt-32 md:grid-cols-2 md:pt-48">
        <Reveal>
          <div className="relative">
            <Curtain>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/owner.jpg" alt="Kirti Bapna, designer and founder" className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
              </div>
            </Curtain>
            <svg viewBox="0 0 120 120" aria-hidden="true" className="animate-spin-slow absolute -bottom-8 -right-4 h-28 w-28 md:-right-10 md:h-36 md:w-36">
              <defs>
                <path id="owner-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="#E8407A" />
              <text fill="#fff" fontSize="10.5" letterSpacing="3.2" style={{ fontFamily: "var(--font-sans)" }}>
                <textPath href="#owner-ring">DESIGNER ✦ FOUNDER ✦ DESIGNER ✦</textPath>
              </text>
              <text x="60" y="68" textAnchor="middle" fill="#fff" fontSize="22" style={{ fontFamily: "var(--font-display)" }}>KB</text>
            </svg>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">The designer</p>
          </Reveal>
          <MaskLines
            as="h2"
            className="mt-6 font-display text-[clamp(2rem,4.2vw,3.9rem)] font-medium uppercase leading-[0.95] tracking-tight text-white"
            lines={["Vintage elegance,", <span key="i" className="italic">with a modern twist.</span>]}
          />
          <Reveal delay={150}>
            <div className="mt-8 max-w-lg space-y-5 leading-relaxed text-white/70">
              <p>Kirti Bapna grew up in Kota, a small town in Rajasthan. A love of fashion took her to Kolkata, where she studied Fashion Design at NIFT.</p>
              <p>
                Her designs reflect that passion — made for women who like classic elegance with a contemporary update. In her own words:{" "}
                <em className="text-white">“vintage elegance with a modern twist.”</em>
              </p>
            </div>
            <p className="mt-6 text-sm text-white/45">{site.address}</p>
            <Link href="/shop" className="btn-primary mt-8">Explore the collection</Link>
          </Reveal>
        </div>
      </section>

      <section className="container-x pt-24 md:pt-32">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 120} className="h-full">
              <div className="h-full rounded-3xl border border-white/10 bg-surface p-8">
                <p className="text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-display text-3xl uppercase tracking-tight text-white">{v.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <AvailableOn />

      <section id="contact" className="border-t border-white/10 pt-8">
        <ContactSection />
      </section>

      {/* Closing */}
      <section className="container-x pt-32 text-center md:pt-52">
        <MaskLines
          as="h2"
          className="font-display text-[clamp(2.4rem,7vw,6.2rem)] font-medium uppercase leading-[0.9] tracking-tight text-white"
          lines={["Begin", <span key="i" className="italic">your story.</span>]}
        />
        <Reveal delay={200}>
          <Link href="/shop" className="btn-primary mt-12 !px-10 !py-4">Shop the collection</Link>
        </Reveal>
        <div className="mx-auto mt-28 max-w-xl border-t border-white/10 pt-14">
          <Reveal>
            <p className="eyebrow">Stay in the loop</p>
            <p className="mt-3 text-sm text-white/55">New arrivals and festive edits — straight to your inbox.</p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
