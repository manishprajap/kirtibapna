import { Reveal } from "./motion";
import { platforms } from "@/lib/site";

/**
 * "We're available on" list. Edit the rows in src/lib/site.ts (`platforms`).
 */
export default function AvailableOn() {
  return (
    <section className="container-x pt-32 md:pt-48">
      <Reveal>
        <p className="eyebrow">We’re available on</p>
      </Reveal>
      <ul className="mt-10 border-t border-white/10">
        {platforms.map((p, i) => (
          <li key={p.name} className="border-b border-white/10">
            <Reveal delay={i * 100}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-7 transition-all duration-500 hover:bg-white/[0.04] hover:px-6 md:py-10"
              >
                <span className="font-display text-[clamp(1.8rem,4.4vw,3.4rem)] uppercase leading-none tracking-tight text-white transition group-hover:text-brand-light">
                  {p.name}
                </span>
                <span className="ml-auto hidden text-sm text-white/50 sm:block">{p.handle}</span>
                <span className="text-3xl text-white/60 transition group-hover:translate-x-2 group-hover:text-brand">↗</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
