"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Eye,
  Gift,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import type { PaginationMeta, Product, ProductImage } from "@/types/product";
import type { RatingBreakdown, Review } from "@/types/review";
import { discountPercent, formatCount, formatPrice } from "@/lib/format";
import { firstImageForVariant, variantIdForImage } from "@/lib/variant-gallery";
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
import { getCatalogFeatures } from "@/lib/catalog-features";

/** The tab strip is a literal list, not data — adding a panel means widening this. */
type ProductTab = "description" | "shipping" | "reviews";

const TABS: { id: ProductTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
];

/**
 * The most a shopper may put in the box in one go.
 *
 * Stock is the real ceiling and is applied first; this only covers the case
 * where stock is high enough that the stepper stops being a stepper. Nobody
 * reaches 99 by clicking, so the cap costs a genuine buyer nothing while
 * keeping a held-down key from sending a four-digit quantity to checkout.
 */
const MAX_QUANTITY = 99;

/**
 * Focus ring for every control on this page.
 *
 * The page shipped with none, so each of the quantity stepper, the tabs, the
 * rating jump and both CTAs fell back to the browser's default outline — which
 * belongs to no design system and differs per engine. Drawn from the brand
 * token, offset so it reads as a ring around the control rather than a border
 * on it, and `focus-visible` so a mouse click never paints one.
 */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/**
 * Everything the two buy buttons share.
 *
 * They are a matched pair and must stay the same size, weight and rhythm — only
 * their fill differs. Previously each carried its own full class string in a
 * different idiom, which is how one of them ended up without a transition.
 *
 * `h-12` rather than `py-3`: the primary has no icon and the secondary does, so
 * padding alone left the two a few pixels apart in height whenever the spinner
 * appeared.
 */
const BUY_BUTTON_BASE =
  "flex h-12 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed";

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

  const { showWishlist, showCompare } = getCatalogFeatures();

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

  // `images` goes to the gallery as-is. Nothing is filtered out — the selection
  // decides which image leads, not which images exist — and nothing is
  // reordered either: a strip that puts the selected photo first can never show
  // the highlight ring moving, because the selected thumbnail is always the
  // first one.

  // The displayed image, as a url. `undefined` means "follow the selection",
  // which is what makes picking an option move to that option's photo without
  // an effect and without a second piece of state to fall out of step.
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  /**
   * Picking a value on one option control.
   *
   * The gallery moves to the newly-resolved variant's first image by clearing
   * the explicit image choice, so the display falls through to whatever the
   * selection points at. When the resolution has no photo of its own —
   * including while the selection is still incomplete — there is nothing to
   * move to, and clearing would displace whatever the shopper was looking at
   * with an unrelated photo, so the current image is pinned instead.
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
   * Doing it in two steps looks equivalent and is not: an explicit url is what
   * stops the "follow the selection" fallback from swapping the very photo just
   * clicked for the variant's primary one, on a variant with several photos.
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

  /**
   * The tab buttons, so the strip can move focus itself.
   *
   * A tablist is a single tab stop: arrow keys move between tabs, and Tab
   * leaves for the panel. That requires focusing a sibling programmatically,
   * which needs a handle on the elements.
   */
  const tabRefs = useRef<Partial<Record<ProductTab, HTMLButtonElement | null>>>({});

  /**
   * Jumps from the rating row under the title down to the reviews panel.
   *
   * Focus follows the scroll rather than staying behind on the rating link. A
   * keyboard or screen-reader user who activates this would otherwise be
   * looking at reviews with their focus still twelve hundred pixels up the
   * page, and their next Tab would walk them back through the buy controls.
   */
  function showReviews() {
    setTab("reviews");
    document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" });
    tabRefs.current.reviews?.focus({ preventScroll: true });
  }

  /**
   * Arrow-key movement across the tab strip, per the tabs pattern: Left/Right
   * wrap around the ends, Home/End jump to them. Selection follows focus, which
   * is the correct choice here because every panel is already rendered — moving
   * to one costs nothing, so there is no reason to make the shopper confirm.
   */
  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const index = TABS.findIndex((t) => t.id === tab);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;

    event.preventDefault();
    const nextTab = TABS[next].id;
    setTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  // The image actually on screen, resolved in the order the shopper's intent
  // runs: the photo they explicitly picked, else the selected variant's own
  // photo, else the product's primary. The middle rung is what the gallery's
  // reordering used to provide, moved here where it belongs — it is a fact
  // about the selection, not about how a strip is laid out.
  const activeImage =
    images.find((img) => img.url === activeImageUrl) ??
    firstImageForVariant(images, selectedVariantId) ??
    images[0];

  // What the shopper actually pays: the chosen variant's price when there is
  // one, the product's base price otherwise.
  const activePrice = selectedVariant?.offerPrice ?? product.offerPrice;
  const activeCompareAt = selectedVariant?.sellingPrice ?? product.sellingPrice;
  const discount = discountPercent(activePrice, activeCompareAt);

  const availableStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  /*
   * The quantity box used to climb without limit — `q + 1` on every click, with
   * nothing reading stock. A shopper could ask for forty of a three-in-stock
   * item and only find out at the server, after entering an address.
   *
   * The ceiling is the stock actually available for the current selection, so
   * it moves when the shopper picks a different variant. `selectOptionValue`
   * already resets the quantity to 1 on that change, so the displayed value can
   * never be left above a newly-lower ceiling.
   */
  const maxQuantity = Math.max(1, Math.min(availableStock, MAX_QUANTITY));
  const atMaxQuantity = quantity >= maxQuantity;

  function changeQuantity(next: number) {
    setQuantity(Math.max(1, Math.min(next, maxQuantity)));
  }

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
    <div className="container-px site-container py-8">
      {/* A real trail, not two labels: the middle rung is what a shopper who
          arrived from search uses to reach the category they never visited.
          Marked up as a nav so it is skippable and announced as one thing, and
          the current page carries `aria-current` rather than relying on being
          the unlinked item. */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
          <li>
            <Link href="/" className={clsx("rounded-sm hover:text-brand", FOCUS_RING)}>
              Home
            </Link>
          </li>
          <li aria-hidden className="text-gray-300">
            /
          </li>
          {/* Gated on the SLUG, not the name: `/products` resolves the
              `category` param as a slug, so linking the display name would
              produce a filter that silently matches nothing. A product whose
              category has a name but no slug shows no rung rather than a
              broken one. */}
          {product.category && product.categorySlug && (
            <>
              <li>
                <Link
                  href={`/products?category=${encodeURIComponent(product.categorySlug)}`}
                  className={clsx("rounded-sm hover:text-brand", FOCUS_RING)}
                >
                  {product.category}
                </Link>
              </li>
              <li aria-hidden className="text-gray-300">
                /
              </li>
            </>
          )}
          {/* Truncated rather than allowed to wrap the trail onto three lines —
              a long product name is the common case, not the edge one. The full
              name is the <h1> directly below, so nothing is lost. */}
          <li className="min-w-0 max-w-full">
            <span
              aria-current="page"
              className="block truncate text-gray-700"
              title={product.name}
            >
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <ProductGallery
            images={images}
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
                className={clsx(
                  "rounded-sm text-sm text-brand underline-offset-2 hover:underline",
                  FOCUS_RING,
                )}
              >
                {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
              </button>
            </div>
          )}

          {/*
            `tabular-nums` on every price here. Prices change in place when a
            variant is picked, and proportional digits make the number jitter
            horizontally as it does — the one place on a product page where
            fixed-width digits are worth asking for.
          */}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-bold tabular-nums text-sale">
              {formatPrice(activePrice)}
            </span>
            {activeCompareAt && activeCompareAt > activePrice && (
              // Read aloud as what it is. A bare struck-through number is
              // announced as a second price with no indication it is the old
              // one, which is the opposite of what the strike conveys visually.
              <span className="text-lg tabular-nums text-gray-400 line-through">
                <span className="sr-only">Regular price: </span>
                {formatPrice(activeCompareAt)}
              </span>
            )}
            {discount && (
              <span className="rounded bg-brand px-2 py-1 text-xs font-semibold tabular-nums text-white">
                <span className="sr-only">Save </span>
                {discount}%<span className="sr-only"> off</span>
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
            // Given a surface of their own rather than sitting as loose text in
            // the run of the page. These are the two reassurances a shopper
            // looks for right before committing, and as bare gray body copy
            // they read as another specification line.
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-gray-50 px-4 py-3 text-sm">
              {product.isRefundable !== undefined && (
                <li className="inline-flex items-center gap-2 text-gray-700">
                  {product.isRefundable ? (
                    <RotateCcw size={15} className="shrink-0 text-green-700" aria-hidden />
                  ) : (
                    <XCircle size={15} className="shrink-0 text-gray-400" aria-hidden />
                  )}
                  {product.isRefundable ? "Refundable" : "Not refundable"}
                </li>
              )}
              {product.hasWarranty !== undefined && (
                <li className="inline-flex items-center gap-2 text-gray-700">
                  {product.hasWarranty ? (
                    <ShieldCheck size={15} className="shrink-0 text-green-700" aria-hidden />
                  ) : (
                    <XCircle size={15} className="shrink-0 text-gray-400" aria-hidden />
                  )}
                  {product.hasWarranty ? "Warranty included" : "No warranty"}
                </li>
              )}
            </ul>
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

          {/*
            Availability is the one line on this page that changes as the
            shopper picks options, so it announces itself — without this, a
            screen-reader user selecting a sold-out colour gets no indication
            anything happened until they reach the disabled button.

            `polite` rather than `assertive`: it is worth hearing at the next
            pause, not worth interrupting mid-word.
          */}
          <p className="mt-3 text-sm" aria-live="polite">
            <span className="font-semibold text-gray-700">Availability: </span>
            {availableStock > 0 ? (
              // Low stock is stated plainly rather than dressed as urgency.
              // The count is real, so it can carry weight honestly; the page
              // deliberately removed a fabricated countdown for the same
              // reason, and this must not reintroduce that voice.
              <span className={availableStock <= 5 ? "font-medium text-amber-700" : "text-green-700"}>
                {availableStock <= 5
                  ? `Only ${availableStock} left`
                  : `${availableStock} in stock`}
              </span>
            ) : (
              <span className="font-medium text-sale">Sold out</span>
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

          {/*
            The stepper is hidden entirely when there is nothing to buy —
            choosing a quantity of a sold-out product is a control that cannot
            lead anywhere.
          */}
          {availableStock > 0 && (
            <div className="mt-6">
              <p id="quantity-label" className="mb-2 text-sm font-semibold text-gray-700">
                Quantity
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {/*
                  Both ends are now bounded. The increment used to be a bare
                  `q + 1` with nothing reading stock, so the box would climb to
                  any number and the shopper learned the truth at the server.

                  Marked up as a spinbutton so the value, its range and its
                  changes are all announced — three unrelated elements (two
                  buttons and a span) conveyed none of that.
                */}
                <div
                  className="flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
                  role="spinbutton"
                  aria-labelledby="quantity-label"
                  aria-valuenow={quantity}
                  aria-valuemin={1}
                  aria-valuemax={maxQuantity}
                >
                  <button
                    type="button"
                    className={clsx(
                      "flex h-11 w-11 items-center justify-center text-gray-600 transition-colors",
                      "hover:bg-gray-50 hover:text-gray-900",
                      "disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent",
                      FOCUS_RING,
                      "focus-visible:ring-offset-0",
                    )}
                    onClick={() => changeQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    aria-hidden
                    className="w-10 text-center text-sm font-medium tabular-nums text-gray-900"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className={clsx(
                      "flex h-11 w-11 items-center justify-center text-gray-600 transition-colors",
                      "hover:bg-gray-50 hover:text-gray-900",
                      "disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent",
                      FOCUS_RING,
                      "focus-visible:ring-offset-0",
                    )}
                    onClick={() => changeQuantity(quantity + 1)}
                    disabled={atMaxQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Says why the plus stopped responding. A control that goes
                    dead without explanation reads as broken. */}
                {atMaxQuantity && availableStock <= MAX_QUANTITY && (
                  <p className="text-sm text-gray-500">
                    All {availableStock} in stock
                  </p>
                )}
              </div>
            </div>
          )}

          {/* `role="alert"` so a failed add is heard, not only seen — this is
              the only feedback that the action did not happen. */}
          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {/*
            Both buttons are now expressed the same way — shared base, one
            variant class each. They had drifted apart into two idioms: the
            first used `disabled:` variants, the second a `clsx` ternary that
            reimplemented the same states and reached a different answer (no
            transition, and a grey fill instead of a muted outline).

            The labels match `ProductCard`'s "Add to cart" exactly. Title case
            here against sentence case there was the same action spelled two
            ways on two screens a shopper sees in the same minute.
          */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd || isLoading}
              className={clsx(
                BUY_BUTTON_BASE,
                "border border-brand text-brand hover:bg-brand hover:text-white",
                "disabled:border-gray-300 disabled:bg-transparent disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400",
                FOCUS_RING,
              )}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              {isLoading ? "Adding..." : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyItNow}
              disabled={!canAdd || isLoading}
              className={clsx(
                BUY_BUTTON_BASE,
                "border border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark",
                "disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400",
                FOCUS_RING,
              )}
            >
              Buy it now
            </button>
          </div>

          {/* Sold out is an outcome, not just two grey buttons. Naming it below
              the controls is what stops the disabled pair from reading as a
              page that failed to load. */}
          {availableStock === 0 && (
            <p className="mt-3 text-sm text-gray-500">
              This item is out of stock.{" "}
              {product.variants.length > 0
                ? "Try another option above."
                : "Check back soon."}
            </p>
          )}

          {/* The row goes entirely when neither feature is offered, rather than
              leaving an empty flex container and its top margin behind. */}
          {(showWishlist || showCompare) && (
            // `gap-x-6` with a row gap, so the two wrap cleanly on a narrow
            // viewport instead of being pushed off the edge. Both get the
            // page's focus ring and a target tall enough to hit on touch —
            // as bare text links they had neither.
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {showWishlist && (
                <WishlistButton
                  productId={product.id}
                  size={16}
                  withLabel
                  standalone
                  className={clsx("min-h-11 rounded-sm hover:text-brand", FOCUS_RING)}
                />
              )}
              {showCompare && (
                <CompareButton
                  slug={product.slug}
                  size={16}
                  withLabel
                  className={clsx("min-h-11 rounded-sm hover:text-brand", FOCUS_RING)}
                />
              )}
            </div>
          )}

          {/* A definition list, because that is what it is — three label/value
              pairs previously written as sentences with a colon in them, which
              a screen reader reads as prose and no assistive tool can navigate
              as a table of facts. The same shape as Specifications below, so
              the two blocks stop being two idioms for one thing. */}
          <dl className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex gap-3">
              <dt className="w-40 shrink-0 text-gray-500">SKU</dt>
              {/* Wraps rather than overflowing: a variant SKU can be long, and
                  it is the one value here with no natural break points. */}
              <dd className="wrap-break-word text-gray-800">
                {selectedVariant?.sku ?? product.sku}
              </dd>
            </div>
            {product.brand && (
              <div className="flex gap-3">
                <dt className="w-40 shrink-0 text-gray-500">Brand</dt>
                <dd className="text-gray-800">{product.brand}</dd>
              </div>
            )}
            {product.category && (
              <div className="flex gap-3">
                <dt className="w-40 shrink-0 text-gray-500">Category</dt>
                <dd className="text-gray-800">{product.category}</dd>
              </div>
            )}
          </dl>

          {product.attributes.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">Specifications</h2>
              <dl className="space-y-2 text-sm">
                {product.attributes.map((attr) => (
                  <div key={`${attr.name}-${attr.value}`} className="flex gap-3">
                    <dt className="w-40 shrink-0 text-gray-500">{attr.name}</dt>
                    <dd className="wrap-break-word text-gray-800">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/*
        A real tablist. These were three plain buttons with no roles, no
        `aria-selected` and no relationship to the content below, so the panel
        that appeared on click was — to a screen reader — unannounced content
        arriving from nowhere.

        The strip is one tab stop: `tabIndex` is 0 only on the selected tab, and
        `handleTabKeyDown` moves between them with the arrow keys.
      */}
      <div id="product-tabs" className="mt-12 border-t border-gray-100 pt-8">
        <div
          role="tablist"
          aria-label="Product information"
          /*
           * Horizontally scrollable rather than wrapped or squeezed: three tabs
           * with a review count do not fit a 320px viewport, and a wrapped tab
           * strip loses the underline's meaning as a single row.
           *
           * `tabs-scroller` hides the bar itself. This storefront deliberately
           * PAINTS scrollbars inside nested scrollers (globals.css) so a panel
           * that runs past the fold says so — correct for the cart drawer and
           * the mobile menu, wrong here. A tab strip is three words wide; on
           * desktop it never overflows, yet the scroll container still reserved
           * an 8px gutter and drew a thumb in the empty space to the right of
           * "Reviews". The scrolling is kept for narrow viewports; only the
           * painted bar goes.
           */
          className="tabs-scroller mb-6 flex gap-8 overflow-x-auto border-b border-gray-100"
        >
          {TABS.map(({ id, label }) => {
            const isSelected = tab === id;
            return (
              <button
                key={id}
                ref={(node) => {
                  tabRefs.current[id] = node;
                }}
                type="button"
                role="tab"
                id={`product-tab-${id}`}
                aria-selected={isSelected}
                aria-controls={`product-panel-${id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={handleTabKeyDown}
                className={clsx(
                  "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  isSelected
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900",
                )}
              >
                {label}
                {id === "reviews" && product.reviewCount > 0 && (
                  <span className="tabular-nums"> ({product.reviewCount})</span>
                )}
              </button>
            );
          })}
        </div>

        {/*
          Each panel is labelled by its tab.

          Deliberately NOT `tabIndex={0}`. The tabs pattern only asks for a
          focusable panel when the panel holds nothing focusable of its own —
          and it always does here: the description renders merchant links, and
          the reviews panel is a whole form. Making it a tab stop anyway had
          two visible costs. The browser treats a focusable div as a scrollable
          region, so it drew a scrollbar down the right edge of the panel (the
          storefront paints nested scrollbars by design, see globals.css); and
          a focus ring on a full-width container sat far to the right of the
          `max-w-3xl` text it was supposed to indicate.

          Hidden panels are unmounted rather than hidden with a class: the
          reviews panel fetches and holds its own state, and keeping all three
          mounted would run that work for a shopper who never opens it.
        */}
        <div
          role="tabpanel"
          id={`product-panel-${tab}`}
          aria-labelledby={`product-tab-${tab}`}
        >
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
              Items can be returned or exchanged within 30 days of delivery in original
              condition. Contact support to start a return.
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
      </div>

      {related.length > 0 && (
        // A landmark with its own name, so this is reachable as a region and
        // not read as a continuation of the tab panel above it.
        <section aria-labelledby="related-heading" className="mt-16">
          {/* Sentence case, matching the transactional surfaces a shopper
              reaches from here (checkout, orders). The marketing sections on
              the homepage still use Title Case; unifying the two is a
              copy decision for the whole storefront, not this page. */}
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-gray-900">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
