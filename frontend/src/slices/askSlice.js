import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('ask')
  ? JSON.parse(localStorage.getItem('ask'))
  : {
      sellItem: {},
    };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const askSlice = createSlice({
  name: 'ask',
  initialState,
  reducers: {
    createAsk: (state, action) => {
      state.sellItem = action.payload.sellItem;
      state.buyer = action.payload.buyer;
      state.bidId = action.payload.bidId;
      state.size = action.payload.size;
      state.type = action.payload.type;
      state.expiration = action.payload.expiration;

      const askPrice = action.payload.askPrice;
      state.askPrice = askPrice;

      const transactionFee = 0.09 * askPrice;
      state.transactionFee = addDecimals(transactionFee);

      const paymentProcessingFee = 0.03 * askPrice;
      state.paymentProcessingFee = addDecimals(paymentProcessingFee);

      const shippingFee = 30;
      state.shippingFee = addDecimals(shippingFee);

      const totalPayout =
        askPrice - transactionFee - paymentProcessingFee - shippingFee;
      state.totalPayout = addDecimals(totalPayout);

      localStorage.setItem('ask', JSON.stringify(state));
    },
    resetAsk: (state) => (state = initialState),
  },
});

export const { createAsk } = askSlice.actions;

export default askSlice.reducer;
