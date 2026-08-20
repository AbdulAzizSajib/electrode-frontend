"use client";

import { categories, vendors } from "@/data/products";

interface Props {
  selectedCategory: string | null;
  selectedVendor: string | null;
  inStockOnly: boolean;
  onCategoryChange: (value: string | null) => void;
  onVendorChange: (value: string | null) => void;
  onInStockChange: (value: boolean) => void;
}

export default function ProductFilters({
  selectedCategory,
  selectedVendor,
  inStockOnly,
  onCategoryChange,
  onVendorChange,
  onInStockChange,
}: Props) {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <h3 className="mb-4 font-semibold text-gray-900">Filter</h3>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-gray-700">Availability</p>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="accent-brand"
          />
          In Stock
        </label>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-gray-700">Category</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <button
              onClick={() => onCategoryChange(null)}
              className={!selectedCategory ? "font-semibold text-brand" : "hover:text-brand"}
            >
              All
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => onCategoryChange(c)}
                className={selectedCategory === c ? "font-semibold text-brand" : "hover:text-brand"}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">Brand</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <button
              onClick={() => onVendorChange(null)}
              className={!selectedVendor ? "font-semibold text-brand" : "hover:text-brand"}
            >
              All
            </button>
          </li>
          {vendors.map((v) => (
            <li key={v}>
              <button
                onClick={() => onVendorChange(v)}
                className={selectedVendor === v ? "font-semibold text-brand" : "hover:text-brand"}
              >
                {v}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
