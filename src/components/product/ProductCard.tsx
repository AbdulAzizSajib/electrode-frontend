"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ShoppingCart, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductQuickView from "@/components/product/ProductQuickView";
import WishlistButton from "@/components/product/WishlistButton";
import StarRating from "@/components/ui/StarRating";
import clsx from "clsx";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();
  const discount = discountPercent(product.price, product.compareAtPrice);

  // Local, not Redux: nothing outside this card needs to know its quick view
  // is open, and a single global "which one is open" would be wrong across the
  // five independent call sites that render cards.
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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
        <WishlistButton
          productId={product.id}
          size={16}
          className={clsx(
            "absolute z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-sale",
            // Sits below the sold-out chip when one is present, so the two
            // never overlap in the same corner.
            product.inStock ? "right-3 top-3" : "right-3 top-12",
          )}
        />
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
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
        {/* Only rendered once the product actually has reviews — an unrated
            product shows nothing here rather than an empty five-star row. */}
        {product.rating !== undefined && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating rating={product.rating} size={13} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        )}
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

        {/* Both branches share one slot so the reveal is structurally uniform:
            no card can end up showing its action while a sibling hides one.
            The slot keeps its footprint in both states — only opacity and
            transform animate — so revealing never reflows the grid. */}
        <div className="mt-3 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none hover-capable:invisible hover-capable:translate-y-1 hover-capable:opacity-0 hover-capable:group-focus-within:visible hover-capable:group-focus-within:translate-y-0 hover-capable:group-focus-within:opacity-100 hover-capable:group-hover:visible hover-capable:group-hover:translate-y-0 hover-capable:group-hover:opacity-100">
          {product.isVariable ? (
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <SlidersHorizontal size={14} />
              Options
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!product.inStock || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
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

      <ProductQuickView
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
