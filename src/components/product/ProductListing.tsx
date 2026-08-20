"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function ProductListing() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const initialCategory = searchParams.get("category");

  const [category, setCategory] = useState<string | null>(initialCategory);
  const [vendor, setVendor] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query)) return false;
      if (category && p.category !== category) return false;
      if (vendor && p.vendor !== vendor) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return list;
  }, [query, category, vendor, inStockOnly, sort]);

  return (
    <div className="container-px mx-auto max-w-346 py-8">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 text-sm text-gray-500">
        <span>Home / Shop</span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters
          selectedCategory={category}
          selectedVendor={vendor}
          inStockOnly={inStockOnly}
          onCategoryChange={setCategory}
          onVendorChange={setVendor}
          onInStockChange={setInStockOnly}
        />

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{filtered.length} Products</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500" htmlFor="sort">
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-desc">Alphabetically, Z-A</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
              <LayoutGrid size={20} className="text-brand" />
              <List size={20} className="text-gray-300" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-gray-500">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
