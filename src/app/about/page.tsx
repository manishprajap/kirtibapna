import Link from "next/link";
import type { Metadata } from "next";
import OwnerPhoto from "@/components/OwnerPhoto";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Meet Kriti Bapna — a NIFT-trained designer from Kota with a love for vintage elegance and a modern twist.",
};

const values = [
  { t: "Chosen with care", d: "Every piece is picked for its fabric, finish and how it feels to wear." },
  { t: "Made to be worn", d: "Beautiful clothing should be comfortable, flattering and easy to style." },
  { t: "Fair & friendly", d: "Honest prices, easy returns and a team that is always happy to help." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blush-50 via-white to-blush">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">Meet the designer</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              Vintage elegance, with a <span className="italic text-brand">modern twist</span>
            </h1>
            <p className="mt-6 max-w-lg text-ink/70">
              Hi, I’m Kriti Bapna. Every piece in this store is designed for women who love grace in what they wear —
              from everyday suit sets and co-ords to dresses, sarees and lehengas for the big occasions.
            </p>
            <Link href="/shop" className="btn-primary mt-8">Explore my collection</Link>
          </div>
          <div className="mx-auto w-full max-w-xs">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[10rem] rounded-b-3xl bg-blush ring-8 ring-white shadow-xl shadow-brand/15">
              <OwnerPhoto className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-relaxed text-ink/75">
          <p>
            I grew up in Kota, a small town in Rajasthan, with a quiet but lifelong fascination for fashion. That
            curiosity took me to Kolkata, where I studied Fashion Design at NIFT and learned how a single idea becomes
            a garment someone loves to wear.
          </p>
          <p>
            Today that passion lives in every collection — from the Phulwari, Bloom and Safari edits to the 9to9
            collection. Each piece blends a vintage sense of elegance with a modern twist, and is made for the woman
            who wants to feel like herself.
          </p>
        </div>
        <div className="grid gap-5">
          {values.map((v) => (
            <div key={v.t} className="rounded-3xl border border-blush bg-white p-7">
              <h3 className="text-2xl font-semibold text-brand">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
