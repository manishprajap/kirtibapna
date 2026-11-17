import { NextResponse } from "next/server";
import { getStoreCatalog } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getStoreCatalog());
  } catch (error) {
    console.error("Public catalog read failed", error);
    return NextResponse.json({ error: "Could not load catalog." }, { status: 500 });
  }
}