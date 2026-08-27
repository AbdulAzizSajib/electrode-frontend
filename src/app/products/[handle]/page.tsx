import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import { resolveCategorySlug } from "@/services/category";
import { getProductBySlug, getProducts } from "@/services/product";

// No `generateStaticParams`: the catalog is API-backed now, and pre-rendering it
// at build time would serve prices that are stale the moment a merchant edits one.

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductBySlug(handle);

  return {
    title: product ? `${product.name} – Electrode` : "Product not found – Electrode",
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);

  if (!product) notFound();

  // "You may also like" — same category where possible, excluding this product.
  // Fetch one extra so filtering the product itself out still leaves a full row.
  const { products } = await getProducts({
    limit: 7,
    category: (await resolveCategorySlug(product.categorySlug)) ?? undefined,
  });

  let related = products.filter((p) => p.id !== product.id);

  // A category with only this product in it would leave the row empty; fall
  // back to the wider catalog so the section still has something to show.
  if (related.length === 0) {
    const { products: fallback } = await getProducts({ limit: 7 });
    related = fallback.filter((p) => p.id !== product.id);
  }

  related = related.slice(0, 6);

  return <ProductDetail product={product} related={related} />;
}
