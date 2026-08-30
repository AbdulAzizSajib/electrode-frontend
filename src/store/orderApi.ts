import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cartApi, EMPTY_CART } from "@/store/cartApi";
import type { ApiOrder, GuestOrderLookup, PlaceOrderPayload } from "@/types/order";
import type { ApiResponse } from "@/types/auth";

/**
 * Order placement.
 *
 * Separate from `cartApi` only because it lives at a different base path —
 * RTK Query joins a relative url onto its api's `baseUrl`, so `/api/orders`
 * cannot be reached from an api rooted at `/api/cart`.
 *
 * The side effect, though, is on the *cart*: the backend empties it inside the
 * same transaction that creates the order. On success that outcome is already
 * known — the transaction cannot commit an order and leave the cart populated —
 * so the cache is set to empty directly rather than invalidated. Invalidating
 * would cost a second full round trip (browser → proxy → API → database) after
 * the order already succeeded, and the shopper waits through it before seeing
 * the confirmation. The one thing a refetch would add is the server's
 * cookie-clearing side effect for a spent coupon, which the next genuine cart
 * read reconciles anyway.
 *
 * A definite rejection (400/409 — the server decided before committing) leaves
 * the cart alone, which is what lets the shopper fix a quantity and retry. A
 * 504 is different in kind: the request was delivered and may have committed,
 * so the outcome genuinely is unknown and the cart has to be re-read.
 */
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
  endpoints: (builder) => ({
    placeOrder: builder.mutation<ApiResponse<ApiOrder>, PlaceOrderPayload>({
      query: (payload) => {
        // `mode` is the client-side discriminant keeping the two payload shapes
        // apart. The backend infers the flow from the session, so it is dropped
        // here rather than sent as a field the API does not expect.
        const { idempotencyKey, ...rest } = payload;
        const body: Record<string, unknown> = { ...rest };
        delete body.mode;

        return {
          url: "",
          method: "POST",
          body,
          // Lets the server absorb a retry instead of placing a second order.
          headers: { "Idempotency-Key": idempotencyKey },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // A direct product order carries its own lines and never touches the
        // cart — the backend skips clearing it, so emptying the cache here
        // would wrongly wipe a cart the shopper is still filling.
        const consumedCart = !(arg.mode === "guest" && arg.items?.length);

        try {
          await queryFulfilled;
          // The order committed, so the cart is empty — no need to ask.
          if (consumedCart) {
            dispatch(
              cartApi.util.updateQueryData("getCart", undefined, () => EMPTY_CART),
            );
          }
        } catch (error) {
          // Outcome unknown: the order may have committed and emptied the cart,
          // so refetch rather than keep rendering a cart that no longer exists.
          const err = error as { error?: { status?: number } };
          if (err?.error?.status === 504 && consumedCart) {
            dispatch(cartApi.util.invalidateTags(["Cart"]));
          }
          // Any other failure — the cart still holds everything it did before.
        }
      },
    }),

    /**
     * Guest order tracking. A mutation rather than a query because it is a POST
     * carrying a phone number (see the proxy route), and because it is driven
     * by a form submission rather than by rendering.
     */
    trackOrder: builder.mutation<ApiResponse<ApiOrder>, GuestOrderLookup>({
      query: (body) => ({ url: "/track", method: "POST", body }),
    }),
  }),
});

export const { usePlaceOrderMutation, useTrackOrderMutation } = orderApi;
