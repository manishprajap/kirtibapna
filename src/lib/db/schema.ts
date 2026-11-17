import { relations } from "drizzle-orm";
import {
  AnyMySqlColumn,
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const categories = mysqlTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    blurb: varchar("blurb", { length: 255 }).notNull().default(""),
    parentId: varchar("parent_id", { length: 36 }).references((): AnyMySqlColumn => categories.id, { onDelete: "set null" }),
    active: boolean("active").notNull().default(true),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("categories_slug_unique").on(table.slug),
    parentIndex: index("categories_parent_index").on(table.parentId),
  }),
);

export const products = mysqlTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: varchar("category_id", { length: 36 }).notNull().references(() => categories.id, { onDelete: "restrict" }),
    alsoIn: json("also_in").$type<string[]>().notNull(),
    price: int("price").notNull(),
    mrp: int("mrp").notNull(),
    fabric: varchar("fabric", { length: 160 }),
    description: text("description").notNull(),
    colors: json("colors").$type<{ name: string; hex: string }[]>().notNull(),
    sizes: json("sizes").$type<string[]>().notNull(),
    palette: json("palette").$type<[string, string]>().notNull(),
    tag: mysqlEnum("tag", ["New", "Bestseller", "Sale"]),
    featured: boolean("featured").notNull().default(false),
    soldOut: boolean("sold_out").notNull().default(false),
    care: text("care").notNull(),
    image: varchar("image", { length: 500 }).notNull(),
    images: json("images").$type<string[]>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("products_slug_unique").on(table.slug),
    categoryIndex: index("products_category_index").on(table.categoryId),
    featuredIndex: index("products_featured_index").on(table.featured),
  }),
);

export const orders = mysqlTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderNumber: varchar("order_number", { length: 32 }).notNull(),
    customer: json("customer").$type<{ name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string }>().notNull(),
    items: json("items").$type<{ productId: string; slug: string; name: string; price: number; qty: number; size: string; color: string }[]>().notNull(),
    subtotal: int("subtotal").notNull(),
    shipping: int("shipping").notNull(),
    total: int("total").notNull(),
    paymentMethod: mysqlEnum("payment_method", ["razorpay", "cod"]).notNull(),
    paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "failed", "partially_refunded", "refunded"]).notNull().default("pending"),
    status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]).notNull().default("pending"),
    razorpayOrderId: varchar("razorpay_order_id", { length: 80 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 80 }),
    invoiceNumber: varchar("invoice_number", { length: 40 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    orderNumberUnique: uniqueIndex("orders_number_unique").on(table.orderNumber),
    invoiceUnique: uniqueIndex("orders_invoice_unique").on(table.invoiceNumber),
    statusIndex: index("orders_status_index").on(table.status),
    createdIndex: index("orders_created_index").on(table.createdAt),
  }),
);

export const transactions = mysqlTable(
  "transactions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
    provider: mysqlEnum("provider", ["razorpay", "cod", "manual"]).notNull(),
    type: mysqlEnum("type", ["payment", "refund"]).notNull(),
    providerTransactionId: varchar("provider_transaction_id", { length: 100 }),
    amount: int("amount").notNull(),
    status: mysqlEnum("status", ["created", "authorized", "captured", "failed", "processed", "pending"]).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    orderIndex: index("transactions_order_index").on(table.orderId),
    providerIdIndex: index("transactions_provider_id_index").on(table.providerTransactionId),
  }),
);

export const refunds = mysqlTable(
  "refunds",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "restrict" }),
    transactionId: varchar("transaction_id", { length: 36 }).notNull().references(() => transactions.id, { onDelete: "restrict" }),
    providerRefundId: varchar("provider_refund_id", { length: 100 }),
    amount: int("amount").notNull(),
    reason: varchar("reason", { length: 500 }).notNull(),
    status: mysqlEnum("status", ["pending", "processed", "failed"]).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    orderIndex: index("refunds_order_index").on(table.orderId),
    providerIdIndex: index("refunds_provider_id_index").on(table.providerRefundId),
  }),
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "categoryTree" }),
  children: many(categories, { relationName: "categoryTree" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  transactions: many(transactions),
  refunds: many(refunds),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  order: one(orders, { fields: [transactions.orderId], references: [orders.id] }),
  refunds: many(refunds),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, { fields: [refunds.orderId], references: [orders.id] }),
  transaction: one(transactions, { fields: [refunds.transactionId], references: [transactions.id] }),
}));