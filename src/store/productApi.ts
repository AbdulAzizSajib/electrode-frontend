import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api-client";
import { placeholderImage } from "@/lib/placeholder";
import { toProduct } from "@/services/product";
import type {
  ApiProduct,
  ApiSearchSuggestion,
  Product,
  SearchSuggestion,
} from "@/types/product";
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

    /**
     * Typeahead suggestions for the search box.
     *
     * Kept separate from `getProducts` because the endpoint returns a slim
     * projection, not full products — see `ApiSearchSuggestion`. The full
     * results page still goes through `/products?q=`, so this is only ever the
     * dropdown, and a shopper who submits gets the complete, filterable listing.
     */
    searchProducts: builder.query<SearchSuggestion[], string>({
      query: (term) => `/products/search?q=${encodeURIComponent(term)}`,
      transformResponse: (response: ApiResponse<ApiSearchSuggestion[]>) =>
        (Array.isArray(response.data) ? response.data : []).map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          // Same decimal-string-to-number parse the product mapper does, so the
          // dropdown never formats a string as though it were a number.
          price: Number(item.price) || 0,
          image: item.image ?? placeholderImage(item.slug, { label: item.name }),
          brand: item.brandName ?? undefined,
        })),
    }),
  }),
});

export const { useGetProductBySlugQuery, useSearchProductsQuery } = productApi;
