import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
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

export {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
};
