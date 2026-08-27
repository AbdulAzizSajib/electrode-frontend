import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toAddress, type Address, type ApiCustomerAddress, type CreateAddressPayload, type UpdateAddressPayload } from "@/types/address";
import type { ApiResponse } from "@/types/auth";

/**
 * The shopper's saved delivery addresses.
 *
 * Talks to this app's `/api/addresses` proxy rather than the backend directly —
 * these routes are authenticated by httpOnly cookies the browser cannot forward
 * cross-site (see `src/lib/api-proxy.ts`).
 *
 * Every mutation invalidates the `Address` tag, so the checkout selector and the
 * account list are re-read from the server together and cannot drift apart —
 * which matters most for `isDefault`, where the server moves the flag off
 * whichever address previously held it.
 */
export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/addresses" }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => "",
      transformResponse: (response: ApiResponse<ApiCustomerAddress[]>) =>
        (Array.isArray(response?.data) ? response.data : [])
          .map(toAddress)
          // Default first, so a selector can take the head of the list.
          .sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
      providesTags: ["Address"],
    }),

    createAddress: builder.mutation<
      ApiResponse<ApiCustomerAddress>,
      CreateAddressPayload
    >({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation<
      ApiResponse<ApiCustomerAddress>,
      { addressId: string; body: UpdateAddressPayload }
    >({
      query: ({ addressId, body }) => ({
        url: `/${addressId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<ApiResponse<null>, string>({
      query: (addressId) => ({ url: `/${addressId}`, method: "DELETE" }),
      invalidatesTags: ["Address"],
    }),

    setDefaultAddress: builder.mutation<
      ApiResponse<ApiCustomerAddress>,
      string
    >({
      query: (addressId) => ({
        url: `/${addressId}/set-default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
