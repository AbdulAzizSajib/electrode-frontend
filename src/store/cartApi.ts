import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { roundMoney } from "@/lib/format";
import { placeholderImage } from "@/lib/placeholder";
import type {
  AddCartItemPayload,
  ApiCart,
  ApiCartItem,
  CartLine,
  CartSummary,
} from "@/types/cart";
import type { ApiResponse } from "@/types/auth";

/**
 * Cart server-state, owned by RTK Query.
 *
 * `baseUrl` points at this app's own `/api/cart` proxy rather than the backend:
 * the cart's `guestToken` / `appliedCoupon` cookies are httpOnly on the API's
 * domain, so the browser cannot carry them cross-site (see src/lib/cart-proxy.ts).
 *
 * Every mutation invalidates the `Cart` tag, so the cart the shopper sees is
 * always refetched from the server after a change rather than patched locally.
 */

export const EMPTY_CART: CartSummary = {
  id: null,
  lines: [],
  itemCount: 0,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
};

/**
 * Prices a line from the variant the shopper actually chose, falling back to
 * the product's base price only when no variant is selected.
 */
function toCartLine(item: ApiCartItem): CartLine {
  const unitPrice = roundMoney(
    Number(item.variant?.price ?? item.product?.price ?? 0),
  );

  const primaryImage =
    item.variant?.image ??
    [...(item.product?.images ?? [])].sort(
      (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
    )[0]?.url ??
    placeholderImage(item.product?.slug ?? item.productId);

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    name: item.product?.name ?? "Unavailable product",
    slug: item.product?.slug ?? "",
    variantName: item.variant?.name,
    image: primaryImage,
    unitPrice,
    lineTotal: roundMoney(unitPrice * item.quantity),
    stockQuantity: item.variant?.stockQuantity ?? item.product?.stockQuantity ?? 0,
  };
}

/** Derives the cart the UI renders — the API returns no money at all. */
export function toCartSummary(cart: ApiCart | null | undefined): CartSummary {
  if (!cart) return EMPTY_CART;

  const lines = (cart.items ?? []).map(toCartLine);
  const subtotal = roundMoney(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  const discountAmount = roundMoney(Number(cart.discount?.amount ?? 0));

  return {
    id: cart.id,
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal,
    discountCode: cart.discount?.code,
    discountAmount,
    // Never let a discount drive the total below zero.
    total: roundMoney(Math.max(0, subtotal - discountAmount)),
  };
}

/**
 * Writes a mutation's own response into the `getCart` cache.
 *
 * Every cart mutation already returns the complete post-mutation cart —
 * items *and* the re-validated discount — so invalidating the `Cart` tag
 * would throw that away and pay for a second `GET /cart` to learn what we
 * were just told. Seeding instead makes a cart change cost one roundtrip.
 *
 * Rethrows on failure so each caller can run its own revert.
 */
async function seedCartFromResponse(
  queryFulfilled: PromiseLike<{ data: ApiResponse<ApiCart> }>,
  dispatch: (action: unknown) => unknown,
) {
  const { data } = await queryFulfilled;
  const summary = toCartSummary(data?.data);
  dispatch(
    cartApi.util.updateQueryData("getCart", undefined, () => summary),
  );
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/cart" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartSummary, void>({
      query: () => "",
      transformResponse: (response: ApiResponse<ApiCart>) =>
        toCartSummary(response?.data),
      providesTags: ["Cart"],
    }),

    addItem: builder.mutation<ApiResponse<ApiCart>, AddCartItemPayload>({
      query: (body) => ({ url: "/items", method: "POST", body }),
      // The item count is what a shopper watches for feedback after clicking
      // Add, so bump it immediately; money stays server-derived (design D6).
      async onQueryStarted({ quantity = 1 }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.itemCount += quantity;
          }),
        );
        try {
          await seedCartFromResponse(queryFulfilled, dispatch);
        } catch {
          patch.undo();
        }
      },
    }),

    updateItemQuantity: builder.mutation<
      ApiResponse<ApiCart>,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await seedCartFromResponse(queryFulfilled, dispatch).catch(() => {
          // The stepper owns the revert — it holds the last confirmed quantity.
        });
      },
    }),

    removeItem: builder.mutation<ApiResponse<ApiCart>, string>({
      query: (itemId) => ({ url: `/items/${itemId}`, method: "DELETE" }),
      // Optimistically drop the line so the row disappears on click, then let
      // the response reseed. Reverts if the server refuses.
      async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const line = draft.lines.find((l) => l.id === itemId);
            if (!line) return;
            draft.lines = draft.lines.filter((l) => l.id !== itemId);
            draft.itemCount -= line.quantity;
            draft.subtotal = roundMoney(draft.subtotal - line.lineTotal);
            draft.total = roundMoney(Math.max(0, draft.subtotal - draft.discountAmount));
          }),
        );
        try {
          await seedCartFromResponse(queryFulfilled, dispatch);
        } catch {
          patch.undo();
        }
      },
    }),

    applyCoupon: builder.mutation<ApiResponse<ApiCart>, string>({
      query: (code) => ({ url: "/coupon", method: "POST", body: { code } }),
      invalidatesTags: ["Cart"],
    }),

    removeCoupon: builder.mutation<ApiResponse<ApiCart>, void>({
      query: () => ({ url: "/coupon", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

  }),
});

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemQuantityMutation,
  useRemoveItemMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;
