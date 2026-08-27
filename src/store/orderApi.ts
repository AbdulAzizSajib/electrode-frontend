import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cartApi } from "@/store/cartApi";
import type { ApiOrder, PlaceOrderPayload } from "@/types/order";
import type { ApiResponse } from "@/types/auth";

/**
 * Order placement.
 *
 * Separate from `cartApi` only because it lives at a different base path —
 * RTK Query joins a relative url onto its api's `baseUrl`, so `/api/orders`
 * cannot be reached from an api rooted at `/api/cart`.
 *
 * The side effect, though, is on the *cart*: the backend empties it inside the
 * same transaction that creates the order. So on success this invalidates
 * `cartApi`'s `Cart` tag directly, and the cart is refetched from the server
 * rather than assumed.
 *
 * A definite rejection (400/409 — the server decided before committing) leaves
 * the cart alone, which is what lets the shopper fix a quantity and retry. A
 * 504 is different in kind: the request was delivered and may have committed,
 * so the cached cart can no longer be trusted and has to be re-read.
 */
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
  endpoints: (builder) => ({
    placeOrder: builder.mutation<ApiResponse<ApiOrder>, PlaceOrderPayload>({
      query: ({ idempotencyKey, ...body }) => ({
        url: "",
        method: "POST",
        body,
        // Lets the server absorb a retry instead of placing a second order.
        headers: { "Idempotency-Key": idempotencyKey },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        } catch (error) {
          // Outcome unknown: the order may have committed and emptied the cart,
          // so refetch rather than keep rendering a cart that no longer exists.
          const err = error as { error?: { status?: number } };
          if (err?.error?.status === 504) {
            dispatch(cartApi.util.invalidateTags(["Cart"]));
          }
          // Any other failure — the cart still holds everything it did before.
        }
      },
    }),
  }),
});

export const { usePlaceOrderMutation } = orderApi;
