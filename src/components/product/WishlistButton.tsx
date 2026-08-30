"use client";

import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import clsx from "clsx";
import {
  useAddWishlistItemMutation,
  useGetWishlistContainsQuery,
  useGetWishlistQuery,
  useRemoveWishlistItemByProductMutation,
  WISHLIST_PAGE_SIZE,
} from "@/store/wishlistApi";
import { useAppSelector } from "@/store/hooks";
import { selectIsSignedIn } from "@/store/uiSlice";

/**
 * Saved-state toggle for a single product.
 *
 * Reads from the **cached wishlist list**, not a per-product `contains` call: a
 * listing renders many of these, and one request per card would be a storm for
 * a set that fits in a single response. RTK Query dedupes the shared query, so
 * N buttons cost one fetch.
 *
 * Signed-out shoppers never issue the query at all — every wishlist endpoint
 * 401s without a session, and firing one per card would fill the console with
 * them. The control becomes a sign-in prompt instead of a toggle that fails.
 */
export default function WishlistButton({
  productId,
  className,
  size = 18,
  withLabel = false,
  standalone = false,
}: {
  productId: string;
  className?: string;
  size?: number;
  withLabel?: boolean;
  /**
   * Set on the product detail page, where this is the only product in question
   * and the full wishlist may not otherwise be loaded — it asks the single
   * `contains` endpoint instead of pulling a page of the list. Left off in
   * listings, where one shared list query answers for every card at once.
   */
  standalone?: boolean;
}) {
  const router = useRouter();
  // Seeded into the store by the layout — the session cookie is httpOnly, so a
  // client component cannot read it directly.
  const isSignedIn = useAppSelector(selectIsSignedIn);

  // Exactly one of these runs; the other is skipped, so a card never pays for
  // a per-product request and the detail page never pulls a whole list.
  const { data: list, isLoading: isListLoading } = useGetWishlistQuery(
    { page: 1, limit: WISHLIST_PAGE_SIZE },
    { skip: !isSignedIn || standalone },
  );

  const { data: contains, isLoading: isContainsLoading } = useGetWishlistContainsQuery(
    productId,
    { skip: !isSignedIn || !standalone },
  );

  const [addItem, { isLoading: isAdding }] = useAddWishlistItemMutation();
  const [removeByProduct, { isLoading: isRemoving }] =
    useRemoveWishlistItemByProductMutation();

  const isSaved = standalone
    ? Boolean(contains?.inWishlist)
    : Boolean(list?.items.some((item) => item.productId === productId));

  const isBusy =
    isAdding || isRemoving || (standalone ? isContainsLoading : isListLoading);

  async function handleToggle() {
    if (!isSignedIn) {
      router.push("/account/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (isSaved) {
        await removeByProduct(productId).unwrap();
      } else {
        await addItem(productId).unwrap();
      }
    } catch {
      // The tag invalidation refetches regardless, so the heart falls back to
      // whatever the server actually holds rather than claiming a state that
      // was never reached.
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isBusy}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
      className={clsx(
        "flex items-center gap-2 transition-colors disabled:opacity-60",
        className,
      )}
    >
      {isBusy ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <Heart
          size={size}
          className={clsx(
            "transition-colors",
            isSaved ? "fill-sale text-sale" : "text-current",
          )}
        />
      )}
      {withLabel && (isSaved ? "Saved" : "Wishlist")}
    </button>
  );
}
