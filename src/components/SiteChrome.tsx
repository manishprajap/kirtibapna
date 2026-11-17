"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Fx from "./Fx";
import Footer from "./Footer";
import Header from "./Header";
import NewsletterPopup from "./NewsletterPopup";
import Preloader from "./Preloader";

/** Wraps every storefront page with the shared chrome. The admin area gets none of it (and a light palette). */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <div className="admin-canvas">{children}</div>;

  return (
    <>
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}.mask>span{transform:none!important}.curtain{clip-path:none!important}.curtain>*{transform:none!important}`}</style>
      </noscript>
      <Preloader />
      <Fx />
      <Suspense fallback={<div className="h-[76px] border-b border-neutral-200 bg-white" />}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <NewsletterPopup />
    </>
  );
}
