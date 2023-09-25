function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(lowestAsk) {
  const purchasePrice = lowestAsk;

  const shippingPrice = 50;

  const processingFee = 0.12 * purchasePrice;

  const totalPrice = purchasePrice + shippingPrice + processingFee;

  return {
    purchasePrice: addDecimals(purchasePrice),
    shippingPrice: addDecimals(shippingPrice),
    processingFee: addDecimals(processingFee),
    totalPrice: addDecimals(totalPrice),
  };
}
