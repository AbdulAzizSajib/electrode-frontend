"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { FOCUS_RING } from "@/lib/focus-ring";
import { EMPTY_CART, useAddItemMutation, useGetCartQuery } from "@/store/cartApi";
import CardQuantityControl from "@/components/product/CardQuantityControl";
import { cartLineForCard } from "@/lib/cart-line-for-card";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductQuickView from "@/components/product/ProductQuickView";
import WishlistButton from "@/components/product/WishlistButton";
import CompareButton from "@/components/product/CompareButton";
import StarRating from "@/components/ui/StarRating";
import { getCatalogFeatures } from "@/lib/catalog-features";
import clsx from "clsx";


const ACTION_BASE =
  "flex min-h-11 w-full items-center justify-center gap-2 rounded border py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors motion-reduce:transition-none";


const ACTION_IDLE =
  "border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark";


/*
 * Busy and done sit on `brand-dark` rather than the brand fill they used to.
 * The resting button was an outline, so filling it WAS the feedback; now that it
 * arrives already filled, an identical fill would leave the icon and label
 * carrying the whole state change on their own. The darker shade is the same
 * step the hover takes, so the button never looks like a different control.
 */
const ACTION_BUSY = "cursor-wait border-brand-dark bg-brand-dark text-white";


const ACTION_DONE = "border-brand-dark bg-brand-dark text-white";


const ACTION_DISABLED = "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-600";

const ACTION_CLASS = `${ACTION_BASE} ${ACTION_IDLE} ${FOCUS_RING}`;


const ADDED_FEEDBACK_MS = 1600;

/*
 * The action for a variable product when quick view is off: a link to the
 * detail page. That page renders on the server with no `loading.tsx`, so the
 * click would otherwise do nothing visible until it arrives. `useLinkStatus`
 * only reads the pending state from INSIDE a `<Link>`, which is why the button
 * styling lives on this span and the link itself is a bare wrapper.
 */
function DetailsLinkAction() {
  const { pending } = useLinkStatus();

  return (
    <span className={clsx(ACTION_BASE, pending ? ACTION_BUSY : ACTION_IDLE)}>
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <ShoppingCart size={14} />
          Add to cart
        </>
      )}
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();
  const discount = discountPercent(product.offerPrice, product.sellingPrice);

  
  const { showWishlist, showCompare, showQuickView, openCartOnAdd, cardQuantityControl } =
    getCatalogFeatures();

  const [quickViewOpen, setQuickViewOpen] = useState(false);

  /*
   * The cart line this card is offering, if the shopper already has it — and
   * only while the merchant has switched the card's quantity control on.
   *
   * OFF IS THE DEFAULT, and off means the card is exactly what it was before
   * this existed: one "Add to cart" action, whatever the cart holds. The
   * subscription below still runs, because `Header` and `CartRail` hold it on
   * every page regardless; skipping it here would save nothing and would make
   * the card's behaviour depend on which other components happened to mount.
   *
   * COSTS NO REQUEST. `Header` and `CartRail` hold an unconditional
   * `useGetCartQuery()` subscription on every page, so the cache entry already
   * exists wherever a listing renders and this joins it.
   *
   * DERIVED FROM THE CART, never from "did I add this during this visit". A
   * local flag would be cheaper and wrong in a way the shopper notices: reload
   * the page, or arrive with a cart filled yesterday, and the card would offer
   * "Add to cart" for something already in the cart — and adding again would
   * silently double a quantity they never saw.
   *
   * MATCHED ON product AND variant, because two variants of one product are two
   * lines. A card whose product has variants therefore steps the variant that
   * was added. Where the cart holds MORE THAN ONE line for this product, the
   * card shows its purchase action instead: it cannot say which line a stepper
   * would govern, and changing the wrong variant is worse than not offering the
   * control.
   *
   * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
   * Decision 4.
   */
  const { data: cart = EMPTY_CART } = useGetCartQuery();
  // Off, the card never looks at the cart at all and shows the purchase action
  // it always has, whatever is in it.
  const cartLine = cardQuantityControl ? cartLineForCard(cart.lines, product.id) : undefined;

  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 
  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  
  const actionContent = isLoading ? (
    <>
      <Loader2 size={14} className="animate-spin" />
      Adding...
    </>
  ) : justAdded ? (
    <>
      <Check size={14} className="animate-tick-in motion-reduce:animate-none" />
      Added
    </>
  ) : (
    <>
      <ShoppingCart size={14} />
      Add to cart
    </>
  );

  async function handleAdd() {
    try {
      await addItem({ productId: product.id, quantity: 1 }).unwrap();
   
      setJustAdded(true);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
      // Only the AUTOMATIC open is a setting. Every control whose purpose is
      // to show the cart still opens it — see `catalog-features.ts`.
      if (openCartOnAdd) dispatch(openCart());
    } catch {
     
    }
  }

  return (
   
    <div className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-gray-300 hover:shadow-md motion-reduce:transition-none">
      <div className="relative aspect-7/6 overflow-hidden rounded-md ">
        {discount && (
          <span className="absolute left-0 top-0 z-10 rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
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
      
        <div className="absolute right-0  top-0 z-10 flex flex-col items-end gap-3">
          {!product.inStock && (
            <span className="rounded bg-gray-900/80 px-2 py-1 text-xs font-semibold text-white">
              Sold out
            </span>
          )}
        
          {showWishlist && (
            <WishlistButton
              productId={product.id}
              size={16}
              className={clsx(
                "relative rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-sale",
                "after:absolute after:-inset-1.5 after:content-['']",
                FOCUS_RING,
              )}
            />
          )}
          {showCompare && (
            <CompareButton
              slug={product.slug}
              size={16}
              className={clsx(
                "relative rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:text-brand",
                "after:absolute after:-inset-1.5 after:content-['']",
                FOCUS_RING,
              )}
            />
          )}
        </div>
        
        <Link
          href={`/products/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
         
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw"
            className={clsx(
              "h-full w-full object-contain  transition-transform duration-300",
           
              "group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
              !product.inStock && "opacity-60",
            )}
          />
        </Link>
      </div>
      <div className="mt-2.5 flex flex-1 flex-col">
        <Link
          href={`/products/${product.slug}`}
          className={clsx(
            "line-clamp-2 rounded-sm text-sm font-medium leading-snug text-gray-900 hover:text-brand",
            FOCUS_RING,
          )}
        >
          {product.name}
        </Link>
      
        {product.rating !== undefined && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating rating={product.rating} size={13} />
            <span className="text-xs tabular-nums text-gray-500">({product.reviewCount})</span>
          </div>
        )}

      
        <div className="mt-auto pt-2.5">
          <p
            className={clsx(
              "truncate text-base font-semibold tabular-nums",
              discount ? "text-sale" : "text-gray-900",
            )}
          >
            {formatPrice(product.offerPrice)}
          </p>
          {product.sellingPrice && (
            <p className="truncate text-xs tabular-nums text-gray-500 line-through">
              {formatPrice(product.sellingPrice)}
            </p>
          )}

          <div className="mt-2">
            
            {!product.inStock ? (
         
              <button type="button" className={clsx(ACTION_BASE, ACTION_DISABLED)} disabled>
                Sold out
              </button>
            ) : cartLine ? (
              /*
               * Already in the cart: the stepper REPLACES the purchase action
               * rather than sitting beside it, so the card keeps one action slot
               * and one height.
               *
               * This branch is above the variable/simple split on purpose — once
               * something is in the cart, how it got there stops mattering, and a
               * variable product added through the quick view steps here exactly
               * as a simple one does.
               */
              <CardQuantityControl line={cartLine} productName={product.name} />
            ) : !product.isVariable ? (
              <button
                type="button"
                className={clsx(
                  ACTION_BASE,
                  FOCUS_RING,
                
                  justAdded ? ACTION_DONE : isLoading ? ACTION_BUSY : ACTION_IDLE,
                )}
                onClick={handleAdd}
                disabled={isLoading}
              >
                {actionContent}
              </button>
            ) : showQuickView ? (
            
              <button
                type="button"
                className={ACTION_CLASS}
                onClick={() => setQuickViewOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={quickViewOpen}
              >
                {actionContent}
              </button>
            ) : (

              <Link
                href={`/products/${product.slug}`}
                className={clsx("block rounded", FOCUS_RING)}
              >
                <DetailsLinkAction />
              </Link>
            )}
          </div>
        </div>
      </div>
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
