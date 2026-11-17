import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { categories as initialCategories, products as initialProducts, Product } from "@/lib/products";
import { getDb } from "./index";
import { categories, products } from "./schema";

export type AdminCategory = typeof categories.$inferSelect;
export type AdminProduct = Product & { id: string; categoryId: string; subcategory?: string };

export async function getAdminCatalog() {
  const db = getDb();
  const categoryRows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  const productRows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(products.name));
  const categoryById = new Map(categoryRows.map((category) => [category.id, category]));

  const mappedProducts: AdminProduct[] = productRows.flatMap(({ product, category }) => {
    if (!category) return [];
    const parent = category.parentId ? categoryById.get(category.parentId) : undefined;
    return [{
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: (parent?.name ?? category.name) as Product["category"],
      categoryId: category.id,
      subcategory: parent ? category.name : undefined,
      alsoIn: product.alsoIn as Product["alsoIn"],
      price: product.price,
      mrp: product.mrp,
      fabric: product.fabric ?? undefined,
      description: product.description,
      colors: product.colors,
      sizes: product.sizes,
      palette: product.palette,
      tag: product.tag ?? undefined,
      featured: product.featured,
      soldOut: product.soldOut,
      care: product.care,
      image: product.image,
      images: product.images,
    }];
  });

  return { categories: categoryRows, products: mappedProducts };
}

export async function seedInitialCatalog() {
  const db = getDb();

  for (const [index, category] of initialCategories.entries()) {
    await db.insert(categories).values({
      id: randomUUID(),
      name: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      blurb: category.blurb,
      sortOrder: index,
    }).onDuplicateKeyUpdate({ set: { name: category.name, blurb: category.blurb, sortOrder: index, updatedAt: new Date() } });
  }

  const categoryRows = await db.select().from(categories);
  const categoryIds = new Map(categoryRows.map((category) => [category.name, category.id]));

  for (const product of initialProducts) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) continue;
    await db.insert(products).values({
      id: randomUUID(),
      slug: product.slug,
      name: product.name,
      categoryId,
      alsoIn: product.alsoIn ?? [],
      price: product.price,
      mrp: product.mrp,
      fabric: product.fabric ?? null,
      description: product.description,
      colors: product.colors,
      sizes: product.sizes,
      palette: product.palette,
      tag: product.tag ?? null,
      featured: product.featured ?? false,
      soldOut: product.soldOut ?? false,
      care: product.care,
      image: product.image,
      images: product.images ?? [],
    }).onDuplicateKeyUpdate({
      set: {
        name: product.name,
        categoryId,
        alsoIn: product.alsoIn ?? [],
        price: product.price,
        mrp: product.mrp,
        fabric: product.fabric ?? null,
        description: product.description,
        colors: product.colors,
        sizes: product.sizes,
        palette: product.palette,
        tag: product.tag ?? null,
        featured: product.featured ?? false,
        soldOut: product.soldOut ?? false,
        care: product.care,
        image: product.image,
        images: product.images ?? [],
        updatedAt: new Date(),
      },
    });
  }
}