import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAdminCatalog } from "@/lib/db/catalog";

export const runtime = "nodejs";

export async function GET() {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  try {
    return NextResponse.json(await getAdminCatalog());
  } catch (error) {
    console.error("Admin catalog read failed", error);
    return NextResponse.json({ error: "Could not load catalog." }, { status: 500 });
  }
}