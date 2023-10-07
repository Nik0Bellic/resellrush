import asyncHandler from '../middleware/asyncHandler.js';
import Deal from '../models/dealModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { calcBidPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { color: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch a product
// @route   GET /api/products/:productId
// @access  Public
const getProductByIdentifier = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    productIdentifier: req.params.productId,
  });

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    color,
    image,
    category,
    brand,
    modelLine,
    series,
    height,
    style,
    colorway,
    retailPrice,
    releaseData,
    description,
  } = req.body;

  const product = new Product({
    user: req.user._id,
    name,
    color,
    image,
    category,
    brand,
    modelLine,
    series,
    height,
    style,
    colorway,
    retailPrice,
    releaseData,
    description,
  });

  const defaultSizes = [
    3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,
    12.5, 13, 14, 15, 16, 17,
  ];

  const sizesObj = {};

  defaultSizes.forEach((size) => {
    sizesObj[String(size).replace('.', ',')] = {
      asks: [],
      bids: [],
    };
  });

  product.sizes = sizesObj;

  product.productIdentifier = (name + ' ' + color)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '');

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:productId
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    color,
    image,
    category,
    brand,
    modelLine,
    series,
    height,
    style,
    colorway,
    retailPrice,
    releaseData,
    description,
  } = req.body;

  const product = await Product.findOne({
    productIdentifier: req.params.productId,
  });

  if (product) {
    if (product.name !== name || product.color !== color) {
      product.productIdentifier = (name + ' ' + color)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '');
    }
    product.name = name;
    product.color = color;
    product.image = image;
    product.category = category;
    product.brand = brand;
    product.modelLine = modelLine;
    product.series = series;
    product.height = height;
    product.style = style;
    product.colorway = colorway;
    product.retailPrice = retailPrice;
    product.releaseData = releaseData;
    product.description = description;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:productId
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    productIdentifier: req.params.productId,
  });

  if (product) {
    await Product.deleteOne({
      productIdentifier: product.productIdentifier,
    });
    res.status(200).json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Get latest products
// @route   GET /api/products/latest
// @access  Public
const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
  res.status(200).json(products);
});

// @desc    Get product asks by size
// @route   GET /api/products/:productId/:size/asks
// @access  Public
const getProductAsks = asyncHandler(async (req, res) => {
  const { productId, size } = req.params;
  const product = await Product.findOne({ productIdentifier: productId });
  const asks = Object.values(
    product.sizes.get(size).asks.reduce((acc, ask) => {
      if (acc[ask.price]) {
        acc[ask.price].quantity += 1;
      } else {
        acc[ask.price] = {
          price: ask.price,
          quantity: 1,
        };
      }
      return acc;
    }, {})
  ).slice(-30);
  res.status(200).json(asks);
});

// @desc    Get product bids by size
// @route   GET /api/products/:productId/:size/bids
// @access  Public
const getProductBids = asyncHandler(async (req, res) => {
  const { productId, size } = req.params;
  const product = await Product.findOne({ productIdentifier: productId });
  const bids = Object.values(
    product.sizes.get(size).bids.reduce((acc, bid) => {
      if (acc[bid.price]) {
        acc[bid.price].quantity += 1;
      } else {
        acc[bid.price] = {
          price: bid.price,
          quantity: 1,
        };
      }
      return acc;
    }, {})
  ).slice(-30);
  res.status(200).json(bids);
});

// @desc    Get product last sales by size
// @route   GET /api/products/:productId/:size/lastSales
// @access  Public
const getProductLastSales = asyncHandler(async (req, res) => {
  const { productId, size } = req.params;
  const product = await Product.findOne({ productIdentifier: productId });
  const lastSales = product.sizes.get(size).lastSales.slice(-30);
  res.status(200).json(lastSales);
});

// @desc    Place new ask
// @route   POST /api/products/:productId/asks
// @access  Private/Seller
const placeAsk = asyncHandler(async (req, res) => {
  const {
    sellItem: itemFromClient,
    seller: userFromClient,
    size,
    askPrice,
    expiration,
    returnShippingInfo,
    payoutMethod,
  } = req.body;

  const itemFromDB = await Product.findById(itemFromClient._id);
  const userFromDB = await User.findById(userFromClient._id);

  if (!itemFromDB) {
    res.status(400);
    throw new Error('Product not found');
  }
  if (!userFromDB) {
    res.status(400);
    throw new Error('User not found');
  }

  const highestBidForSize = itemFromDB.sizes.get(size).bids[0]?.price;

  if (askPrice < 25) {
    res.status(400);
    throw new Error('Ask price must be greater or equal to 25');
  } else if (highestBidForSize && askPrice >= highestBidForSize) {
    res.status(400);
    throw new Error('Ask price must be less than highest bid');
  }

  const askId = uuidv4();

  const productAsksBySize = itemFromDB.sizes.get(size).asks;
  const position = productAsksBySize.findIndex(
    (productAsk) => productAsk.price > askPrice
  );
  if (position === -1) {
    productAsksBySize.push({
      user: userFromDB._id,
      price: askPrice,
      expiration,
      offerId: askId,
    });
  } else {
    productAsksBySize.splice(position, 0, {
      user: userFromDB._id,
      price: askPrice,
      expiration,
      offerId: askId,
    });
  }

  userFromDB.currentAsks.unshift({
    price: askPrice,
    expiration,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    returnShippingInfo,
    payoutMethod,
    askId,
  });

  if (askPrice < itemFromDB.productLowestAsk) {
    itemFromDB.productLowestAsk = askPrice;
  }

  await itemFromDB.save();
  await userFromDB.save();

  res.status(201).json({ message: 'Ask placed' });
});

// @desc    Sale Item
// @route   POST /api/products/:productId/sale
// @access  Private/Seller
const saleNow = asyncHandler(async (req, res) => {
  const {
    sellItem: itemFromClient,
    buyer: buyerFromClient,
    seller: sellerFromClientId,
    bidId,
    size,
    salePrice,
    returnShippingInfo,
    payoutMethod,
  } = req.body;

  // Verify Product and User
  const itemFromDB = await Product.findById(itemFromClient._id);
  const buyerFromDB = await User.findById(buyerFromClient);
  const sellerFromDB = await User.findById(sellerFromClientId);
  if (!itemFromDB) {
    res.status(400);
    throw new Error('Product not found');
  }
  if (!buyerFromDB) {
    res.status(400);
    throw new Error('User not found');
  }
  if (!sellerFromDB) {
    res.status(400);
    throw new Error('Seller not found');
  }

  // Validate Purchase Price
  const buyerBidPrice = buyerFromDB.currentBids.find(
    (bid) => bid.bidId === bidId
  )?.price;
  if (!buyerBidPrice) {
    res.status(400);
    throw new Error('Bid for this price not found');
  } else if (buyerBidPrice !== salePrice) {
    res.status(400);
    throw new Error(
      'Sale price is not equal to highest bid price for this size'
    );
  }

  // Delete bid from Item Bids
  const productBidsBySize = itemFromDB.sizes.get(size).bids;
  const position = productBidsBySize.findIndex((bid) => bid.offerId === bidId);
  productBidsBySize.splice(position, 1);

  // Update Seller's Asks
  sellerFromDB.pendingAsks.unshift({
    buyer: buyerFromDB,
    price: salePrice,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    returnShippingInfo,
    payoutMethod,
    askId: bidId,
  });

  // Update Buyer's bids
  const buyerCurrentBids = buyerFromDB.currentBids;
  const deletePosition = buyerCurrentBids.findIndex(
    (bid) => bid.bidId === bidId
  );
  const shippingInfo = buyerCurrentBids[deletePosition].shippingInfo;
  const paymentMethod = buyerCurrentBids[deletePosition].paymentMethod;
  buyerFromDB.pendingBids.unshift({
    seller: sellerFromDB,
    price: salePrice,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    shippingInfo,
    paymentMethod,
    bidId,
  });
  buyerCurrentBids.splice(deletePosition, 1);

  itemFromDB.productLastSale = salePrice;

  // Create Deal
  const deal = new Deal({
    dealItem: { ...itemFromDB },
    size,
    buyer: buyerFromDB,
    seller: sellerFromDB,
    shippingInfo,
    returnShippingInfo,
    paymentMethod,
    payoutMethod,
    price: salePrice,
    offerId: bidId,
  });

  await deal.save();
  await itemFromDB.save();
  await buyerFromDB.save();
  await sellerFromDB.save();

  res.status(201).json({ message: 'Sale Made Successfully' });
});

// @desc    Place new bid
// @route   POST /api/products/:productId/bids
// @access  Private
const placeBid = asyncHandler(async (req, res) => {
  const {
    buyItem: itemFromClient,
    buyer: userFromClient,
    size,
    bidPrice,
    expiration,
    shippingInfo,
    paymentMethod,
    paypalTransactionId: paymentId,
  } = req.body;

  // Verify Product and User
  const itemFromDB = await Product.findById(itemFromClient._id);
  const userFromDB = await User.findById(userFromClient._id);
  if (!itemFromDB) {
    res.status(400);
    throw new Error('Product not found');
  }
  if (!userFromDB) {
    res.status(400);
    throw new Error('User not found');
  }

  // Validate Bid Price
  const highestBidForSize = itemFromDB.sizes.get(size).bids[0]?.price;
  if (bidPrice < 25) {
    res.status(400);
    throw new Error('Bid price must be greater or equal to 25');
  } else if (highestBidForSize && bidPrice >= highestBidForSize) {
    res.status(400);
    throw new Error('Bid price must be less than highest bid');
  }

  // Calculate Total Price
  const { totalPrice } = calcBidPrices(bidPrice);

  // Verify Payment
  const { verified, value } = await verifyPayPalPayment(paymentId);
  if (!verified) throw new Error('Payment not verified');
  // const isNewTransaction = await checkIfNewTransaction(Deal, paymentId);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');
  if (totalPrice !== value) throw new Error('Incorrect amount paid');

  const bidId = uuidv4();

  // Place the Bid in DB
  const productBidsBySize = itemFromDB.sizes.get(size).bids;
  const position = productBidsBySize.findIndex(
    (productBid) => productBid.price < bidPrice
  );
  if (position === -1) {
    productBidsBySize.push({
      user: userFromDB._id,
      price: bidPrice,
      expiration,
      offerId: bidId,
    });
  } else {
    productBidsBySize.splice(position, 0, {
      user: userFromDB._id,
      price: bidPrice,
      expiration,
      offerId: bidId,
    });
  }

  // Update User's Bids
  userFromDB.currentBids.unshift({
    price: bidPrice,
    expiration,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    shippingInfo,
    paymentMethod,
    bidId,
  });

  await itemFromDB.save();
  await userFromDB.save();

  res.status(201).json({ message: 'Bid placed successfully' });
});

// @desc    Purchase Item
// @route   POST /api/products/:productId/purchase
// @access  Private
const purchaseNow = asyncHandler(async (req, res) => {
  const {
    buyItem: itemFromClient,
    buyer: buyerFromClient,
    seller: sellerFromClientId,
    askId,
    size,
    purchasePrice,
    shippingInfo,
    paymentMethod,
    paypalTransactionId: paymentId,
  } = req.body;

  // Verify Product and User
  const itemFromDB = await Product.findById(itemFromClient._id);
  const buyerFromDB = await User.findById(buyerFromClient._id);
  const sellerFromDB = await User.findById(sellerFromClientId);
  if (!itemFromDB) {
    res.status(400);
    throw new Error('Product not found');
  }
  if (!buyerFromDB) {
    res.status(400);
    throw new Error('User not found');
  }
  if (!sellerFromDB) {
    res.status(400);
    throw new Error('Seller not found');
  }

  // Validate Purchase Price
  const sellerAskPrice = sellerFromDB.currentAsks.find(
    (ask) => ask.askId === askId
  )?.price;
  if (!sellerAskPrice) {
    res.status(400);
    throw new Error('Ask for this price not found');
  } else if (sellerAskPrice !== purchasePrice) {
    res.status(400);
    throw new Error(
      'Purchase price is not equal to lowest ask price for this size'
    );
  }

  // Calculate Total Price
  const { totalPrice } = calcBidPrices(purchasePrice);

  // Verify Payment
  const { verified, value } = await verifyPayPalPayment(paymentId);
  if (!verified) throw new Error('Payment not verified');
  // const isNewTransaction = await checkIfNewTransaction(Deal, paymentId);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');
  if (totalPrice !== value) throw new Error('Incorrect amount paid');

  // Delete ask from Item Asks
  const productAsksBySize = itemFromDB.sizes.get(size).asks;
  const position = productAsksBySize.findIndex((ask) => ask.offerId === askId);
  productAsksBySize.splice(position, 1);

  // Update Buyer's Bids
  buyerFromDB.pendingBids.unshift({
    seller: sellerFromDB,
    price: purchasePrice,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    shippingInfo,
    paymentMethod,
    bidId: askId,
  });

  // Update Seller's asks
  const sellerCurrentAsks = sellerFromDB.currentAsks;
  const deletePosition = sellerCurrentAsks.findIndex(
    (ask) => ask.askId === askId
  );
  const returnShippingInfo =
    sellerCurrentAsks[deletePosition].returnShippingInfo;
  const payoutMethod = sellerCurrentAsks[deletePosition].payoutMethod;
  sellerFromDB.pendingAsks.unshift({
    buyer: buyerFromDB,
    price: purchasePrice,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    returnShippingInfo,
    payoutMethod,
    askId,
  });
  sellerCurrentAsks.splice(deletePosition, 1);

  itemFromDB.productLastSale = purchasePrice;

  // Create Deal
  const deal = new Deal({
    dealItem: { ...itemFromDB },
    size,
    buyer: buyerFromDB,
    seller: sellerFromDB,
    shippingInfo,
    returnShippingInfo,
    paymentMethod,
    payoutMethod,
    price: purchasePrice,
    offerId: askId,
  });

  await deal.save();

  await itemFromDB.save();
  await buyerFromDB.save();
  await sellerFromDB.save();

  res.status(201).json({ message: 'Purchase Made Successfully' });
});

export {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getProductAsks,
  getProductBids,
  getProductLastSales,
  placeAsk,
  saleNow,
  placeBid,
  purchaseNow,
};
