import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getRelatedProducts, products } from "@/data/products";
import ProductDetail from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  return {
    title: product ? `${product.title} – Electrode` : "Product not found – Electrode",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) notFound();

  const related = getRelatedProducts(product, 6);

  return <ProductDetail product={product} related={related} />;
}
