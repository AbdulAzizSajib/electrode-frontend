import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api-client";
import { toProduct } from "@/services/product";
import type { ApiProduct, Product } from "@/types/product";
import type { ApiResponse } from "@/types/auth";

/**
 * Client-side product reads.
 *
 * Unlike the cart, this talks to the backend directly rather than through a
 * same-origin proxy: `GET /products/:slug` is public and cookie-free, so the
 * proxy hop the cart needs (for its httpOnly cookies) would buy nothing here.
 *
 * Listing endpoints omit variants entirely, so anything that needs a product's
 * real choices — the quick view — has to fetch the product by slug.
 */

/**
 * A browsing session's worth. Reopening the same quick view should not refetch,
 * and a product's price and variants do not move on a timescale that would make
 * a cached entry misleading within one visit.
 */
const PRODUCT_CACHE_SECONDS = 300;

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  keepUnusedDataFor: PRODUCT_CACHE_SECONDS,
  endpoints: (builder) => ({
    /**
     * Cache entries are keyed by slug, so a response that arrives after the
     * shopper has moved on lands in its own entry — a later quick view can
     * never be shown a previous product's details.
     */
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response: ApiResponse<ApiProduct>) => {
        if (!response.data) throw new Error("Product not found");
        // The same mapper the server uses, so a client-fetched product is
        // identical to a server-fetched one — same price parsing, same image
        // fallback, same campaign-price handling.
        return toProduct(response.data);
      },
    }),
  }),
});

export const { useGetProductBySlugQuery } = productApi;
