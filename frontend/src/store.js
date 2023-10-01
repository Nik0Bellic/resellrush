import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import favoritesSliceReducer from './slices/favoritesSlice';
import orderSliceReducer from './slices/orderSlice';
import askSliceReducer from './slices/askSlice';
import bidSliceReducer from './slices/bidSlice';
import sizeSliceReducer from './slices/sizeSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    favorites: favoritesSliceReducer,
    order: orderSliceReducer,
    ask: askSliceReducer,
    bid: bidSliceReducer,
    size: sizeSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
