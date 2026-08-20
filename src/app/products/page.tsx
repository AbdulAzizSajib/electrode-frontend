import { Suspense } from "react";
import type { Metadata } from "next";
import ProductListing from "@/components/product/ProductListing";

export const metadata: Metadata = {
  title: "Products – Electrode",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-px mx-auto max-w-346 py-16 text-center text-gray-400">Loading products…</div>}>
      <ProductListing />
    </Suspense>
  );
}
