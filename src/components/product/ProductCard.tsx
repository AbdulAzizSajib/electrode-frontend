"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingCart, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();
  const discount = discountPercent(product.price, product.compareAtPrice);

  async function handleAdd() {
    try {
      await addItem({ productId: product.id, quantity: 1 }).unwrap();
      dispatch(openCart());
    } catch {
      // The cart query is invalidated regardless, so the drawer would show a
      // cart that never gained the item. Staying closed is the honest signal.
    }
  }

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 z-10 rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </Link>
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 hover:text-brand"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-sm font-semibold text-sale">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* A variable product needs a variant chosen before it can be added —
            adding here would silently bill the base price for a variant the
            shopper never picked, so send them to the detail page instead. */}
        {product.isVariable ? (
          <Link
            href={`/products/${product.slug}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <SlidersHorizontal size={14} />
            Options
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!product.inStock || isLoading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
            {isLoading ? "Adding..." : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}
