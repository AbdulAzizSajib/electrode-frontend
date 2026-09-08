"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductQuickView from "@/components/product/ProductQuickView";
import WishlistButton from "@/components/product/WishlistButton";
import CompareButton from "@/components/product/CompareButton";
import StarRating from "@/components/ui/StarRating";
import { getCatalogFeatures } from "@/lib/catalog-features";
import clsx from "clsx";

/**
 * Shared by all four renderings of the card's action.
 *
 * `unify-card-add-to-cart-action` collapsed the action to a single `<button>` precisely so the
 * branches could not drift apart in icon, size or disabled styling. Three of the four still are that
 * button; the fourth has to be an `<a>`, because a navigation a shopper cannot middle-click or open
 * in a new tab is a worse answer than a shared class string. This constant is what carries the
 * sameness now — anything changed here changes for all four.
 */
const ACTION_CLASS =
  "flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();
  const discount = discountPercent(product.offerPrice, product.sellingPrice);

  // Read once: this card gates on all three, and one call cannot observe a
  // half-updated pair the way three separate reads could.
  const { showWishlist, showCompare, showQuickView } = getCatalogFeatures();

  // Local, not Redux: nothing outside this card needs to know its quick view
  // is open, and a single global "which one is open" would be wrong across the
  // five independent call sites that render cards.
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  /*
   * The action's contents, shared by all four renderings below so the icon and
   * label cannot drift between them. `isLoading` belongs to this card's own add
   * mutation, so it is only ever true on the adds-directly branch — the quick
   * view owns its own loading state, and the link has none.
   */
  const actionContent = (
    <>
      {isLoading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <ShoppingCart size={14} />
      )}
      {isLoading ? "Adding..." : "Add to cart"}
    </>
  );

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
        {/* The discount is the stronger claim, so it keeps the corner. A badge
            is the merchant's own label and sits below when both apply — and a
            product with no badge shows nothing rather than an empty chip. */}
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span
            className={clsx(
              "absolute left-3 z-10 rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white",
              discount ? "top-12" : "top-3",
            )}
          >
            {product.badge}
          </span>
        )}
        {/* One stack, not three independently-positioned elements. Each control
            used to carry the offset its neighbours implied (`top-14` for
            compare, shifting to `top-23` when the sold-out chip took the
            corner). That worked only while all three were unconditional:
            whether the heart and the compare control appear at all is now a
            merchant setting, and a hardcoded offset would leave compare
            floating in the gap where the heart would have been. A flex column
            spaces whatever is actually present, so no combination can drift. */}
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-3">
          {!product.inStock && (
            <span className="rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold text-white">
              Sold out
            </span>
          )}
          {showWishlist && (
            <WishlistButton
              productId={product.id}
              size={16}
              className="rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-sale"
            />
          )}
          {showCompare && (
            <CompareButton
              slug={product.slug}
              size={16}
              className="rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-brand"
            />
          )}
        </div>
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
          {product.sellingPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.sellingPrice)}
            </span>
          )}
          <span className="text-sm font-semibold text-sale">
            {formatPrice(product.offerPrice)}
          </span>
        </div>

        {/* Every card reveals its action from one slot, so no card can end up
            showing its action while a sibling hides one. The slot keeps its
            footprint in both states — only opacity and transform animate — so
            revealing never reflows the grid. */}
        <div className="mt-3 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none hover-capable:invisible hover-capable:translate-y-1 hover-capable:opacity-0 hover-capable:group-focus-within:visible hover-capable:group-focus-within:translate-y-0 hover-capable:group-focus-within:opacity-100 hover-capable:group-hover:visible hover-capable:group-hover:translate-y-0 hover-capable:group-hover:opacity-100">
          {/* Every product reads `Add to cart` — the label names what the
              shopper wants rather than the mechanism behind it, so a variable
              product cannot look less purchasable than the simple one beside
              it. Only the destination differs, and the order below matters:

                out of stock          → disabled, whatever else is true
                no variants           → adds one unit from here
                variants, preview on  → opens the quick view to collect a choice
                variants, preview off → goes to the product's own page

              Out of stock is resolved FIRST because the last branch is a
              `<Link>`, and a link cannot be disabled. Testing it first is what
              keeps a sold-out product from becoming clickable the moment a
              merchant turns the quick view off. */}
          {!product.inStock ? (
            <button className={ACTION_CLASS} disabled>
              {actionContent}
            </button>
          ) : !product.isVariable ? (
            <button className={ACTION_CLASS} onClick={handleAdd} disabled={isLoading}>
              {actionContent}
            </button>
          ) : showQuickView ? (
            /* The accessible half of "same label, different outcome": sighted
               shoppers learn the difference when the panel appears, and this is
               what tells everyone else. Only on the branch that opens one. */
            <button
              className={ACTION_CLASS}
              onClick={() => setQuickViewOpen(true)}
              aria-haspopup="dialog"
            >
              {actionContent}
            </button>
          ) : (
            /* No `aria-haspopup` here: this one navigates, and announcing a
               dialog that never opens would be its own lie. */
            <Link href={`/products/${product.slug}`} className={ACTION_CLASS}>
              {actionContent}
            </Link>
          )}
        </div>
      </div>

      {/* Not rendered at all when the merchant does not offer it, rather than
          mounted and never opened: it holds a Modal with a focus trap and
          fetches on open, so leaving it in the tree would be dead weight and
          one stray `setQuickViewOpen(true)` away from contradicting the
          setting. */}
      {showQuickView && (
        <ProductQuickView
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </div>
  );
}
