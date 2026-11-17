import type { Category, Product } from "@/lib/products";
import { categories as staticCategories, products as staticProducts } from "@/lib/products";
import { getAdminCatalog } from "@/lib/db/catalog";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  parentId: string | null;
  active: boolean;
  sortOrder: number;
}

export interface StoreCatalog {
  products: Product[];
  categories: StoreCategory[];
}

const fallbackCatalog: StoreCatalog = {
  products: staticProducts,
  categories: staticCategories.map((category, sortOrder) => ({
    id: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: category.name,
    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    blurb: category.blurb,
    parentId: null,
    active: true,
    sortOrder,
  })),
};

export async function getStoreCatalog(): Promise<StoreCatalog> {
  if (!process.env.DATABASE_URL) return fallbackCatalog;
  const catalog = await getAdminCatalog();
  if (catalog.products.length === 0) return fallbackCatalog;

  const products = catalog.products.map((product) => ({ ...product, category: product.category as Category }));
  return { products, categories: catalog.categories };
}