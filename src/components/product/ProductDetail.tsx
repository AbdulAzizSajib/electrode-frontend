"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Eye, Gift, Loader2, Minus, Plus, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import type { PaginationMeta, Product, ProductImage } from "@/types/product";
import type { RatingBreakdown, Review } from "@/types/review";
import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import { variantIdForImage, visibleImages } from "@/lib/variant-gallery";
import {
  choicesForVariant,
  defaultVariant,
  resolveOptions,
  resolveVariant,
  type OptionChoices,
} from "@/lib/product-options";
import { saveDirectOrderIntent } from "@/lib/guest-checkout";
import { useAddItemMutation } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import ProductGallery from "@/components/product/ProductGallery";
import ProductVideo from "@/components/product/ProductVideo";
import RichText from "@/components/product/RichText";
import { isBlankHtml } from "@/lib/sanitize-html";
import OptionSelector from "@/components/product/OptionSelector";
import ProductCard from "@/components/product/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";
import WishlistButton from "@/components/product/WishlistButton";
import CompareButton from "@/components/product/CompareButton";
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

  /*
   * Selection is a value per option, not a variant id: on a two-option product
   * "Black" is not a variant, so there is nothing to store until both options
   * are answered. The variant is derived from the choices instead.
   *
   * Seeded from the default variant so a single-option product opens resolved,
   * exactly as it did before options existed.
   */
  const [choices, setChoices] = useState<OptionChoices>(() =>
    choicesForVariant(product, defaultVariant(product)),
  );

  const selection = resolveOptions(product, choices);
  const selectedVariant = selection.variant;
  const selectedVariantId = selectedVariant?.id ?? null;

  // Every image, ordered so the selected option's photos lead. Derived rather
  // than stored — there is no second piece of state to fall out of step when the
  // variant changes. Nothing is ever filtered out: the selection decides which
  // image leads, not which images exist.
  const galleryImages = visibleImages(images, selectedVariantId);

  // The displayed image, as a url. `undefined` means "the first one in order",
  // which is what makes selecting an option move to that option's photo without
  // an effect.
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  /**
   * Picking a value on one option control.
   *
   * The gallery moves to the newly-resolved variant's first image by clearing
   * the explicit image choice, so the display falls through to the head of the
   * reordered list. When the resolution has no photo of its own — including
   * while the selection is still incomplete — there is nothing to move to, and
   * clearing would displace whatever the shopper was looking at with an
   * unrelated photo, so the current image is pinned instead.
   *
   * `activeImage` is declared below; this only reads it on click, long after
   * render has initialised it.
   */
  function selectOptionValue(optionId: string, valueId: string) {
    const next = { ...choices, [optionId]: valueId };
    const nextVariantId = resolveVariant(product, next)?.id;
    const hasOwnImage =
      nextVariantId !== undefined &&
      images.some((img) => img.variantId === nextVariantId);

    setChoices(next);
    setActiveImageUrl(hasOwnImage ? undefined : activeImage?.url);
    setQuantity(1);
  }

  /**
   * Selecting a thumbnail. One transition, setting the image AND the selection
   * together.
   *
   * Doing it in two steps looks equivalent and is not: changing the selection
   * reorders the gallery, and the "show the first image of the new selection"
   * rule then displaces the very photo just clicked. Setting the url here means
   * that rule only ever applies to changes coming from an option control.
   */
  function selectImage(image: ProductImage) {
    setActiveImageUrl(image.url);
    const variantId = variantIdForImage(image);
    // A shared image depicts no particular option, so it leaves the choice be.
    if (!variantId) return;

    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) setChoices(choicesForVariant(product, variant));
  }

  const [tab, setTab] = useState<ProductTab>("description");
  const [error, setError] = useState("");

  /** Jumps from the rating row under the title down to the reviews panel. */
  function showReviews() {
    setTab("reviews");
    document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" });
  }

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

  // Nothing may be added until every option is answered — an incomplete
  // selection does not name a product to buy. `selection.isComplete` covers a
  // legacy product too, whose single synthetic option opens already answered.
  const canAdd =
    availableStock > 0 &&
    (product.variants.length === 0 ? !product.isVariable : selection.isComplete);

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
        <div>
          <ProductGallery
            images={galleryImages}
            activeUrl={activeImage?.url}
            onSelect={selectImage}
            title={product.name}
          />
          {/* Beside the gallery, not inside it: gallery images are filtered by
              the selected variant, and the video belongs to the product. */}
          {product.video && (
            <ProductVideo
              url={product.video}
              thumbnail={product.videoThumbnail}
              title={product.name}
            />
          )}
        </div>

        <div>
          {/* A badge is presentation the merchant chose; absent means nothing
              is shown, not an empty chip. */}
          {product.badge && (
            <span className="mb-2 inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
              {product.badge}
            </span>
          )}

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

          {product.unit && (
            <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
          )}

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

          {/* The overview is merchant-authored markup now, so it goes through
              the same sanitiser as the full description. */}
          {!isBlankHtml(product.shortDescription) && (
            <RichText html={product.shortDescription as string} className="mt-4" />
          )}

          {product.bundleDeal && (
            <p className="mt-4 inline-flex items-center gap-2 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
              <Gift size={15} />
              Buy {product.bundleDeal.buyQuantity}, get {product.bundleDeal.freeQuantity} free
            </p>
          )}

          {/*
            Refundable and warranty are tri-state: `undefined` means the merchant
            has not said, and nothing is shown for it. Rendering "No" there would
            assert a returns policy on their behalf.
          */}
          {(product.isRefundable !== undefined || product.hasWarranty !== undefined) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {product.isRefundable !== undefined && (
                <span className="inline-flex items-center gap-1.5 text-gray-600">
                  {product.isRefundable ? (
                    <RotateCcw size={15} className="text-green-600" />
                  ) : (
                    <XCircle size={15} className="text-gray-400" />
                  )}
                  {product.isRefundable ? "Refundable" : "Not refundable"}
                </span>
              )}
              {product.hasWarranty !== undefined && (
                <span className="inline-flex items-center gap-1.5 text-gray-600">
                  {product.hasWarranty ? (
                    <ShieldCheck size={15} className="text-green-600" />
                  ) : (
                    <XCircle size={15} className="text-gray-400" />
                  )}
                  {product.hasWarranty ? "Warranty included" : "No warranty"}
                </span>
              )}
            </div>
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

          {/*
            This line used to read "N people are viewing this right now" from a
            random number generated on mount — the same class of fabrication as
            the countdown above, and it survived that cleanup.

            It now states the product's real recorded view count. The wording is
            past tense on purpose: the count is a lifetime total and carries no
            information about the present moment, so it must not claim any. A
            product nobody has opened shows nothing rather than a zero.
          */}
          {product.viewCount > 0 && (
            <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Eye size={14} /> {formatCount(product.viewCount)}{" "}
              {product.viewCount === 1 ? "person has" : "people have"} viewed this
              product
            </p>
          )}

          <p className="mt-3 text-sm">
            <span className="font-semibold text-gray-700">Availability: </span>
            {availableStock > 0 ? (
              <span className="text-green-600">{availableStock} in stock</span>
            ) : (
              <span className="text-sale">Sold out</span>
            )}
          </p>

          <OptionSelector
            options={selection.options}
            onSelect={selectOptionValue}
            className="mt-5"
          />

          {/* Names what is still missing rather than leaving a disabled button
              with no explanation. */}
          {selection.unansweredNames.length > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              Choose a {selection.unansweredNames.join(" and a ")} to continue.
            </p>
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
            <CompareButton slug={product.slug} size={16} withLabel className="hover:text-brand" />
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
        {tab === "description" &&
          (isBlankHtml(product.description) ? (
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
              No description available for this product yet.
            </p>
          ) : (
            /* Merchant-authored markup. `RichText` sanitises it here, where it
               meets the browser — never trusting what was stored. */
            <RichText html={product.description as string} className="max-w-3xl" />
          ))}
        {tab === "shipping" && (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
            Free shipping on orders over ৳130. Items can be returned or exchanged within 30 days of
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
