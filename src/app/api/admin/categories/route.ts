import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export const runtime = "nodejs";

const makeSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function POST(request: Request) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let input: { name?: string; slug?: string; blurb?: string; parentId?: string | null };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = input.name?.trim();
  const slug = makeSlug(input.slug?.trim() || name || "");
  if (!name || name.length > 120 || !slug || slug.length > 150) return NextResponse.json({ error: "Enter a valid category name and slug." }, { status: 400 });

  try {
    const db = getDb();
    if (input.parentId) {
      const [parent] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, input.parentId)).limit(1);
      if (!parent) return NextResponse.json({ error: "Parent category was not found." }, { status: 400 });
    }
    const [existing] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
    if (existing) return NextResponse.json({ error: "That category URL already exists." }, { status: 409 });

    const id = randomUUID();
    await db.insert(categories).values({ id, name, slug, blurb: input.blurb?.trim().slice(0, 255) ?? "", parentId: input.parentId || null });
    const [created] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Category create failed", error);
    return NextResponse.json({ error: "Could not create category." }, { status: 500 });
  }
}