/** Old kritibapna.com category URLs keep working */
const slugs = {
  suits: "Suits",
  lehengas: "Lehengas",
  sarees: "Sarees",
  "co-ord-sets": "Co-ord Sets",
  "formal-sets": "Formal Sets",
  dresses: "Dresses",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return Object.entries(slugs).flatMap(([slug, name]) => [
      { source: `/product-category/${slug}`, destination: `/shop?category=${encodeURIComponent(name)}`, permanent: false },
      { source: `/product-category/${slug}/`, destination: `/shop?category=${encodeURIComponent(name)}`, permanent: false },
    ]);
  },
};

export default nextConfig;
