import mongoose from 'mongoose';
import dotenv, { config } from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import asks from './data/asks.js';
import bids from './data/bids.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      const productIdentifier = (product.name + ' ' + product.color)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '');

      const defaultSizes = [
        3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
        12, 12.5, 13, 14, 15, 16, 17,
      ];

      const sizesObj = {};

      defaultSizes.forEach((size) => {
        sizesObj[String(size).replace('.', ',')] = {
          asks: [],
          bids: [],
        };
      });

      return {
        ...product,
        user: adminUser,
        productIdentifier,
        sizes: sizesObj,
      };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    const shippingInfo = {
      shippingService: 'DHL',
      firstName: 'John',
      lastName: 'Doe',
      country: 'USA',
      city: 'San Francisco',
      region: 'California',
      address: 'Main street 20',
      postalCode: '94016',
      shippingComments: '',
    };

    const payMethod = 'Paypal';

    for (const ask of asks) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomProduct =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];

      randomUser.currentAsks.push({
        ...ask,
        productIdentifier: randomProduct.productIdentifier,
        returnShippingInfo: shippingInfo,
        payoutMethod: payMethod,
      });

      const { size, ...askWithoutSize } = ask;

      const productAsksBySize = randomProduct.sizes.get(String(size)).asks;
      const position = productAsksBySize.findIndex(
        (productAsk) => productAsk.price > askWithoutSize.price
      );
      if (position === -1) {
        productAsksBySize.push({
          ...askWithoutSize,
          user: randomUser._id,
          offerId: askWithoutSize.askId,
        });
      } else {
        productAsksBySize.splice(position, 0, {
          ...askWithoutSize,
          user: randomUser._id,
          offerId: askWithoutSize.askId,
        });
      }

      await randomUser.save();
      await randomProduct.save();
    }

    for (const bid of bids) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomProduct =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];

      randomUser.currentBids.push({
        ...bid,
        productIdentifier: randomProduct.productIdentifier,
        shippingInfo,
        paymentMethod: payMethod,
      });

      const { size, ...bidWithoutSize } = bid;

      const productBidsBySize = randomProduct.sizes.get(String(size)).bids;
      const position = productBidsBySize.findIndex(
        (productBid) => productBid.price < bid.price
      );
      if (position === -1) {
        productBidsBySize.push({
          ...bidWithoutSize,
          user: randomUser._id,
          offerId: bidWithoutSize.bidId,
        });
      } else {
        productBidsBySize.splice(position, 0, {
          ...bidWithoutSize,
          user: randomUser._id,
          offerId: bidWithoutSize.bidId,
        });
      }

      await randomUser.save();
      await randomProduct.save();
    }

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
