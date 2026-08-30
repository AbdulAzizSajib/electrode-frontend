"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import StarRating from "@/components/ui/StarRating";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import {
  useGetWishlistQuery,
  useMoveWishlistItemToCartMutation,
  useRemoveWishlistItemMutation,
  WISHLIST_PAGE_SIZE,
} from "@/store/wishlistApi";

export default function WishlistView() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");

  const { data, isLoading, isError } = useGetWishlistQuery({
    page,
    limit: WISHLIST_PAGE_SIZE,
  });

  const [removeItem, { isLoading: isRemoving }] = useRemoveWishlistItemMutation();
  const [moveToCart, { isLoading: isMoving }] = useMoveWishlistItemToCartMutation();

  async function handleRemove(itemId: string) {
    setActionError("");
    try {
      await removeItem(itemId).unwrap();
    } catch {
      setActionError("That item could not be removed. Please try again.");
    }
  }

  async function handleMove(itemId: string) {
    setActionError("");
    try {
      await moveToCart(itemId).unwrap();
      dispatch(openCart());
    } catch (error) {
      // The backend keeps the item on failure, so the list still shows it —
      // saying why is the only thing left to do.
      const detail = (error as { data?: { message?: string } })?.data?.message;
      setActionError(detail ?? "That item could not be moved to your cart.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  // A failed load must never render as an empty wishlist — a shopper would
  // reasonably conclude their saved items were lost.
  if (isError) {
    return (
      <div className="py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          We couldn&apos;t load your wishlist
        </h1>
        <p className="text-gray-500">
          Your saved items are safe — please refresh the page to try again.
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Heart size={48} className="mb-4 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Your Wishlist is Empty</h1>
        <p className="mb-8 text-gray-500">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          href="/products"
          className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        My Wishlist{meta?.total ? ` (${meta.total})` : ""}
      </h1>

      {actionError && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>
      )}

      <ul className="divide-y divide-gray-100 border-y border-gray-100">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <Link
              href={`/products/${item.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-gray-100"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </Link>

            <div className="flex flex-1 flex-col">
              <Link
                href={`/products/${item.slug}`}
                className="text-sm font-medium text-gray-900 hover:text-brand"
              >
                {item.name}
              </Link>

              {item.rating !== undefined && (
                <div className="mt-1 flex items-center gap-1.5">
                  <StarRating rating={item.rating} size={12} />
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                </div>
              )}

              {/* Price and availability come from the catalog now, not from
                  whatever they were when the product was saved. */}
              <span className="mt-1 text-sm font-semibold text-sale">
                {formatPrice(item.price)}
              </span>

              {!item.isPurchasable && (
                <span className="mt-1 text-xs font-medium text-gray-500">
                  Currently unavailable
                </span>
              )}

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => handleMove(item.id)}
                  disabled={!item.isPurchasable || isMoving}
                  className="flex items-center gap-1.5 rounded border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  <ShoppingCart size={13} />
                  Move to cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isRemoving}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-sale disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
