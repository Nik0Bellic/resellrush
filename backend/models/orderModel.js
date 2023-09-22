import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItem: {
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
    shippingInfo: {
      shippingService: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      orderComments: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    purchasePrice: {
      type: Number,
      required: true,
      dfeault: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      dfeault: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
