import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import SiteChrome from "@/components/SiteChrome";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Kirti Bapna – Ladies Fashion | Sarees, Kurta Sets, Co-ords, Dresses",
    template: "%s | Kirti Bapna",
  },
  description:
    "Shop sarees, kurta sets, co-ord sets, dresses and kaftans for women from Kirti Bapna. Vintage elegance with a modern twist.",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body id="top">
        <CartProvider>
          <WishlistProvider>
            <SiteChrome>{children}</SiteChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
