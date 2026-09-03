"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Repeat, X } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { buildCompareRows, differingRows } from "@/lib/compare-rows";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCompare,
  removeFromCompare,
  selectCompareSlugs,
  selectIsCompareHydrated,
} from "@/store/compareSlice";
import { useGetProductBySlugQuery } from "@/store/productApi";
import StarRating from "@/components/ui/StarRating";

/** Shown in a cell where a product simply does not record the specification. */
const NOT_SPECIFIED = "—";

export default function CompareTable() {
  const slugs = useAppSelector(selectCompareSlugs);
  const isHydrated = useAppSelector(selectIsCompareHydrated);
  const dispatch = useAppDispatch();
  const [differencesOnly, setDifferencesOnly] = useState(false);

  // One hook per slot rather than per slug: hooks cannot be called in a loop
  // whose length changes between renders. The list is capped, so a fixed set of
  // slots covers it, and an unused slot skips its request entirely.
  const a = useGetProductBySlugQuery(slugs[0] ?? "", { skip: !slugs[0] });
  const b = useGetProductBySlugQuery(slugs[1] ?? "", { skip: !slugs[1] });
  const c = useGetProductBySlugQuery(slugs[2] ?? "", { skip: !slugs[2] });
  const d = useGetProductBySlugQuery(slugs[3] ?? "", { skip: !slugs[3] });
  const slots = useMemo(() => [a, b, c, d], [a, b, c, d]);

  // A slug that no longer resolves is pruned from the list, so it is not
  // re-fetched on every visit forever. Deleting or renaming a product both land
  // here.
  useEffect(() => {
    slugs.forEach((slug, i) => {
      if (slots[i]?.isError) dispatch(removeFromCompare(slug));
    });
  }, [slugs, slots, dispatch]);

  const products = slugs
    .map((_, i) => slots[i]?.data)
    .filter((p): p is Product => Boolean(p));

  const isLoading = slots.some((s) => s.isLoading);

  // Alignment and difference rules live in their own module so they can be
  // tested without rendering — they are the substance of this page.
  const rows = useMemo(() => buildCompareRows(products), [products]);
  const differing = useMemo(() => differingRows(rows), [rows]);
  const visibleRows = differencesOnly ? differing : rows;

  if (!isHydrated || (isLoading && products.length === 0)) {
    return <p className="py-16 text-center text-gray-500">Loading comparison…</p>;
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <Repeat size={40} className="mx-auto mb-4 text-gray-300" />
        <h2 className="mb-2 text-lg font-semibold">Nothing to compare yet</h2>
        <p className="mb-6 text-sm text-gray-500">
          Add products using the Compare button to see them side by side.
        </p>
        <Link
          href="/products"
          className="inline-block rounded bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(e) => setDifferencesOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          Show differences only
        </label>
        <button
          type="button"
          onClick={() => dispatch(clearCompare())}
          className="text-sm text-gray-500 transition-colors hover:text-sale"
        >
          Clear comparison
        </button>
      </div>

      {/* The table scrolls on its own axis; the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 text-left align-top text-xs font-semibold uppercase text-gray-400">
                Product
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="min-w-56 max-w-72 border-l border-gray-100 p-3 text-left align-top font-normal"
                >
                  <ProductColumn product={product} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <SpecRow label="Price" sticky>
              {products.map((product) => {
                const off = discountPercent(product.price, product.compareAtPrice);
                return (
                  <td
                    key={product.id}
                    className="border-l border-t border-gray-100 p-3 align-top"
                  >
                    <span className="font-semibold text-sale">
                      {formatPrice(product.price)}
                    </span>
                    {off !== null && (
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                    )}
                  </td>
                );
              })}
            </SpecRow>

            <SpecRow label="Rating" sticky>
              {products.map((product) => (
                <td
                  key={product.id}
                  className="border-l border-t border-gray-100 p-3 align-top"
                >
                  {product.rating !== undefined ? (
                    <span className="flex items-center gap-2">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-400">Not rated</span>
                  )}
                </td>
              ))}
            </SpecRow>

            <SpecRow label="Availability" sticky>
              {products.map((product) => (
                <td
                  key={product.id}
                  className="border-l border-t border-gray-100 p-3 align-top"
                >
                  <span className={product.inStock ? "text-green-600" : "text-sale"}>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </td>
              ))}
            </SpecRow>

            {visibleRows.map((row) => (
              <SpecRow key={row.name} label={row.name} sticky>
                {row.values.map((value, i) => (
                  <td
                    key={products[i]?.id ?? i}
                    className="border-l border-t border-gray-100 p-3 align-top"
                  >
                    {value ?? (
                      <span className="text-gray-300">{NOT_SPECIFIED}</span>
                    )}
                  </td>
                ))}
              </SpecRow>
            ))}
          </tbody>
        </table>
      </div>

      {differencesOnly && differing.length === 0 && rows.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          These products match on every specification listed.
        </p>
      )}

      {products.length === 1 && (
        <p className="py-8 text-center text-sm text-gray-500">
          Add another product to compare this one against.{" "}
          <Link href="/products" className="text-brand hover:underline">
            Browse products
          </Link>
        </p>
      )}
    </div>
  );
}

function SpecRow({
  label,
  sticky,
  children,
}: {
  label: string;
  sticky?: boolean;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <th
        scope="row"
        className={`border-t border-gray-100 p-3 text-left align-top text-xs font-semibold uppercase text-gray-500 ${
          sticky ? "sticky left-0 z-10 bg-white" : ""
        }`}
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

function ProductColumn({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => dispatch(removeFromCompare(product.slug))}
        aria-label={`Remove ${product.name} from comparison`}
        className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-gray-400 shadow-sm transition-colors hover:text-sale"
      >
        <X size={14} />
      </button>

      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative mb-3 aspect-square overflow-hidden rounded bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="224px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="line-clamp-2 font-medium text-gray-900 group-hover:text-brand">
          {product.name}
        </span>
      </Link>
    </div>
  );
}
