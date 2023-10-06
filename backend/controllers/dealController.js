import asyncHandler from '../middleware/asyncHandler.js';
import Deal from '../models/dealModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private/Admin
const getDeals = asyncHandler(async (req, res) => {
  const deals = await Deal.find().sort({ createdAt: -1 });
  res.status(200).json(deals);
});

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Private
const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    res.status(200).json(deal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Update deal status to 'Item sent by Seller'
// @route   PUT /api/deals/:id/bySeller
// @access  Private
const updateDealToSentBySeller = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    deal.status = 'Sent By Seller';

    const seller = await User.findById(deal.seller);
    seller.pendingAsks.find((ask) => ask.askId === deal.offerId).status =
      'Sent To Resell Rush';
    const buyer = await User.findById(deal.buyer);
    buyer.pendingBids.find((bid) => bid.bidId === deal.offerId).status =
      'Sent By Seller';

    const updatedDeal = await deal.save();
    await seller.save();
    await buyer.save();

    res.status(200).json(updatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Update deal status to 'Verification In Progress'
// @route   PUT /api/deals/:id/verification
// @access  Private/Admin
const updateDealToVerificationInProgress = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    deal.status = 'Verification In Progress';

    const seller = await User.findById(deal.seller);
    seller.pendingAsks.find((ask) => ask.askId === deal.offerId).status =
      'Item Verification In Progress';
    const buyer = await User.findById(deal.buyer);
    buyer.pendingBids.find((bid) => bid.bidId === deal.offerId).status =
      'Item Verification In Progress';

    const updatedDeal = await deal.save();
    await seller.save();
    await buyer.save();

    res.status(200).json(updatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Update deal status to 'Item Verified'
// @route   PUT /api/deals/:id/verify
// @access  Private/Admin
const updateDealToVerified = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    deal.status = 'Item Verified';

    const seller = await User.findById(deal.seller);
    const product = await Product.findOne({
      productIdentifier: deal.dealItem.productIdentifier,
    });
    const sellerPendingAsks = seller.pendingAsks;
    const sellerHistoryAsks = seller.historyAsks;
    const deletePosition = sellerPendingAsks.findIndex(
      (ask) => ask.askId === deal.offerId
    );
    const askForDelete = sellerPendingAsks[deletePosition];
    // Add to seller history asks
    sellerHistoryAsks.unshift({
      price: askForDelete.price,
      size: askForDelete.size,
      productIdentifier: askForDelete.productIdentifier,
    });
    // Add to product last sales
    const productLastSales = product.sizes.get(deal.size).lastSales;
    const addPosition = productLastSales.findIndex(
      (productSale) => productSale.price > deal.price
    );
    if (addPosition === -1) {
      productLastSales.push({
        price: askForDelete.price,
      });
    } else {
      productLastSales.splice(addPosition, 0, {
        price: askForDelete.price,
      });
    }
    // Remove from seller pending asks
    sellerPendingAsks.splice(deletePosition, 1);

    const buyer = await User.findById(deal.buyer);
    buyer.pendingBids.find((bid) => bid.bidId === deal.offerId).status =
      'Item Verified';

    const updatedDeal = await deal.save();
    await seller.save();
    await buyer.save();
    await product.save();

    res.status(200).json(updatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Update deal status to 'Sent to the Buyer'
// @route   PUT /api/deals/:id/toBuyer
// @access  Private/Admin
const updateDealToSentToBuyer = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    deal.status = 'Sent To Buyer';

    const buyer = await User.findById(deal.buyer);
    buyer.pendingBids.find((bid) => bid.bidId === deal.offerId).status =
      'Sent to Buyer';

    const updatedDeal = await deal.save();
    await buyer.save();

    res.status(200).json(updatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Update deal status to 'Shipped'
// @route   PUT /api/deals/:id/shipped
// @access  Private/Admin
const updateDealToShipped = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ offerId: req.params.id });

  if (deal) {
    deal.status = 'Shipped';

    const buyer = await User.findById(deal.buyer);
    const buyerPendingBids = buyer.pendingBids;
    const buyerHistoryBids = buyer.historyBids;
    const deletePosition = buyerPendingBids.findIndex(
      (bid) => bid.bidId === deal.offerId
    );
    const bidForDelete = buyerPendingBids[deletePosition];
    // Add to buyer history asks
    buyerHistoryBids.unshift({
      price: bidForDelete.price,
      size: bidForDelete.size,
      productIdentifier: bidForDelete.productIdentifier,
    });
    // Remove from buyer pending bids
    buyerPendingBids.splice(deletePosition, 1);

    const updatedDeal = await deal.save();
    await buyer.save();

    res.status(200).json(updatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

export {
  getDeals,
  getDealById,
  updateDealToSentBySeller,
  updateDealToVerificationInProgress,
  updateDealToVerified,
  updateDealToSentToBuyer,
  updateDealToShipped,
};
