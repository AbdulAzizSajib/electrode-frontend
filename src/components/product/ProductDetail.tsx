"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Eye, Heart, Loader2, Minus, Plus, Repeat } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductGallery from "@/components/product/ProductGallery";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();

  const images = product.images.length > 0 ? product.images : [product.image];

  // Pre-select the first in-stock variant so a shopper who does not care about
  // the choice is not blocked, while the selection stays explicit and visible.
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    () => product.variants.find((v) => v.inStock)?.id ?? product.variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "shipping">("description");
  const [error, setError] = useState("");

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? null;

  // What the shopper actually pays: the chosen variant's price when there is
  // one, the product's base price otherwise.
  const activePrice = selectedVariant?.price ?? product.price;
  const activeCompareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const discount = discountPercent(activePrice, activeCompareAt);

  const availableStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  // Show a price on every variant chip as soon as they are not all identical.
  // Comparing each against the product's base price instead would leave the
  // one that happens to match the base with no price while its siblings show
  // theirs, which reads as a rendering fault rather than a deliberate omission.
  const variantPricesDiffer =
    new Set(product.variants.map((v) => v.price)).size > 1;
  const canAdd =
    availableStock > 0 && (!product.isVariable || selectedVariantId !== null);

  // Randomized "viewers" count. Starts at a fixed value so server and client
  // markup match on hydration, then randomizes client-side after mount.
  const [viewers, setViewers] = useState(14);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewers(8 + Math.floor(Math.random() * 20));
  }, []);

  async function handleAddToCart() {
    setError("");
    try {
      await addItem({
        productId: product.id,
        variantId: selectedVariantId ?? undefined,
        quantity,
      }).unwrap();
      dispatch(openCart());
    } catch {
      setError("Could not add this to your cart. Please try again.");
    }
  }

  return (
    <div className="container-px mx-auto max-w-346 py-8">
      <p className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>{" "}
        / {product.name}
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={images} title={product.name} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {activeCompareAt && activeCompareAt > activePrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(activeCompareAt)}
              </span>
            )}
            <span className="text-2xl font-bold text-sale">{formatPrice(activePrice)}</span>
            {discount && (
              <span className="rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-sm text-gray-600">{product.shortDescription}</p>
          )}

          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">Hurry Up! Deal Ends In:</p>
            <CountdownTimer />
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <Eye size={14} /> {viewers} people are viewing this right now
          </p>

          <p className="mt-3 text-sm">
            <span className="font-semibold text-gray-700">Availability: </span>
            {availableStock > 0 ? (
              <span className="text-green-600">{availableStock} in stock</span>
            ) : (
              <span className="text-sale">Sold out</span>
            )}
          </p>

          {product.variants.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Option
                {selectedVariant && (
                  <span className="ml-1 font-normal text-gray-500">
                    — {selectedVariant.name}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    disabled={!variant.inStock}
                    className={clsx(
                      "rounded border px-4 py-2 text-sm transition-colors",
                      selectedVariantId === variant.id
                        ? "border-brand bg-brand/5 font-semibold text-brand"
                        : "border-gray-300 text-gray-600 hover:border-brand",
                      !variant.inStock && "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {variant.name}
                    {variantPricesDiffer && (
                      <span className="ml-2 text-xs">{formatPrice(variant.price)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded border border-gray-300">
                <button
                  className="p-3"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  className="p-3"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!canAdd || isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded border border-brand py-3 text-sm font-semibold uppercase text-brand hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <Link
              href="/checkout"
              onClick={(e) => {
                if (!canAdd || isLoading) e.preventDefault();
                else void handleAddToCart();
              }}
              aria-disabled={!canAdd || isLoading}
              className={clsx(
                "flex-1 rounded py-3 text-center text-sm font-semibold uppercase text-white",
                canAdd && !isLoading
                  ? "bg-brand hover:bg-brand-dark"
                  : "pointer-events-none bg-gray-300",
              )}
            >
              Buy It Now
            </Link>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            <button className="flex items-center gap-1.5 hover:text-brand">
              <Heart size={16} /> Wishlist
            </button>
            <button className="flex items-center gap-1.5 hover:text-brand">
              <Repeat size={16} /> Compare
            </button>
          </div>

          <div className="mt-6 space-y-1 border-t border-gray-100 pt-4 text-sm text-gray-500">
            <p>SKU: {selectedVariant?.sku ?? product.sku}</p>
            {product.brand && <p>Brand: {product.brand}</p>}
            {product.category && <p>Category: {product.category}</p>}
          </div>

          {product.attributes.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="mb-3 text-sm font-semibold text-gray-700">Specifications</p>
              <dl className="space-y-2 text-sm">
                {product.attributes.map((attr) => (
                  <div key={`${attr.name}-${attr.value}`} className="flex gap-3">
                    <dt className="w-40 shrink-0 text-gray-500">{attr.name}</dt>
                    <dd className="text-gray-800">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-gray-100 pt-8">
        <div className="mb-6 flex gap-8 border-b border-gray-100">
          {(["description", "shipping"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "border-b-2 pb-3 text-sm font-semibold capitalize",
                tab === t ? "border-brand text-brand" : "border-transparent text-gray-500",
              )}
            >
              {t === "description" ? "Description" : "Shipping & Returns"}
            </button>
          ))}
        </div>
        {tab === "description" ? (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
            {product.description ?? "No description available for this product yet."}
          </p>
        ) : (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
            Free shipping on orders over $130. Items can be returned or exchanged within 30 days of
            delivery in original condition. Contact support to start a return.
          </p>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
