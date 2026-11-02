import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop suits, lehengas, sarees, co-ord sets, formal sets and dresses by Kriti Bapna.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-center text-ink/50">Loading collection…</div>}>
      <ShopClient />
    </Suspense>
  );
}
