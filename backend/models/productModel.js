import mongoose from 'mongoose';

const stockOrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    type: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
    orders: [stockOrderSchema],
    lowestAsk: {
      type: Number,
      required: true,
      default: 0,
    },
    lastSale: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// productSchema.pre('save', function (next) {
//   this.productIdentifier = (this.name + ' ' + this.color)
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^a-z0-9-]+/g, '');
//   next();
// });

const Product = mongoose.model('Product', productSchema);

export default Product;
