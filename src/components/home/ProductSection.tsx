import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

export default function ProductSection({
  title,
  products,
  tabs,
  viewAllHref = "/products",
}: {
  title: string;
  products: Product[];
  tabs?: string[];
  viewAllHref?: string;
}) {
  return (
    <section className="container-px site-container py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl">
          <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-full bg-brand sm:h-6" />
          <span>{title}</span>
        </h2>
        <Link href={viewAllHref} className="text-sm font-semibold text-brand hover:underline">
          See all products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-6 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
