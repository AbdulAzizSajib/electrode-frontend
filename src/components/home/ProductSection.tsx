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
    <section className=" container-px  mx-auto max-w-346 py-8  ">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 ">
        <h2 className="text-xl flex items-center gap-12 font-bold text-gray-900 sm:text-2xl">{title}
        </h2>
        <Link href={viewAllHref} className="text-sm font-semibold text-brand hover:underline">
          See all products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
