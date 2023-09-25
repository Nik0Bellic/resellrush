import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItem: itemFromClient, shippingInfo, paymentMethod } = req.body;

  const itemFromDB = await Product.findById(itemFromClient._id);

  if (!itemFromDB) {
    res.status(400);
    throw new Error('Invalid order item');
  }

  const lowestAsk = Math.min(...itemFromDB.asks.map((ask) => ask.price));

  if (itemFromClient.purchasePrice !== lowestAsk) {
    res.status(400);
    throw new Error('Buy price is not equal to the lowest ask');
  }

  const orderItem = {
    ...itemFromDB.toObject(),
    product: itemFromClient._id,
    size: itemFromClient.size,
    _id: undefined,
  };

  const { purchasePrice, shippingPrice, processingFee, totalPrice } =
    calcPrices(lowestAsk);

  const order = new Order({
    orderItem: { ...orderItem },
    user: req.user._id,
    shippingInfo,
    paymentMethod,
    purchasePrice,
    processingFee,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderbyId = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email');

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    const paidCorrectAmount = order.totalPrice === Number(value);
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.status = 'Paid';
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = 'Delivered';
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id firstName lastName');
  res.status(200).json(orders);
});

export {
  createOrder,
  getMyOrders,
  getOrderbyId,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
