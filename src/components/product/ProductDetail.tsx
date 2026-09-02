"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Eye, Loader2, Minus, Plus, Repeat } from "lucide-react";
import type { PaginationMeta, Product, ProductImage } from "@/types/product";
import type { RatingBreakdown, Review } from "@/types/review";
import { discountPercent, formatPrice } from "@/lib/format";
import { variantIdForImage, visibleImages } from "@/lib/variant-gallery";
import { saveDirectOrderIntent } from "@/lib/guest-checkout";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/product/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";
import WishlistButton from "@/components/product/WishlistButton";
import StarRating from "@/components/ui/StarRating";

/** The tab strip is a literal list, not data — adding a panel means widening this. */
type ProductTab = "description" | "shipping" | "reviews";

const TABS: { id: ProductTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
];

export default function ProductDetail({
  product,
  related,
  initialReviews,
  initialBreakdown,
  initialReviewMeta,
  reviewsUnavailable,
  isSignedIn,
}: {
  product: Product;
  related: Product[];
  initialReviews: Review[];
  initialBreakdown: RatingBreakdown | null;
  initialReviewMeta: PaginationMeta;
  reviewsUnavailable: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [addItem, { isLoading }] = useAddItemMutation();

  const images: ProductImage[] =
    product.images.length > 0
      ? product.images
      : [{ url: product.image, variantId: null }];

  // Only the shopper's explicit choice is stored; the effective variant is
  // derived, so an id left over from a previously-rendered product cannot
  // survive as a selection this product does not have.
  const [chosenVariantId, setChosenVariantId] = useState<string | null>(null);
  const defaultVariantId =
    product.variants.find((v) => v.inStock)?.id ?? product.variants[0]?.id ?? null;
  const selectedVariantId =
    chosenVariantId && product.variants.some((v) => v.id === chosenVariantId)
      ? chosenVariantId
      : defaultVariantId;

  // Which images this selection shows, derived rather than stored — there is no
  // second piece of state to fall out of step when the variant changes.
  const galleryImages = visibleImages(images, selectedVariantId);

  // The displayed image, as a url. `undefined` means "the first visible one",
  // which is what makes selecting an option reset the view to that option's
  // first photo without an effect.
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  /**
   * Selecting an option through the option control: move to that option's first
   * image by clearing the explicit image choice.
   */
  function selectVariant(variantId: string) {
    setChosenVariantId(variantId);
    setActiveImageUrl(undefined);
    setQuantity(1);
  }

  /**
   * Selecting a thumbnail. One transition, setting the image AND the variant
   * together.
   *
   * Doing it in two steps looks equivalent and is not: changing the variant
   * re-filters the gallery, and the "show the first image of the new selection"
   * rule then displaces the very photo just clicked. Setting the url here means
   * the reset rule only ever applies to changes coming from the option control.
   */
  function selectImage(image: ProductImage) {
    setActiveImageUrl(image.url);
    const variantId = variantIdForImage(image);
    // A shared image depicts no particular option, so it leaves the choice be.
    if (variantId) setChosenVariantId(variantId);
  }

  const [tab, setTab] = useState<ProductTab>("description");
  const [error, setError] = useState("");

  /** Jumps from the rating row under the title down to the reviews panel. */
  function showReviews() {
    setTab("reviews");
    document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" });
  }

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? null;

  // The image actually on screen — the gallery resolves an unknown url to the
  // first visible image, so this mirrors that rule rather than guessing.
  const activeImage =
    galleryImages.find((img) => img.url === activeImageUrl) ?? galleryImages[0];

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

  /**
   * Buys this one product on its own. Deliberately does NOT add to the cart
   * first: the backend takes checkout lines directly, so a shopper arriving
   * from a campaign link goes product → checkout in one step, and whatever they
   * already had in their cart is left exactly as it was.
   *
   * The display fields ride along only so checkout can render the item — the
   * server resolves name, SKU and price itself, so nothing here is trusted.
   */
  function handleBuyItNow() {
    setError("");
    saveDirectOrderIntent({
      item: {
        productId: product.id,
        variantId: selectedVariantId ?? undefined,
        quantity,
      },
      display: {
        name: product.name,
        // The photo the shopper is looking at, not a fixed first image — which
        // would show the wrong colour after switching options.
        image: activeImage?.url ?? "",
        unitPrice: activePrice,
        variantName: selectedVariant?.name,
      },
    });
    router.push("/checkout");
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
        <ProductGallery
          images={galleryImages}
          activeUrl={activeImage?.url}
          onSelect={selectImage}
          title={product.name}
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

          {/* Omitted entirely for an unrated product — see toProduct: `rating`
              is undefined until the product actually has published reviews. */}
          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} out of 5
              </span>
              <button
                type="button"
                onClick={showReviews}
                className="text-sm text-brand underline-offset-2 hover:underline"
              >
                {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
              </button>
            </div>
          )}

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

          {/*
            A "Hurry Up! Deal Ends In:" countdown used to render here on every
            product page, including products with no deal at all. It counted
            down from seven days computed at mount, so it restarted on every
            page load and expired on no real date.

            Removed rather than repointed: `Product` carries no deadline, since
            the product endpoints return `campaignPrice` but not the campaign's
            `endsAt`. Restoring a genuine countdown here means widening that
            payload, which is its own change. An absent countdown is honest; a
            fabricated one is not.
          */}

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
                    onClick={() => selectVariant(variant.id)}
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
            <button
              type="button"
              onClick={handleBuyItNow}
              disabled={!canAdd || isLoading}
              className={clsx(
                "flex-1 rounded py-3 text-center text-sm font-semibold uppercase text-white",
                canAdd && !isLoading
                  ? "bg-brand hover:bg-brand-dark"
                  : "cursor-not-allowed bg-gray-300",
              )}
            >
              Buy It Now
            </button>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            <WishlistButton
              productId={product.id}
              size={16}
              withLabel
              standalone
              className="hover:text-brand"
            />
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

      <div id="product-tabs" className="mt-12 border-t border-gray-100 pt-8">
        <div className="mb-6 flex gap-8 border-b border-gray-100">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={clsx(
                "border-b-2 pb-3 text-sm font-semibold",
                tab === id ? "border-brand text-brand" : "border-transparent text-gray-500",
              )}
            >
              {label}
              {id === "reviews" && product.reviewCount > 0 && ` (${product.reviewCount})`}
            </button>
          ))}
        </div>
        {tab === "description" && (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
            {product.description ?? "No description available for this product yet."}
          </p>
        )}
        {tab === "shipping" && (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
            Free shipping on orders over $130. Items can be returned or exchanged within 30 days of
            delivery in original condition. Contact support to start a return.
          </p>
        )}
        {tab === "reviews" && (
          <ProductReviews
            productId={product.id}
            initialReviews={initialReviews}
            initialBreakdown={initialBreakdown}
            initialMeta={initialReviewMeta}
            initialError={reviewsUnavailable}
            isSignedIn={isSignedIn}
          />
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
