import type { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/product";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "category",
    path: "/deals",
    fallbackTitle: "Today's Deal",
    record: { description: "Products on sale right now." },
  });
}

export default async function DealsPage() {
  const { products } = await getProducts({ limit: 24 });
  // A regular price above the offer price is what makes it a deal — the
  // service already drops any that isn't a genuine saving.
  const deals = products.filter((p) => p.sellingPrice);

  return (
    <div className="container-px site-container py-14">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Today&apos;s Deal</h1>
      <p className="mb-10 text-gray-500">
        {deals.length === 0
          ? "No products are on sale right now."
          : `${deals.length} products on sale right now.`}
      </p>
      {deals.length > 0 && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
