import { apiSlice } from './apiSlice';
import { DEALS_URL, UPLOAD_URL } from '../constants';

export const dealsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeals: builder.query({
      query: () => ({
        url: DEALS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getDealDetails: builder.query({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    uploadShippingImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
        headers: {
          'upload-type': 'shippingService',
        },
      }),
    }),
    updateDealToSentBySeller: builder.mutation({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}/bySeller`,
        method: 'PUT',
      }),
    }),
    updateDealToVerificationInProgress: builder.mutation({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}/verification`,
        method: 'PUT',
      }),
    }),
    updateDealToVerified: builder.mutation({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}/verify`,
        method: 'PUT',
      }),
    }),
    updateDealToSentToBuyer: builder.mutation({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}/toBuyer`,
        method: 'PUT',
      }),
    }),
    updateDealToShipped: builder.mutation({
      query: (dealId) => ({
        url: `${DEALS_URL}/${dealId}/shipped`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealDetailsQuery,
  useUploadShippingImageMutation,
  useUpdateDealToSentBySellerMutation,
  useUpdateDealToVerificationInProgressMutation,
  useUpdateDealToVerifiedMutation,
  useUpdateDealToSentToBuyerMutation,
  useUpdateDealToShippedMutation,
} = dealsApiSlice;
