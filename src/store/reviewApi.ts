import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api-client";
import {
  toRatingBreakdown,
  toReview,
  type ApiRatingBreakdown,
  type ApiReview,
  type CreateReviewPayload,
  type RatingBreakdown,
  type Review,
  type UpdateReviewPayload,
} from "@/types/review";
import type { ApiResponse } from "@/types/auth";
import type { PaginationMeta } from "@/types/product";

/**
 * Reviews, split by audience rather than by convenience.
 *
 * The public product-review list is cookie-free, so it is fetched straight from
 * the backend (`API_BASE_URL`) exactly like `productApi`. Everything
 * authenticated — submitting, editing, withdrawing, and the customer's own list
 * — goes through `/api/reviews/*`, because those carry the session cookie the
 * browser cannot send cross-site.
 *
 * `fetchBaseQuery` takes one baseUrl, so the authenticated endpoints give an
 * absolute same-origin path and the public one an absolute backend URL.
 */

const EMPTY_META: PaginationMeta = { page: 1, limit: 0, total: 0, totalPages: 0 };

interface ReviewListMeta extends PaginationMeta {
  ratingBreakdown?: ApiRatingBreakdown;
}

export interface ProductReviewPage {
  reviews: Review[];
  breakdown: RatingBreakdown | null;
  meta: PaginationMeta;
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Review", "MyReviews"],
  endpoints: (builder) => ({
    /** Public: pages beyond the first, which the server rendered. */
    getProductReviews: builder.query<
      ProductReviewPage,
      { productId: string; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 5 }) =>
        `${API_BASE_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`,
      transformResponse: (response: ApiResponse<ApiReview[]>) => {
        const data = Array.isArray(response?.data) ? response.data : [];
        const meta = response.meta as ReviewListMeta | undefined;
        return {
          reviews: data.map(toReview),
          breakdown: meta?.ratingBreakdown
            ? toRatingBreakdown(meta.ratingBreakdown)
            : null,
          meta: meta ?? { ...EMPTY_META, total: data.length },
        };
      },
      providesTags: ["Review"],
    }),

    /** The caller's own reviews, across every status. */
    getMyReviews: builder.query<{ reviews: Review[]; meta: PaginationMeta }, void>({
      query: () => "/api/reviews/me?limit=50",
      transformResponse: (response: ApiResponse<ApiReview[]>) => {
        const data = Array.isArray(response?.data) ? response.data : [];
        return { reviews: data.map(toReview), meta: response.meta ?? EMPTY_META };
      },
      providesTags: ["MyReviews"],
    }),

    createReview: builder.mutation<
      ApiResponse<ApiReview>,
      CreateReviewPayload & { productId: string }
    >({
      query: (body) => ({ url: "/api/reviews", method: "POST", body }),
      // A new review is PENDING, so the public list does not change yet — but
      // the author's own list does, and so does their eligibility to submit.
      invalidatesTags: ["MyReviews"],
    }),

    updateMyReview: builder.mutation<
      ApiResponse<ApiReview>,
      { id: string; body: UpdateReviewPayload }
    >({
      query: ({ id, body }) => ({ url: `/api/reviews/me/${id}`, method: "PATCH", body }),
      // Editing an approved review returns it to PENDING, so it leaves the
      // public list too — both caches are stale.
      invalidatesTags: ["MyReviews", "Review"],
    }),

    deleteMyReview: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/api/reviews/me/${id}`, method: "DELETE" }),
      invalidatesTags: ["MyReviews", "Review"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useUpdateMyReviewMutation,
  useDeleteMyReviewMutation,
} = reviewApi;
