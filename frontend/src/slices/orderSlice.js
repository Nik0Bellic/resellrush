import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('order')
  ? JSON.parse(localStorage.getItem('order'))
  : { orderItem: {}, shippingInfo: {}, paymentMethod: 'Paypal' };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToOrder: (state, action) => {
      state.orderItem = action.payload;

      // Purchase price
      state.purchasePrice = addDecimals(Number(state.orderItem.purchasePrice));

      // Shipping price
      state.shippingPrice = '50';

      // Processing fee (12%)
      state.processingFee = addDecimals(
        Number(0.12 * state.purchasePrice).toFixed(2)
      );

      // Total price
      state.totalPrice = (
        Number(state.purchasePrice) +
        Number(state.shippingPrice) +
        Number(state.processingFee)
      ).toFixed(2);

      localStorage.setItem('order', JSON.stringify(state));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('order', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('order', JSON.stringify(state));
    },
  },
});

export const { addToOrder, saveShippingInfo, savePaymentMethod } =
  orderSlice.actions;

export default orderSlice.reducer;
