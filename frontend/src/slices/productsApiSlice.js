import { PRODUCTS_URL, UPLOAD_URL, PAYPAL_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    getLatestProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/latest`,
      }),
      keepUnusedDataFor: 5,
    }),
    placeAsk: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.sellItem.productIdentifier}/asks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    placeBid: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.buyItem.productIdentifier}/bids`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useGetLatestProductsQuery,
  usePlaceAskMutation,
  usePlaceBidMutation,
  useGetPayPalClientIdQuery,
} = productsApiSlice;
