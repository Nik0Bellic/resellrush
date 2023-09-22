import mongoose from 'mongoose';
import { bidSchema, askSchema } from './bidAndAskModels.js';

const sizePriceSchema = mongoose.Schema({
  size: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

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
    bids: [bidSchema],
    asks: [askSchema],
    availableSizes: [sizePriceSchema],
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

// productSchema.methods.getAvailableSizesDict = function () {
//   const dict = {};
//   this.availableSizes.forEach((sizePrice) => {
//     dict[sizePrice.size] = sizePrice.price;
//   });
//   return dict;
// };

// productSchema.pre('save', function(next) {
//   if (this.availableSizes && this.availableSizes.length > 0) {
//     let lowest = this.availableSizes[0].price;
//     this.availableSizes.forEach(sizePrice => {
//       if (sizePrice.price < lowest) {
//         lowest = sizePrice.price;
//       }
//     });
//     this.lowestAsk = lowest;
//   }
//   next();
// });

const Product = mongoose.model('Product', productSchema);

export default Product;
