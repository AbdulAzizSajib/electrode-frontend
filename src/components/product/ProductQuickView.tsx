"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import type { Product, ProductImage } from "@/types/product";
import { discountPercent, formatPrice } from "@/lib/format";
import { variantIdForImage, visibleImages } from "@/lib/variant-gallery";
import {
  choicesForVariant,
  defaultVariant,
  resolveOptions,
  resolveVariant,
  type OptionChoices,
} from "@/lib/product-options";
import { useAddItemMutation } from "@/store/cartApi";
import { useGetProductBySlugQuery } from "@/store/productApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import Modal from "@/components/ui/Modal";
import ProductGallery from "@/components/product/ProductGallery";
import OptionSelector from "@/components/product/OptionSelector";
import CompareButton from "@/components/product/CompareButton";

interface ProductQuickViewProps {
  /** The card's product — carries name, image and price, but never variants. */
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  const dispatch = useAppDispatch();
  const titleId = useId();
  const [addItem, { isLoading: isAdding }] = useAddItemMutation();

  // A closed quick view holds no subscription; the cache entry is keyed by slug
  // so a response arriving after the shopper moved on cannot be shown here.
  const {
    data: detailed,
    isFetching,
    isError,
  } = useGetProductBySlugQuery(product.slug, { skip: !isOpen });

  // Only the shopper's *explicit* choices are state. The effective selection is
  // derived below, so the preselected variant needs no effect to install it —
  // which also means it cannot briefly render as unselected, and does not have
  // to wait for `detailed` to arrive before seeding.
  const [chosenValues, setChosenValues] = useState<OptionChoices | null>(null);
  /** Displayed image url; `undefined` means "the first visible one". */
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState("");

  const variants = detailed?.variants ?? [];

  /*
   * Options resolve against the fetched detail, which is the only payload
   * carrying them. Until it arrives there are no options and no variants, so
   * the panel renders the card's own price and cannot be added — which is what
   * `canAdd`'s `Boolean(detailed)` already required.
   *
   * Choices default to those selecting the first in-stock variant, so a shopper
   * indifferent to the choice is not blocked. Deriving rather than storing that
   * default means it needs no effect and cannot briefly render as unselected.
   */
  const selection = detailed
    ? resolveOptions(
        detailed,
        chosenValues ?? choicesForVariant(detailed, defaultVariant(detailed)),
      )
    : null;

  const selectedVariant = selection?.variant ?? null;
  const selectedVariantId = selectedVariant?.id ?? null;

  /**
   * Picking a value on one option control. Moves to the newly-resolved
   * variant's first image, or leaves the displayed photo alone when it has none
   * of its own (see ProductDetail). `images` and `activeImage` are declared
   * below; this only reads them on click, long after render has initialised
   * them.
   */
  function selectOptionValue(optionId: string, valueId: string) {
    if (!detailed) return;

    const current =
      chosenValues ?? choicesForVariant(detailed, defaultVariant(detailed));
    const next = { ...current, [optionId]: valueId };
    const nextVariantId = resolveVariant(detailed, next)?.id;
    const hasOwnImage =
      nextVariantId !== undefined &&
      images.some((img) => img.variantId === nextVariantId);

    setChosenValues(next);
    setActiveImageUrl(hasOwnImage ? undefined : activeImage?.url);
    setQuantity(1);
  }

  /**
   * Selecting a thumbnail sets the image and the selection in one transition, so
   * the "first image of the new selection" rule cannot displace the photo just
   * clicked. Same reasoning as ProductDetail.
   */
  function selectImage(image: ProductImage) {
    setActiveImageUrl(image.url);
    const variantId = variantIdForImage(image);
    if (!variantId || !detailed) return;

    const variant = variants.find((v) => v.id === variantId);
    if (variant) setChosenValues(choicesForVariant(detailed, variant));
  }

  // Clear transient state as the dialog closes rather than reacting to it
  // having closed, so a reopened panel never flashes a previous error.
  function handleClose() {
    setAddError("");
    setChosenValues(null);
    setActiveImageUrl(undefined);
    setQuantity(1);
    onClose();
  }

  // Fall back to the card's own values while the details load, so the panel is
  // populated from the first frame rather than blank.
  const base = detailed ?? product;
  const activePrice = selectedVariant?.price ?? base.price;
  const activeCompareAt = selectedVariant?.compareAtPrice ?? base.compareAtPrice;
  const discount = discountPercent(activePrice, activeCompareAt);

  const availableStock = selectedVariant
    ? selectedVariant.stockQuantity
    : base.stockQuantity;

  const images: ProductImage[] =
    base.images.length > 0 ? base.images : [{ url: base.image, variantId: null }];

  // Every image, ordered so the selected option's photos lead. Derived, not
  // stored, and never filtered — same rule as the detail page.
  const galleryImages = visibleImages(images, selectedVariantId);
  const activeImage =
    galleryImages.find((img) => img.url === activeImageUrl) ?? galleryImages[0];

  // Nothing may be added until the real choices are known — the card's props
  // cannot tell us whether an option is still unanswered.
  const canAdd =
    Boolean(detailed) &&
    !isFetching &&
    availableStock > 0 &&
    (variants.length === 0 ? !detailed?.isVariable : Boolean(selection?.isComplete)) &&
    !isAdding;

  async function handleAddToCart() {
    setAddError("");
    try {
      await addItem({
        productId: base.id,
        variantId: selectedVariantId ?? undefined,
        quantity,
      }).unwrap();

      // Close before opening the drawer: both are fixed z-50 overlays, and
      // leaving this mounted underneath would stack two backdrops and two
      // focus traps. Closing first also hands focus back cleanly.
      handleClose();
      dispatch(openCart());
    } catch {
      setAddError("Could not add this to your cart. Please try again.");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledById={titleId}
      closeLabel="Close quick view"
    >
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            {base.name}
          </h2>
          <p className="text-sm text-gray-500">
            We couldn&apos;t load this preview. You can still view the full product page.
          </p>
          <Link
            href={`/products/${base.slug}`}
            onClick={handleClose}
            className="flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            View Full Product Details <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2">
          <ProductGallery
            images={galleryImages}
            activeUrl={activeImage?.url}
            onSelect={selectImage}
            title={base.name}
          />

          <div className="flex flex-col">
            {base.brand && <p className="text-xs text-gray-500">{base.brand}</p>}

            <h2
              id={titleId}
              className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl"
            >
              {base.name}
            </h2>

            <div className="mt-3 flex items-center gap-3">
              {activeCompareAt && activeCompareAt > activePrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(activeCompareAt)}
                </span>
              )}
              <span className="text-2xl font-bold text-sale">
                {formatPrice(activePrice)}
              </span>
              {discount && (
                <span className="rounded bg-brand px-2 py-1 text-xs font-semibold text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {base.shortDescription && (
              <p className="mt-4 text-sm text-gray-600">{base.shortDescription}</p>
            )}

            {isFetching ? (
              <p className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Loading options...
              </p>
            ) : (
              <>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-gray-700">Availability: </span>
                  {availableStock > 0 ? (
                    <span className="text-green-600">{availableStock} in stock</span>
                  ) : (
                    <span className="text-sale">Sold out</span>
                  )}
                </p>

                {selection && (
                  <OptionSelector
                    options={selection.options}
                    onSelect={selectOptionValue}
                    className="mt-5"
                  />
                )}

                {selection && selection.unansweredNames.length > 0 && (
                  <p className="mt-3 text-sm text-gray-500">
                    Choose a {selection.unansweredNames.join(" and a ")} to continue.
                  </p>
                )}

                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-gray-700">Quantity</p>
                  <div className="flex items-center rounded border border-gray-300 w-fit">
                    <button
                      className="p-3 disabled:cursor-not-allowed disabled:text-gray-300"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      className="p-3 disabled:cursor-not-allowed disabled:text-gray-300"
                      // Never let the shopper ask for more than the merchant has.
                      onClick={() =>
                        setQuantity((q) => Math.min(availableStock, q + 1))
                      }
                      disabled={quantity >= availableStock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {addError && <p className="mt-4 text-sm text-red-600">{addError}</p>}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="flex w-full items-center justify-center gap-2 rounded bg-brand py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isAdding && <Loader2 size={16} className="animate-spin" />}
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>

              <Link
                href={`/products/${base.slug}`}
                onClick={handleClose}
                className="flex items-center justify-center gap-2 rounded border border-brand py-3 text-sm font-semibold uppercase text-brand transition-colors hover:bg-gray-50"
              >
                View Full Product Details <ArrowRight size={16} />
              </Link>

              <CompareButton
                slug={base.slug}
                withLabel
                className="justify-center py-1 text-sm text-gray-500 hover:text-brand"
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
