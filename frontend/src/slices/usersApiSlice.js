import { USERS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    updateShippingInfo: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/shipping`,
        method: 'PUT',
        body: data,
      }),
    }),
    updatePayMethod: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/payMethod`,
        method: 'PUT',
        body: data,
      }),
    }),
    getMyCurrentAsks: builder.query({
      query: () => ({
        url: `${USERS_URL}/asks/current`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyPendingAsks: builder.query({
      query: () => ({
        url: `${USERS_URL}/asks/pending`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyHistoryAsks: builder.query({
      query: () => ({
        url: `${USERS_URL}/asks/history`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyCurrentBids: builder.query({
      query: () => ({
        url: `${USERS_URL}/bids/current`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyPendingBids: builder.query({
      query: () => ({
        url: `${USERS_URL}/bids/pending`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyHistoryBids: builder.query({
      query: () => ({
        url: `${USERS_URL}/bids/history`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useUploadPassportImageMutation,
  useUpdateShippingInfoMutation,
  useUpdatePayMethodMutation,
  useGetMyCurrentAsksQuery,
  useGetMyPendingAsksQuery,
  useGetMyHistoryAsksQuery,
  useGetMyCurrentBidsQuery,
  useGetMyPendingBidsQuery,
  useGetMyHistoryBidsQuery,
} = usersApiSlice;
