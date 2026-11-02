# Kriti Bapna – Ladies Fashion (Next.js store)

A modern, custom-built clothing e-commerce website (no Shopify) using **Next.js 14 (App Router)**, **React 18**, **TypeScript** and **Tailwind CSS**.
Theme: **pink & white**.

## Features
- Clean **Kriti Bapna logo** (pink "KB" monogram + wordmark) and favicon
- Real ladies' wear photos (free Unsplash stock) on every product; an illustration is shown only if a photo fails to load
- Home, Shop (category / price / sort / search), Product, Cart, Checkout, About, Contact pages
- Cart saved in the browser (localStorage), free-shipping progress bar
- Order API route (`/api/orders`) ready for Razorpay / Stripe

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Production
```bash
npm run build
npm start
```
Deploy free on **Vercel**, or any Node host.

## Customise
| What | Where |
|------|-------|
| Products, prices, categories | `src/lib/products.ts` |
| Your own product photos | Save the file in `public/products/` and set `image: "/products/<slug>.jpg"` for that product in `src/lib/products.ts` |
| Theme colours (pink / white) | `tailwind.config.ts` (`brand`, `accent`, `blush`) |
| Logo | `src/components/Logo.tsx` and `src/app/icon.svg` |
| Phone / address / email | `src/components/Footer.tsx`, `src/app/contact/page.tsx` |
| Payments & order saving | `src/app/api/orders/route.ts` |

## Before going live
1. Replace the stock photos with photos of your own products (customers must see exactly what they buy).
2. Replace the About page text with your own story, and add real customer reviews when you have them.
3. Connect a database instead of `products.ts`.
4. Integrate **Razorpay** (UPI/cards) in `/api/orders` – checkout is a demo until you do.
