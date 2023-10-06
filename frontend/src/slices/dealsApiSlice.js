import { apiSlice } from './apiSlice';
import { DEALS_URL } from '../constants';

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
  useUpdateDealToSentBySellerMutation,
  useUpdateDealToVerificationInProgressMutation,
  useUpdateDealToVerifiedMutation,
  useUpdateDealToSentToBuyerMutation,
  useUpdateDealToShippedMutation,
} = dealsApiSlice;
