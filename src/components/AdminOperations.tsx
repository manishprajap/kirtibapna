"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { categories as seedCategories, discountPercent, formatPrice, Product, products as seedProducts } from "@/lib/products";

type CategoryRow = { id: string; name: string; slug: string; blurb: string; parentId: string | null; active: boolean; sortOrder: number };
type ManagedProduct = Product & { id: string; categoryId: string };
type ManagedTransaction = { id: string; orderId: string; orderNumber: string | null; provider: string; type: string; providerTransactionId: string | null; amount: number; status: string; createdAt: string };
type ManagedOrder = {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  customer: { name: string; email: string; phone: string };
  items: { name: string; qty: number; size: string; color: string }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  refundableAmount: number;
  createdAt: string;
  transactions: ManagedTransaction[];
};

const icons: Record<string, string> = {
  overview: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  categories: "M4 5h16M4 12h10M4 19h16M17 9l3 3-3 3",
  products: "M4 5.5 12 2l8 3.5v13L12 22l-8-3.5zM4 5.5l8 4 8-4M12 9.5V22",
  orders: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5",
  transactions: "M3 7h18M5 4v6M19 14H3m16-3v6M5 20v-6",
};

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#51484b] transition hover:bg-[#f8e9ee] hover:text-[#a4164d]">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[icon]} /></svg>
      {children}
    </a>
  );
}

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const starterCategoryRows: CategoryRow[] = seedCategories.map((category, sortOrder) => ({
  id: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: category.name,
  slug: slugify(category.name),
  blurb: category.blurb,
  parentId: null,
  active: true,
  sortOrder,
}));

function errorText(data: { error?: string }, fallback: string) {
  return data.error || fallback;
}

export default function AdminOperations() {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(seedProducts);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>(starterCategoryRows);
  const [orders, setOrders] = useState<ManagedOrder[]>([]);
  const [transactions, setTransactions] = useState<ManagedTransaction[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [databaseReady, setDatabaseReady] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [productDraft, setProductDraft] = useState<Record<string, string | boolean> | null>(null);
  const [editingProductId, setEditingProductId] = useState("");
  const [categoryDraft, setCategoryDraft] = useState<{ id?: string; name: string; slug: string; blurb: string; parentId: string } | null>(null);
  const [refundOrder, setRefundOrder] = useState<ManagedOrder | null>(null);

  const loadData = async () => {
    const catalogResponse = await fetch("/api/admin/catalog");
    const catalogData = await catalogResponse.json();
    if (!catalogResponse.ok) {
      setDatabaseReady(false);
      setSetupMessage(errorText(catalogData, "Catalog database is not ready."));
      return;
    }
    setDatabaseReady(true);
    setSetupMessage("");
    setCatalogProducts(catalogData.products);
    setCategoryRows(catalogData.categories);

    const [orderResponse, transactionResponse] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/transactions"),
    ]);
    const [orderData, transactionData] = await Promise.all([orderResponse.json(), transactionResponse.json()]);
    if (orderResponse.ok) setOrders(orderData.orders);
    if (transactionResponse.ok) setTransactions(transactionData.transactions);
  };

  useEffect(() => {
    loadData().catch(() => setSetupMessage("Could not connect to the store database."));
  }, []);

  const searchTerms = query.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const filteredProducts = catalogProducts.filter((product) => {
    const searchable = `${product.name} ${product.category} ${product.subcategory ?? ""} ${product.slug}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    return searchTerms.every((term) => searchable.includes(term)) && (categoryFilter === "All categories" || product.category === categoryFilter || product.subcategory === categoryFilter);
  });
  const activeOfferCount = catalogProducts.filter((product) => discountPercent(product) > 0).length;
  const paidOrders = orders.filter((order) => ["paid", "partially_refunded", "refunded"].includes(order.paymentStatus));
  const grossSales = paidOrders.reduce((sum, order) => sum + order.total, 0);

  const refresh = async () => {
    setBusy(true);
    setNotice("");
    try {
      await loadData();
    } catch {
      setNotice("Could not refresh store data.");
    } finally {
      setBusy(false);
    }
  };

  const seedCatalog = async () => {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(errorText(result, "Could not initialize catalog."));
      setNotice("Starter catalog initialized.");
      await loadData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not initialize catalog.");
    } finally {
      setBusy(false);
    }
  };

  const openNewProduct = () => {
    const firstCategory = categoryRows.find((category) => category.active)?.id ?? "";
    setEditingProductId("");
    setProductDraft({
      name: "", slug: "", categoryId: firstCategory, price: "", mrp: "", fabric: "", description: "",
      colors: "Rose:#D81B60", sizes: "XS, S, M, L, XL", paletteStart: "#D81B60", paletteEnd: "#880E4F",
      tag: "", featured: false, soldOut: false, care: "Dry clean only.", image: "/products/your-image.jpg", images: "",
    });
  };

  const openEditProduct = (product: ManagedProduct) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      price: String(product.price),
      mrp: String(product.mrp),
      fabric: product.fabric ?? "",
      description: product.description,
      colors: product.colors.map((color) => `${color.name}:${color.hex}`).join(", "),
      sizes: product.sizes.join(", "),
      paletteStart: product.palette[0],
      paletteEnd: product.palette[1],
      tag: product.tag ?? "",
      featured: !!product.featured,
      soldOut: !!product.soldOut,
      care: product.care,
      image: product.image,
      images: product.images?.join(", ") ?? "",
    });
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productDraft) return;
    setBusy(true);
    setNotice("");
    const colors = String(productDraft.colors).split(",").map((item) => {
      const [name, hex] = item.split(":").map((part) => part.trim());
      return { name, hex };
    });
    const payload = {
      ...productDraft,
      price: Number(productDraft.price),
      mrp: Number(productDraft.mrp),
      colors,
      sizes: String(productDraft.sizes).split(",").map((item) => item.trim()).filter(Boolean),
      palette: [String(productDraft.paletteStart), String(productDraft.paletteEnd)],
      tag: productDraft.tag || null,
      alsoIn: [],
      images: String(productDraft.images).split(",").map((item) => item.trim()).filter(Boolean),
    };
    try {
      const response = await fetch(editingProductId ? `/api/admin/products/${editingProductId}` : "/api/admin/products", {
        method: editingProductId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorText(result, "Could not save product."));
      setProductDraft(null);
      setNotice(editingProductId ? "Product updated." : "Product created.");
      await loadData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setBusy(false);
    }
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryDraft) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(categoryDraft.id ? `/api/admin/categories/${categoryDraft.id}` : "/api/admin/categories", {
        method: categoryDraft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryDraft),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorText(result, "Could not save category."));
      setCategoryDraft(null);
      setNotice(categoryDraft.id ? "Category updated." : "Category created.");
      await loadData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save category.");
    } finally {
      setBusy(false);
    }
  };

  const removeCategory = async (category: CategoryRow) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setNotice(errorText(result, "Could not delete category."));
    else {
      setNotice("Category deleted.");
      await loadData();
    }
  };

  const removeProduct = async (product: ManagedProduct) => {
    if (!window.confirm(`Delete “${product.name}”?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setNotice(errorText(result, "Could not delete product."));
    else {
      setNotice("Product deleted.");
      await loadData();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) setNotice(errorText(result, "Could not update order."));
    else await loadData();
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    const result = await response.json();
    if (!response.ok) setNotice(errorText(result, "Could not update payment status."));
    else await loadData();
  };

  const submitRefund = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!refundOrder) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/orders/${refundOrder.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(form.get("amount")), reason: form.get("reason") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorText(result, "Could not issue refund."));
      setRefundOrder(null);
      setNotice(`Refund of ${formatPrice(result.amount)} processed.`);
      await loadData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not issue refund.");
    } finally {
      setBusy(false);
    }
  };

  const statCards = [
    { label: "Catalog products", value: catalogProducts.length, note: "Across all collections" },
    { label: "Available to shop", value: catalogProducts.filter((product) => !product.soldOut).length, note: "Not marked sold out" },
    { label: "Orders", value: orders.length, note: "Saved checkout records" },
    { label: "Gross collected", value: formatPrice(grossSales), note: `${paidOrders.length} paid or refunded orders` },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[#e9e5e3] bg-white lg:flex lg:flex-col">
          <div className="flex h-[76px] items-center gap-3 border-b border-[#eee9e7] px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#a4164d] text-sm font-semibold text-white">K</span>
            <div><p className="text-sm font-semibold text-[#2a1a21]">Kriti Bapna</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81777a]">Store admin</p></div>
          </div>
          <nav className="space-y-1 px-3 py-6" aria-label="Admin navigation">
            <NavLink href="#overview" icon="overview">Overview</NavLink>
            <NavLink href="#categories" icon="categories">Categories</NavLink>
            <NavLink href="#products" icon="products">Products</NavLink>
            <NavLink href="#orders" icon="orders">Orders</NavLink>
            <NavLink href="#transactions" icon="transactions">Transactions</NavLink>
          </nav>
          <div className="mt-auto border-t border-[#eee9e7] p-4">
            <Link href="/" className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-[#51484b] hover:bg-[#f7f7f4]">View storefront <span aria-hidden="true">↗</span></Link>
            <button onClick={async () => { await fetch("/api/admin/session", { method: "DELETE" }); window.location.assign("/admin/login"); }} className="mt-1 w-full rounded-md px-3 py-2.5 text-left text-sm text-[#51484b] hover:bg-[#f7f7f4]">Sign out</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1" id="overview">
          <header className="sticky top-0 z-20 border-b border-[#e9e5e3] bg-white/95 backdrop-blur">
            <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a4164d]">Kriti Bapna · Admin</p><p className="mt-1 text-xs text-[#81777a]">Store operations</p></div>
              <div className="flex items-center gap-2">
                <button disabled={busy} onClick={() => void refresh()} className="rounded-md border border-[#ded8d6] px-3 py-2 text-xs font-semibold text-[#51484b] hover:border-[#a4164d] disabled:opacity-50 sm:text-sm">Refresh</button>
                <Link href="/" className="rounded-md border border-[#ded8d6] px-3 py-2 text-xs font-semibold text-[#51484b] transition hover:border-[#a4164d] hover:text-[#a4164d] sm:px-4 sm:text-sm">Storefront <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto border-t border-[#f0ecea] px-3 py-2 lg:hidden" aria-label="Admin navigation">
              <NavLink href="#overview" icon="overview">Overview</NavLink>
              <NavLink href="#categories" icon="categories">Categories</NavLink>
              <NavLink href="#products" icon="products">Products</NavLink>
              <NavLink href="#orders" icon="orders">Orders</NavLink>
              <NavLink href="#transactions" icon="transactions">Transactions</NavLink>
            </nav>
          </header>

          <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
            <section>
              <p className="text-xs font-medium text-[#81777a]">Admin / Overview</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <div><h1 className="text-3xl font-semibold tracking-normal text-[#2a1a21] sm:text-4xl">Store overview</h1><p className="mt-2 text-sm text-[#71676a]">Manage catalog, fulfillment and payment activity.</p></div>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${databaseReady ? "border-[#d6e8df] bg-[#f0f8f3] text-[#357253]" : "border-[#e7d9c2] bg-[#fffaf0] text-[#8b672e]"}`}>{databaseReady ? "Database connected" : "Setup required"}</span>
              </div>
            </section>

            {setupMessage && <section className="rounded-md border border-[#e7d9c2] bg-[#fffaf0] p-4 text-sm text-[#765b31]">
              <p className="font-semibold">Database setup required</p><p className="mt-1">{setupMessage}</p>
              <p className="mt-2">Configure <code>DATABASE_URL</code>, then run <code>npm run db:migrate</code>.</p>
              {databaseReady && catalogProducts.length === 0 && <button onClick={() => void seedCatalog()} disabled={busy} className="mt-3 rounded-md bg-[#a4164d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Initialize starter catalog</button>}
            </section>}
            {notice && <p role="status" className="rounded-md border border-[#d6e8df] bg-[#f0f8f3] px-4 py-3 text-sm text-[#357253]">{notice}</p>}

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4" aria-label="Store summary">
              {statCards.map((stat) => <article key={stat.label} className="rounded-md border border-[#e9e5e3] bg-white p-4 sm:p-5"><p className="text-xs font-medium text-[#71676a]">{stat.label}</p><p className="mt-3 text-2xl font-semibold tabular-nums text-[#2a1a21] sm:text-3xl">{stat.value}</p><p className="mt-1 text-[11px] text-[#91888a]">{stat.note}</p></article>)}
            </section>

            {databaseReady && catalogProducts.length === 0 && <section className="rounded-md border border-[#e7d9c2] bg-[#fffaf0] p-5"><h2 className="text-sm font-semibold text-[#765b31]">Initialize the store catalog</h2><p className="mt-1 text-sm text-[#765b31]">This database is connected but does not contain products yet. Load the existing starter products and categories once to begin.</p><button disabled={busy} onClick={() => void seedCatalog()} className="mt-3 rounded-md bg-[#a4164d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Initialize starter catalog</button></section>}

            <section id="categories" className="scroll-mt-32 overflow-hidden rounded-md border border-[#e9e5e3] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9e7] p-5 sm:p-6"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-[#a4164d]">Taxonomy</p><h2 className="mt-1 text-xl font-semibold">Categories &amp; subcategories</h2><p className="mt-1 text-sm text-[#71676a]">{categoryRows.length} categories, including child levels</p></div><button disabled={!databaseReady} onClick={() => setCategoryDraft({ name: "", slug: "", blurb: "", parentId: "" })} className="rounded-md bg-[#a4164d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Add category</button></div>
              {!databaseReady ? <p className="p-5 text-sm text-[#81777a]">Connect the database to create and manage categories.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead className="bg-[#faf9f8] text-[10px] uppercase tracking-[0.12em] text-[#81777a]"><tr><th className="px-5 py-3">Category</th><th className="px-4 py-3">URL</th><th className="px-4 py-3">Type</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#f0ecea]">{categoryRows.map((category) => <tr key={category.id}><td className="px-5 py-3 text-sm font-medium">{category.parentId ? <span className="mr-2 text-[#a4164d]">↳</span> : null}{category.name}<p className="mt-1 text-xs font-normal text-[#91888a]">{category.blurb}</p></td><td className="px-4 py-3 text-xs text-[#71676a]">/{category.slug}</td><td className="px-4 py-3 text-xs text-[#71676a]">{category.parentId ? "Child category" : "Parent category"}</td><td className="px-5 py-3 text-right"><div className="flex justify-end gap-3"><button onClick={() => setCategoryDraft({ id: category.id, name: category.name, slug: category.slug, blurb: category.blurb, parentId: category.parentId ?? "" })} className="text-xs font-semibold text-[#a4164d]">Edit</button><button onClick={() => void removeCategory(category)} className="text-xs text-[#9b3038]">Delete</button></div></td></tr>)}</tbody></table></div>}
            </section>

            <section id="products" className="scroll-mt-32 overflow-hidden rounded-md border border-[#e9e5e3] bg-white">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#eee9e7] p-5 sm:p-6"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-[#a4164d]">Catalog</p><h2 className="mt-1 text-xl font-semibold">Products</h2><p className="mt-1 text-sm text-[#71676a]">{filteredProducts.length} of {catalogProducts.length} products</p></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><label className="sr-only" htmlFor="admin-search">Search products</label><input id="admin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="h-10 min-w-0 rounded-md border border-[#ded8d6] bg-white px-3 text-sm outline-none placeholder:text-[#a59c9d] focus:border-[#a4164d] sm:w-56"/><label className="sr-only" htmlFor="admin-category">Filter by category</label><select id="admin-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-md border border-[#ded8d6] bg-white px-3 text-sm text-[#51484b] outline-none focus:border-[#a4164d]"><option>All categories</option>{categoryRows.map((category) => <option key={category.id}>{category.name}</option>)}</select><button disabled={!databaseReady} onClick={openNewProduct} className="h-10 rounded-md bg-[#a4164d] px-3 text-xs font-semibold text-white disabled:opacity-50">Add product</button></div></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="bg-[#faf9f8] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#81777a]"><tr><th className="px-5 py-3.5">Product</th><th className="px-4 py-3.5">Category</th><th className="px-4 py-3.5">Price</th><th className="px-4 py-3.5">Offer</th><th className="px-4 py-3.5">Availability</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#f0ecea]">{filteredProducts.map((product) => { const managed = product as ManagedProduct; const discount = discountPercent(product); return <tr key={product.slug} className="transition hover:bg-[#fdfafb]"><td className="px-5 py-3"><div className="flex items-center gap-3"><Image src={product.image} alt="" width={40} height={52} className="h-[52px] w-10 rounded-sm bg-[#f5f0ed] object-cover"/><div className="min-w-0"><p className="max-w-[280px] truncate text-sm font-medium">{product.name}</p><p className="mt-1 text-[11px] text-[#91888a]">{product.slug}</p></div></div></td><td className="px-4 py-3 text-sm text-[#51484b]">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}</td><td className="px-4 py-3 text-sm font-medium tabular-nums">{formatPrice(product.price)}</td><td className="px-4 py-3 text-sm text-[#51484b]">{discount > 0 ? `${discount}% off` : "—"}</td><td className="px-4 py-3 text-xs"><span className={product.soldOut ? "text-[#a14545]" : "text-[#357253]"}>{product.soldOut ? "Sold out" : "In stock"}</span></td><td className="px-5 py-3 text-right"><div className="flex justify-end gap-3"><Link href={`/product/${product.slug}`} className="text-xs font-semibold text-[#71676a] hover:underline">View</Link><button disabled={!databaseReady || !managed.id} onClick={() => openEditProduct(managed)} className="text-xs font-semibold text-[#a4164d] disabled:opacity-40">Edit</button><button disabled={!databaseReady || !managed.id} onClick={() => void removeProduct(managed)} className="text-xs text-[#9b3038] disabled:opacity-40">Delete</button></div></td></tr>; })}{filteredProducts.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-sm text-[#81777a]">No products match this search.</td></tr>}</tbody></table></div>
            </section>

            <section id="orders" className="scroll-mt-32 overflow-hidden rounded-md border border-[#e9e5e3] bg-white">
              <div className="border-b border-[#eee9e7] p-5 sm:p-6"><p className="text-xs font-medium uppercase tracking-[0.12em] text-[#a4164d]">Fulfillment</p><h2 className="mt-1 text-xl font-semibold">Orders</h2><p className="mt-1 text-sm text-[#71676a]">{orders.length} saved orders</p></div>
              {orders.length === 0 ? <p className="p-6 text-sm text-[#81777a]">{databaseReady ? "No orders have been placed yet." : "Orders appear here after the database is connected."}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left"><thead className="bg-[#faf9f8] text-[10px] uppercase tracking-[0.12em] text-[#81777a]"><tr><th className="px-5 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Fulfillment</th><th className="px-4 py-3">Placed</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#f0ecea]">{orders.map((order) => <tr key={order.id}><td className="px-5 py-3 text-sm font-semibold">{order.orderNumber}<p className="mt-1 text-[11px] font-normal text-[#91888a]">{order.items.length} items</p></td><td className="px-4 py-3 text-sm">{order.customer.name}<p className="mt-1 text-xs text-[#91888a]">{order.customer.email}</p></td><td className="px-4 py-3 text-sm font-medium">{formatPrice(order.total)}</td><td className="px-4 py-3 text-xs"><span className="capitalize">{order.paymentStatus.replaceAll("_", " ")}</span><p className="mt-1 capitalize text-[#91888a]">{order.paymentMethod}</p></td><td className="px-4 py-3"><select aria-label={`Fulfillment status for ${order.orderNumber}`} value={order.status} onChange={(event) => void updateOrderStatus(order.id, event.target.value)} className="rounded border border-[#ded8d6] bg-white px-2 py-1.5 text-xs capitalize"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="refunded" disabled>Refunded</option></select></td><td className="px-4 py-3 text-xs text-[#71676a]">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td><td className="px-5 py-3"><div className="flex justify-end gap-3"><a href={`/api/admin/orders/${order.id}/invoice`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#a4164d]">Invoice</a>{order.paymentStatus === "paid" || order.paymentStatus === "partially_refunded" ? <button onClick={() => setRefundOrder(order)} className="text-xs font-semibold text-[#9b3038]">Refund</button> : null}</div></td></tr>)}</tbody></table></div>}
            </section>

            <section id="transactions" className="scroll-mt-32 overflow-hidden rounded-md border border-[#e9e5e3] bg-white">
              <div className="border-b border-[#eee9e7] p-5 sm:p-6"><p className="text-xs font-medium uppercase tracking-[0.12em] text-[#a4164d]">Payments</p><h2 className="mt-1 text-xl font-semibold">Transactions</h2><p className="mt-1 text-sm text-[#71676a]">{transactions.length} payment/refund records</p></div>
              {transactions.length === 0 ? <p className="p-6 text-sm text-[#81777a]">No transactions recorded yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-[#faf9f8] text-[10px] uppercase tracking-[0.12em] text-[#81777a]"><tr><th className="px-5 py-3">Type</th><th className="px-4 py-3">Provider reference</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-5 py-3">Date</th></tr></thead><tbody className="divide-y divide-[#f0ecea]">{transactions.map((transaction) => <tr key={transaction.id}><td className="px-5 py-3 text-sm capitalize">{transaction.type}</td><td className="px-4 py-3 text-xs text-[#71676a]">{transaction.providerTransactionId ?? "—"}</td><td className="px-4 py-3 text-sm capitalize">{transaction.provider}</td><td className="px-4 py-3 text-sm font-medium">{formatPrice(transaction.amount)}</td><td className="px-4 py-3 text-xs capitalize">{transaction.status}</td><td className="px-5 py-3 text-xs text-[#71676a]">{new Date(transaction.createdAt).toLocaleString("en-IN")}</td></tr>)}</tbody></table></div>}
            </section>
            <p className="pb-4 text-center text-[11px] text-[#91888a]">Invoices are printable HTML documents. Card refunds require a captured Razorpay payment.</p>
          </div>
        </main>
      </div>

      {productDraft && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#24171d]/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setProductDraft(null); }}><section role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" className="my-6 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a4164d]">Catalog</p><h2 id="product-dialog-title" className="mt-1 text-2xl font-semibold">{editingProductId ? "Edit product" : "Add product"}</h2></div><button onClick={() => setProductDraft(null)} aria-label="Close product form" className="rounded p-2 text-[#71676a] hover:bg-[#f7f7f4]">×</button></div><form onSubmit={saveProduct} className="mt-6 grid gap-4 sm:grid-cols-2">{([ ["name", "Product name"], ["slug", "URL slug"], ["price", "Selling price (₹)"], ["mrp", "MRP (₹)"], ["fabric", "Fabric"], ["image", "Main image path"], ["images", "Additional image paths (comma separated)"], ["sizes", "Sizes (comma separated)"], ["colors", "Colors as Name:#RRGGBB"], ["paletteStart", "Fallback main color"], ["paletteEnd", "Fallback dark color"], ["care", "Care instructions"] ] as const).map(([field, label]) => <label key={field} className={`text-xs font-medium text-[#51484b] ${["images", "description"].includes(field) ? "sm:col-span-2" : ""}`}>{label}<input required={!(["fabric", "images"].includes(field))} value={String(productDraft[field] ?? "")} onChange={(event) => setProductDraft({ ...productDraft, [field]: event.target.value, ...(field === "name" && !editingProductId ? { slug: slugify(event.target.value) } : {}) })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] px-3 text-sm outline-none focus:border-[#a4164d]" /></label>)}<label className="text-xs font-medium text-[#51484b]">Category<select required value={String(productDraft.categoryId)} onChange={(event) => setProductDraft({ ...productDraft, categoryId: event.target.value })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] bg-white px-3 text-sm"><option value="">Select category</option>{categoryRows.filter((category) => category.active).map((category) => <option key={category.id} value={category.id}>{category.parentId ? "↳ " : ""}{category.name}</option>)}</select></label><label className="text-xs font-medium text-[#51484b]">Product tag<select value={String(productDraft.tag)} onChange={(event) => setProductDraft({ ...productDraft, tag: event.target.value })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] bg-white px-3 text-sm"><option value="">No tag</option><option>New</option><option>Bestseller</option><option>Sale</option></select></label><label className="text-xs font-medium text-[#51484b] sm:col-span-2">Description<textarea required rows={3} value={String(productDraft.description)} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} className="mt-1.5 w-full rounded-md border border-[#ded8d6] p-3 text-sm outline-none focus:border-[#a4164d]" /></label><div className="flex flex-wrap gap-5 sm:col-span-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!productDraft.featured} onChange={(event) => setProductDraft({ ...productDraft, featured: event.target.checked })} />Feature on home</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!productDraft.soldOut} onChange={(event) => setProductDraft({ ...productDraft, soldOut: event.target.checked })} />Mark sold out</label></div><div className="flex justify-end gap-2 border-t border-[#eee9e7] pt-4 sm:col-span-2"><button type="button" onClick={() => setProductDraft(null)} className="rounded-md border border-[#ded8d6] px-4 py-2 text-sm">Cancel</button><button disabled={busy} className="rounded-md bg-[#a4164d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save product"}</button></div></form></section></div>}

      {categoryDraft && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24171d]/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="category-dialog-title" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a4164d]">Taxonomy</p><h2 id="category-dialog-title" className="mt-1 text-xl font-semibold">{categoryDraft.id ? "Edit category" : "Add category or child"}</h2></div><button onClick={() => setCategoryDraft(null)} aria-label="Close category form" className="p-2 text-[#71676a]">×</button></div><form onSubmit={saveCategory} className="mt-5 space-y-4"><label className="block text-xs font-medium text-[#51484b]">Name<input required value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value, slug: slugify(event.target.value) })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] px-3 text-sm" /></label><label className="block text-xs font-medium text-[#51484b]">URL slug<input required value={categoryDraft.slug} onChange={(event) => setCategoryDraft({ ...categoryDraft, slug: slugify(event.target.value) })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] px-3 text-sm" /></label><label className="block text-xs font-medium text-[#51484b]">Parent category<select value={categoryDraft.parentId} onChange={(event) => setCategoryDraft({ ...categoryDraft, parentId: event.target.value })} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] bg-white px-3 text-sm"><option value="">None · top-level category</option>{categoryRows.filter((category) => category.id !== categoryDraft.id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="block text-xs font-medium text-[#51484b]">Description<textarea rows={2} value={categoryDraft.blurb} onChange={(event) => setCategoryDraft({ ...categoryDraft, blurb: event.target.value })} className="mt-1.5 w-full rounded-md border border-[#ded8d6] p-3 text-sm" /></label><div className="flex justify-end gap-2 border-t border-[#eee9e7] pt-4"><button type="button" onClick={() => setCategoryDraft(null)} className="rounded-md border border-[#ded8d6] px-4 py-2 text-sm">Cancel</button><button disabled={busy} className="rounded-md bg-[#a4164d] px-4 py-2 text-sm font-semibold text-white">Save category</button></div></form></section></div>}

      {refundOrder && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24171d]/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="refund-dialog-title" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a4164d]">Razorpay</p><h2 id="refund-dialog-title" className="mt-1 text-xl font-semibold">Refund {refundOrder.orderNumber}</h2><p className="mt-2 text-sm text-[#71676a]">Refunds are sent to the original payment method. Remaining refundable: {formatPrice(refundOrder.refundableAmount)}.</p><form onSubmit={submitRefund} className="mt-5 space-y-4"><label className="block text-xs font-medium">Amount (₹)<input name="amount" type="number" min="1" max={refundOrder.refundableAmount} defaultValue={refundOrder.refundableAmount} required className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] px-3 text-sm" /></label><label className="block text-xs font-medium">Reason<input name="reason" required maxLength={500} className="mt-1.5 h-10 w-full rounded-md border border-[#ded8d6] px-3 text-sm" /></label><div className="flex justify-end gap-2 border-t border-[#eee9e7] pt-4"><button type="button" onClick={() => setRefundOrder(null)} className="rounded-md border border-[#ded8d6] px-4 py-2 text-sm">Cancel</button><button disabled={busy} className="rounded-md bg-[#9b3038] px-4 py-2 text-sm font-semibold text-white">{busy ? "Processing…" : "Issue refund"}</button></div></form></section></div>}
    </div>
  );
}