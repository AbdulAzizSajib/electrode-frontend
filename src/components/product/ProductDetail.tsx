"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Eye, Heart, Minus, Plus, Repeat } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/cart-context";
import StarRating from "@/components/ui/StarRating";
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
  const { addItem, openCart } = useCart();
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = discountPercent(product.price, product.compareAtPrice);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "shipping">("description");

  // Randomized "viewers" count. Starts at a fixed value so server and client
  // markup match on hydration, then randomizes client-side after mount.
  const [viewers, setViewers] = useState(14);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewers(8 + Math.floor(Math.random() * 20));
  }, []);

  function handleAddToCart() {
    addItem(product.id, quantity, Object.keys(selectedOptions).length ? selectedOptions : undefined);
  }

  function handleBuyNow() {
    handleAddToCart();
    openCart();
  }

  return (
    <div className="container-px mx-auto max-w-346 py-8">
      <p className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>{" "}
        / {product.title}
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div>
          {product.rating !== undefined && (
            <div className="mb-2 flex items-center gap-2">
              <StarRating rating={product.rating} />
              {product.reviewCount !== undefined && (
                <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
              )}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-2xl font-bold text-sale">{formatPrice(product.price)}</span>
            {discount && (
              <span className="rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 line-clamp-3 text-sm text-gray-600">{product.description}</p>
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
            {product.inStock ? (
              <span className="text-green-600">{product.stockCount ?? "In"} in stock</span>
            ) : (
              <span className="text-sale">Sold out</span>
            )}
          </p>

          {product.options?.map((opt) => (
            <div key={opt.name} className="mt-5">
              <p className="mb-2 text-sm font-semibold text-gray-700">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: value }))}
                    className={clsx(
                      "rounded border px-4 py-2 text-sm transition-colors",
                      selectedOptions[opt.name] === value
                        ? "border-brand bg-brand/5 text-brand font-semibold"
                        : "border-gray-300 text-gray-600 hover:border-brand"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 rounded border border-brand py-3 text-sm font-semibold uppercase text-brand hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 rounded bg-brand py-3 text-sm font-semibold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Buy It Now
            </button>
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
            {product.sku && <p>SKU: {product.sku}</p>}
            <p>Vendor: {product.vendor}</p>
            <p>Category: {product.category}</p>
            {product.tags && product.tags.length > 0 && <p>Tags: {product.tags.join(", ")}</p>}
          </div>
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
                tab === t ? "border-brand text-brand" : "border-transparent text-gray-500"
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
