import mongoose from 'mongoose';

const dealSchema = mongoose.Schema(
  {
    dealItem: {
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
      productIdentifier: {
        type: String,
        required: true,
      },
    },
    size: {
      type: String,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    },
    returnShippingInfo: {
      shippingService: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    payoutMethod: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    offerId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Matched',
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
