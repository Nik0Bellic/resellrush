import mongoose from 'mongoose';

const productOfferSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    expiration: {
      type: Number,
      required: true,
      default: 30,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      index: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    modelLine: {
      type: String,
    },
    series: {
      type: String,
    },
    height: {
      type: String,
    },
    style: {
      type: String,
      required: true,
    },
    colorway: {
      type: String,
      required: true,
    },
    retailPrice: {
      type: Number,
    },
    releaseData: {
      type: String,
    },
    description: {
      type: String,
    },
    sizes: {
      type: Map,
      of: {
        asks: [productOfferSchema],
        bids: [productOfferSchema],
      },
    },
    productLowestAsk: {
      type: Number,
    },
    productHighestBid: {
      type: Number,
    },
    productLastSale: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
