import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompareTable from "@/components/product/CompareTable";
import { getStoreSettings } from "@/services/store-settings";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare products side by side by price, rating and specifications.",
};

/**
 * The comparison is entirely client-owned — the list lives in `localStorage`, so
 * the server has nothing to render it from. This page is just the frame; the
 * table hydrates from the store and fetches each product itself.
 */
export default async function ComparePage() {
  /*
   * A shop that does not offer comparison has no comparison page. Same
   * reasoning as `/wishlist`: an old link must not reach an empty version of a
   * withdrawn feature. The shopper's stored list is untouched and comes back
   * intact if the merchant offers comparison again.
   */
  const settings = await getStoreSettings();
  if (!settings.catalogConfig.showCompare) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Compare</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">Compare Products</h1>

      <CompareTable />
    </div>
  );
}
