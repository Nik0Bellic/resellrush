import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('bid')
  ? JSON.parse(localStorage.getItem('bid'))
  : {
      buyItem: {},
    };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    createBid: (state, action) => {
      state.buyItem = action.payload.buyItem;
      state.seller = action.payload.seller;
      state.askId = action.payload.askId;
      state.size = action.payload.size;
      state.type = action.payload.type;
      state.expiration = action.payload.expiration;

      const bidPrice = action.payload.bidPrice;
      state.bidPrice = bidPrice;

      const processingFee = 0.12 * bidPrice;
      state.processingFee = addDecimals(processingFee);

      const shippingFee = 50;
      state.shippingFee = addDecimals(shippingFee);

      const totalPrice = bidPrice + processingFee + shippingFee;
      state.totalPrice = addDecimals(totalPrice);

      localStorage.setItem('bid', JSON.stringify(state));
    },
    resetBid: (state) => (state = initialState),
  },
});

export const { createBid } = bidSlice.actions;

export default bidSlice.reducer;
