export const insertAsk = (asksArray, newAsk) => {
  let position = asksArray.findIndex((ask) => newAsk.price <= ask.price);
  if (position === -1) {
    asksArray.push(newAsk);
  } else {
    asksArray.splice(position, 0, newAsk);
  }
};

export const insertBid = (bidsArray, newBid) => {
  let position = bidsArray.findIndex((bid) => newBid.price >= bid.price);
  if (position === -1) {
    bidsArray.push(newBid);
  } else {
    bidsArray.splice(position, 0, newBid);
  }
};
