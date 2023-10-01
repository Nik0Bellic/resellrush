import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSize: localStorage.getItem('selectedSize')
    ? JSON.parse(localStorage.getItem('selectedSize'))
    : null,
  sizesModalActive: false,
};

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    selectSize: (state, action) => {
      state.selectedSize = action.payload;

      localStorage.setItem('selectedSize', JSON.stringify(state.selectedSize));
    },
    setSizesModalActive: (state, action) => {
      state.sizesModalActive = action.payload;
    },
  },
});

export const { selectSize, setSizesModalActive } = sizeSlice.actions;

export default sizeSlice.reducer;
