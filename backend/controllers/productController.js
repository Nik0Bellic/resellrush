import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { calcBidPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
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

  const productAsksBySize = itemFromDB.sizes.get(size).asks;
  const position = productAsksBySize.findIndex(
    (productAsk) => productAsk.price > askPrice
  );
  if (position === -1) {
    productAsksBySize.push({
      user: userFromDB._id,
      price: askPrice,
      expiration,
    });
  } else {
    productAsksBySize.splice(position, 0, {
      user: userFromDB._id,
      price: askPrice,
      expiration,
    });
  }

  userFromDB.currentAsks.unshift({
    price: askPrice,
    expiration,
    size,
    productIdentifier: itemFromDB.productIdentifier,
    returnShippingInfo,
    payoutMethod,
  });

  await itemFromDB.save();
  await userFromDB.save();

  res.status(201).json({ message: 'Ask placed' });
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
  // const isNewTransaction = await checkIfNewTransaction(Order, paymentId);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');
  if (totalPrice !== value) throw new Error('Incorrect amount paid');

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
    });
  } else {
    productBidsBySize.splice(position, 0, {
      user: userFromDB._id,
      price: bidPrice,
      expiration,
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
  });

  await itemFromDB.save();
  await userFromDB.save();

  res.status(201).json({ message: 'Bid placed successfully' });
});

export {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  placeAsk,
  placeBid,
};
