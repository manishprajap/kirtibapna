import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminCatalog, seedInitialCatalog } from "@/lib/db/catalog";

export const runtime = "nodejs";

export async function POST() {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  try {
    const current = await getAdminCatalog();
    if (current.products.length > 0) return NextResponse.json({ error: "The catalog is already initialized; seeding again is blocked to protect admin edits." }, { status: 409 });
    await seedInitialCatalog();
    return NextResponse.json({ seeded: true });
  } catch (error) {
    console.error("Catalog seed failed", error);
    return NextResponse.json({ error: "Could not seed catalog. Apply database migrations and try again." }, { status: 500 });
  }
}