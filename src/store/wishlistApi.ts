import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cartApi } from "@/store/cartApi";
import {
  toWishlistItem,
  type ApiWishlist,
  type ApiWishlistItem,
  type WishlistContains,
  type WishlistCount,
  type WishlistItem,
} from "@/types/wishlist";
import type { ApiResponse } from "@/types/auth";
import type { PaginationMeta } from "@/types/product";

/**
 * The shopper's saved products.
 *
 * Talks to this app's `/api/wishlist` proxy rather than the backend directly —
 * these routes are authenticated by httpOnly cookies the browser cannot forward
 * cross-site (see `src/lib/api-proxy.ts`).
 *
 * One `Wishlist` tag covers the list, the count and the per-product check on
 * purpose: after any toggle the header badge, a card's heart and the wishlist
 * page must not disagree, and a single invalidation refetches all three cheaply.
 * Granular per-product tags are how a stale heart survives a removal.
 */

export const WISHLIST_PAGE_SIZE = 12;

export interface WishlistPage {
  items: WishlistItem[];
  meta: PaginationMeta;
}

const EMPTY_META: PaginationMeta = { page: 1, limit: 0, total: 0, totalPages: 0 };

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/wishlist" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistPage, { page?: number; limit?: number } | void>({
      query: (args) => {
        const { page = 1, limit = WISHLIST_PAGE_SIZE } = args ?? {};
        return `?page=${page}&limit=${limit}`;
      },
      // `data` is the wishlist itself (`{ id, customerId, items }`), not a bare
      // array of items — unlike most list endpoints on this API.
      transformResponse: (response: ApiResponse<ApiWishlist>) => {
        const items = Array.isArray(response?.data?.items) ? response.data.items : [];
        return {
          items: items.map(toWishlistItem),
          meta: response.meta ?? { ...EMPTY_META, total: items.length },
        };
      },
      providesTags: ["Wishlist"],
    }),

    getWishlistCount: builder.query<number, void>({
      query: () => "/count",
      transformResponse: (response: ApiResponse<WishlistCount>) =>
        response?.data?.count ?? 0,
      providesTags: ["Wishlist"],
    }),

    /**
     * Single-product check for the detail page, where the full list may not be
     * loaded. Listings deliberately do not use this — see `useWishlistProductIds`.
     */
    getWishlistContains: builder.query<WishlistContains, string>({
      query: (productId) => `/contains/${productId}`,
      transformResponse: (response: ApiResponse<WishlistContains>) =>
        response?.data ?? { inWishlist: false, itemId: null },
      providesTags: ["Wishlist"],
    }),

    addWishlistItem: builder.mutation<ApiResponse<ApiWishlistItem>, string>({
      query: (productId) => ({ url: "/items", method: "POST", body: { productId } }),
      invalidatesTags: ["Wishlist"],
    }),

    removeWishlistItem: builder.mutation<ApiResponse<unknown>, string>({
      query: (itemId) => ({ url: `/items/${itemId}`, method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),

    /** What a heart toggle uses — it knows the product, not the wishlist row. */
    removeWishlistItemByProduct: builder.mutation<ApiResponse<unknown>, string>({
      query: (productId) => ({ url: `/items/product/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),

    moveWishlistItemToCart: builder.mutation<ApiResponse<unknown>, string>({
      query: (itemId) => ({ url: `/items/${itemId}/move-to-cart`, method: "POST" }),
      invalidatesTags: ["Wishlist"],
      async onQueryStarted(_itemId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // The endpoint mutates the cart as well as the wishlist, and a tag in
          // another API slice cannot be invalidated declaratively — without this
          // the header cart badge lags behind the move.
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        } catch {
          // Nothing moved, so the cart is unchanged and needs no refetch.
        }
      },
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useGetWishlistCountQuery,
  useGetWishlistContainsQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
  useRemoveWishlistItemByProductMutation,
  useMoveWishlistItemToCartMutation,
} = wishlistApi;
