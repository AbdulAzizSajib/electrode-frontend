"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { useCart } from "@/contexts/cart-context";
import StarRating from "@/components/ui/StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compareAtPrice);
  const hasOptions = product.options && product.options.length > 0;

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
        <Link href={`/products/${product.handle}`}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </Link>
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-gray-500">{product.vendor}</p>
        <Link
          href={`/products/${product.handle}`}
          className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 hover:text-brand"
        >
          {product.title}
        </Link>
        {product.rating !== undefined && (
          <div className="mt-1.5">
            <StarRating rating={product.rating} />
          </div>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-sm font-semibold text-sale">{formatPrice(product.price)}</span>
        </div>
        {hasOptions ? (
          <Link
            href={`/products/${product.handle}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <ShoppingCart size={14} />
            Options
          </Link>
        ) : (
          <button
            onClick={() => addItem(product.id, 1)}
            disabled={!product.inStock}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-brand py-2 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
          >
            <ShoppingCart size={14} />
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
