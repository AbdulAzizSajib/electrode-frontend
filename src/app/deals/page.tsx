import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function DealsPage() {
  const deals = products.filter((p) => p.compareAtPrice);

  return (
    <div className="container-px mx-auto max-w-346 py-14">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Today&apos;s Deal</h1>
      <p className="mb-10 text-gray-500">{deals.length} products on sale right now.</p>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
