import { z } from "zod";

const productInputSchema = z.object({
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(255),
  categoryId: z.string().uuid(),
  alsoIn: z.array(z.string().trim().min(1).max(120)).default([]),
  price: z.number().int().positive(),
  mrp: z.number().int().positive(),
  fabric: z.string().trim().max(160).optional().nullable(),
  description: z.string().trim().min(1),
  colors: z.array(z.object({ name: z.string().trim().min(1).max(60), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) })).min(1),
  sizes: z.array(z.string().trim().min(1).max(30)).min(1),
  palette: z.tuple([z.string().regex(/^#[0-9a-fA-F]{6}$/), z.string().regex(/^#[0-9a-fA-F]{6}$/)]),
  tag: z.enum(["New", "Bestseller", "Sale"]).optional().nullable(),
  featured: z.boolean().default(false),
  soldOut: z.boolean().default(false),
  care: z.string().trim().min(1),
  image: z.string().trim().min(1).max(500).refine((path) => path.startsWith("/products/") && !path.includes("..")),
  images: z.array(z.string().trim().min(1).max(500).refine((path) => path.startsWith("/products/") && !path.includes(".."))).default([]),
}).refine((product) => product.mrp >= product.price, { message: "MRP must be equal to or greater than the selling price.", path: ["mrp"] });

export function parseProductInput(value: unknown) {
  return productInputSchema.safeParse(value);
}