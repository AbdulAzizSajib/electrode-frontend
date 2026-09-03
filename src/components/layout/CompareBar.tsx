"use client";

import Link from "next/link";
import { Repeat, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCompare,
  removeFromCompare,
  selectCompareSlugs,
  selectIsCompareHydrated,
} from "@/store/compareSlice";
import { useGetProductBySlugQuery } from "@/store/productApi";
import { COMPARE_LIMIT } from "@/lib/compare-storage";

/**
 * A persistent reminder of what is currently being compared.
 *
 * Without it a shopper who added a product three pages ago has no way of knowing
 * the list is still there, and no way to reach it short of guessing the URL.
 *
 * Rendered only once the stored list has been read: before that the list is
 * empty by construction, and a bar that appeared a beat after the page settled
 * would be worse than one that arrives with it.
 */
export default function CompareBar() {
  const slugs = useAppSelector(selectCompareSlugs);
  const isHydrated = useAppSelector(selectIsCompareHydrated);
  const dispatch = useAppDispatch();

  if (!isHydrated || slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur md:bottom-0">
      {/* Clears the mobile bottom nav, which is fixed to the same edge. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 pb-20 md:pb-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Repeat size={16} />
          Compare
          <span className="text-gray-400">
            {slugs.length}/{COMPARE_LIMIT}
          </span>
        </span>

        <ul className="flex flex-1 flex-wrap items-center gap-2">
          {slugs.map((slug) => (
            <CompareChip key={slug} slug={slug} />
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(clearCompare())}
            className="text-sm text-gray-500 transition-colors hover:text-sale"
          >
            Clear all
          </button>
          <Link
            href="/compare"
            className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * One chip per compared product.
 *
 * Names the product rather than showing a bare slug, which means a lookup per
 * chip. The query is the same one the comparison page uses, so RTK Query serves
 * both from one cache entry per product. While it loads — or if the product has
 * since been deleted or renamed — the chip stays removable, so a dead entry can
 * never strand the shopper.
 */
function CompareChip({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { data: product, isError } = useGetProductBySlugQuery(slug);

  return (
    <li className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1 text-xs">
      <span className="max-w-48 truncate text-gray-700">
        {product?.name ?? (isError ? "Unavailable" : "Loading…")}
      </span>
      <button
        type="button"
        onClick={() => dispatch(removeFromCompare(slug))}
        aria-label={`Remove ${product?.name ?? "product"} from comparison`}
        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-sale"
      >
        <X size={12} />
      </button>
    </li>
  );
}
