"use client";

import { useState } from "react";

/** Description / Additional information tabs under the product. */
export default function ProductTabs({ description, details }: { description: string; details: string[][] }) {
  const [tab, setTab] = useState<"d" | "i">("d");
  const t = (on: boolean) =>
    `border-t-2 px-1 py-5 text-sm font-medium uppercase tracking-wide transition ${on ? "border-brand text-ink" : "border-transparent text-ink/45 hover:text-ink"}`;

  return (
    <section className="mt-20 border-t border-blush">
      <div role="tablist" className="flex justify-center gap-10">
        <button role="tab" aria-selected={tab === "d"} onClick={() => setTab("d")} className={t(tab === "d")}>Description</button>
        <button role="tab" aria-selected={tab === "i"} onClick={() => setTab("i")} className={t(tab === "i")}>Additional information</button>
      </div>
      <div className="mx-auto max-w-3xl py-10 text-sm leading-relaxed text-ink/75">
        {tab === "d" ? (
          <p className="whitespace-pre-line">{description}</p>
        ) : (
          <dl className="divide-y divide-blush border-y border-blush">
            {details.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-3.5">
                <dt className="font-medium text-brand">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}