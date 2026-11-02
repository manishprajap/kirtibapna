"use client";

import { useEffect, useState } from "react";

/**
 * "We're available on" strip.
 * Edit this list: `name`, `href` (store / profile link) and `logo`
 * (file placed in /public/platforms). If a logo file is missing, the name is shown as text.
 */
export const platforms: { name: string; href: string; logo: string }[] = [
  { name: "Nykaa Fashion", href: "https://www.nykaafashion.com/", logo: "/platforms/nykaa-fashion.png" },
  { name: "Pernia's Pop-Up Shop", href: "https://www.perniaspopupshop.com/", logo: "/platforms/pernias-pop-up-shop.png" },
  { name: "Indya", href: "https://www.indyaa.com/", logo: "/platforms/indya.png" },
  { name: "Aza Fashions", href: "https://www.azafashions.com/", logo: "/platforms/aza-fashions.png" },
];

function Logo({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(true); // show the name until the logo file is confirmed to exist

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setFailed(false);
    probe.onerror = () => setFailed(true);
    probe.src = logo;
  }, [logo]);
  if (failed) {
    return <span className="font-display text-2xl font-semibold text-brand-dark">{name}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo} alt={name} className="max-h-14 w-auto max-w-[10rem] object-contain" />
  );
}

export default function AvailableOn() {
  return (
    <section className="container-x pt-24">
      <div className="rounded-3xl border border-blush bg-white px-6 py-12 text-center sm:px-12">
        <p className="eyebrow">Find Kriti Bapna everywhere</p>
        <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">We’re available on</h2>
        <ul className="mt-10 grid grid-cols-2 items-center gap-4 sm:grid-cols-4">
          {platforms.map((p) => (
            <li key={p.name}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-24 items-center justify-center rounded-2xl border border-blush bg-white px-4 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <Logo name={p.name} logo={p.logo} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
