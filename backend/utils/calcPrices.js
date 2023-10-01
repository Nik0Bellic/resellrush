function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcAskPrices(askPrice) {
  const transactionFee = 0.09 * askPrice;

  const paymentProcessingFee = 0.03 * askPrice;

  const shippingFee = 30;

  const totalPayout =
    askPrice - transactionFee - paymentProcessingFee - shippingFee;

  return {
    askPrice: addDecimals(askPrice),
    transactionFee: addDecimals(transactionFee),
    paymentProcessingFee: addDecimals(paymentProcessingFee),
    shippingFee: addDecimals(shippingFee),
    totalPayout: addDecimals(totalPayout),
  };
}

export function calcBidPrices(bidPrice) {
  const shippingPrice = 50;

  const processingFee = 0.12 * bidPrice;

  const totalPrice = bidPrice + shippingPrice + processingFee;

  return {
    bidPrice: addDecimals(bidPrice),
    shippingPrice: addDecimals(shippingPrice),
    processingFee: addDecimals(processingFee),
    totalPrice: addDecimals(totalPrice),
  };
}
