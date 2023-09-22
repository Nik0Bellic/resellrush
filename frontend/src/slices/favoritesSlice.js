import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('favorites')
  ? JSON.parse(localStorage.getItem('favorites'))
  : { favoriteItems: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;

      const existItem = state.favoriteItems.find((x) => x._id === item._id);

      if (existItem) {
        state.favoriteItems = state.favoriteItems.filter(
          (x) => x._id !== item._id
        );
      } else {
        state.favoriteItems = [...state.favoriteItems, item];
      }

      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
