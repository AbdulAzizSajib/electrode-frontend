"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { FOCUS_RING } from "@/lib/focus-ring";
import { useAddItemMutation } from "@/store/cartApi";
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


const ACTION_IDLE = "border-brand bg-white text-brand hover:bg-brand hover:text-white";


const ACTION_BUSY = "cursor-wait border-brand bg-brand text-white";


const ACTION_DONE = "border-brand bg-brand text-white";


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

  
  const { showWishlist, showCompare, showQuickView } = getCatalogFeatures();

  const [quickViewOpen, setQuickViewOpen] = useState(false);

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
      dispatch(openCart());
    } catch {
     
    }
  }

  return (
   
    <div className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-gray-300 hover:shadow-md motion-reduce:transition-none">
      <div className="relative aspect-7/6 overflow-hidden rounded-md bg-gray-100">
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
