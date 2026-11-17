import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

export const runtime = "nodejs";
type Context = { params: { id: string } };
const makeSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function PATCH(request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let input: { name?: string; slug?: string; blurb?: string; parentId?: string | null; active?: boolean };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [current] = await db.select().from(categories).where(eq(categories.id, params.id)).limit(1);
    if (!current) return NextResponse.json({ error: "Category not found." }, { status: 404 });

    const name = input.name?.trim() || current.name;
    const slug = makeSlug(input.slug?.trim() || name);
    const parentId = input.parentId === undefined ? current.parentId : input.parentId || null;
    if (name.length > 120 || slug.length > 150 || parentId === params.id) return NextResponse.json({ error: "Invalid category name, URL or parent." }, { status: 400 });

    if (parentId) {
      const allCategories = await db.select({ id: categories.id, parentId: categories.parentId }).from(categories);
      const byId = new Map(allCategories.map((item) => [item.id, item.parentId]));
      if (!byId.has(parentId)) return NextResponse.json({ error: "Parent category was not found." }, { status: 400 });
      let ancestor: string | null | undefined = parentId;
      while (ancestor) {
        if (ancestor === params.id) return NextResponse.json({ error: "A category cannot be moved inside its own child." }, { status: 400 });
        ancestor = byId.get(ancestor);
      }
    }

    const [duplicate] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.slug, slug), ne(categories.id, params.id))).limit(1);
    if (duplicate) return NextResponse.json({ error: "That category URL already exists." }, { status: 409 });

    await db.update(categories).set({ name, slug, blurb: input.blurb?.trim().slice(0, 255) ?? current.blurb, parentId, active: input.active ?? current.active, updatedAt: new Date() }).where(eq(categories.id, params.id));
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Category update failed", error);
    return NextResponse.json({ error: "Could not update category." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const [child] = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, params.id)).limit(1);
    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.categoryId, params.id)).limit(1);
    if (child || product) return NextResponse.json({ error: "Move or remove child categories and products before deleting this category." }, { status: 409 });
    await db.delete(categories).where(eq(categories.id, params.id));
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Category delete failed", error);
    return NextResponse.json({ error: "Could not delete category." }, { status: 500 });
  }
}