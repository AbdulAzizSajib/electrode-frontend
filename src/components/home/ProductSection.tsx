import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import type { ProductGridColumns } from "@/types/store-settings";
import { PRODUCT_GRID_CLASS, productCardSizes } from "@/lib/product-grid";

export default function ProductSection({
  title,
  products,
  tabs,
  viewAllHref = "/products",
  columns,
}: {
  title: string;
  products: Product[];
  tabs?: string[];
  viewAllHref?: string;
  /** Cards across from `lg` up — the merchant's choice; see `lib/product-grid.ts`. */
  columns: ProductGridColumns;
}) {
  const sizes = productCardSizes(columns);

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
      <div className={PRODUCT_GRID_CLASS[columns]}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} sizes={sizes} />
        ))}
      </div>
    </section>
  );
}
