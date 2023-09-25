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

      const purchasePrice = state.orderItem.purchasePrice;
      state.purchasePrice = addDecimals(purchasePrice);

      const shippingPrice = 50;
      state.shippingPrice = addDecimals(shippingPrice);

      const processingFee = 0.12 * purchasePrice;
      state.processingFee = addDecimals(processingFee);

      const totalPrice = purchasePrice + shippingPrice + processingFee;
      state.totalPrice = addDecimals(totalPrice);

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
    resetOrder: (state) => (state = initialState),
  },
});

export const { addToOrder, saveShippingInfo, savePaymentMethod, resetOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
