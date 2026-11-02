import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-6xl font-semibold">Page not found</h1>
      <p className="mt-4 text-ink/60">The page you are looking for has moved or does not exist.</p>
      <Link href="/shop" className="btn-primary mt-8">Back to shop</Link>
    </div>
  );
}
