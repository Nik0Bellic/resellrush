import dotenv from 'dotenv';
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

    const askDict = {};
    const bidDict = {};

    asks.map((offer) => {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];

      const productName = randomProduct.name;

      if (!askDict[productName]) {
        askDict[productName] = [];
      }

      askDict[productName].push({ ...offer, user: randomUser });

      return { ...offer, user: randomUser };
    });

    bids.map((offer) => {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];

      const productName = randomProduct.name;

      if (!bidDict[productName]) {
        bidDict[productName] = [];
      }

      bidDict[productName].push({ ...offer, user: randomUser });

      return { ...offer, user: randomUser };
    });

    const sampleProducts = products.map((product) => {
      const productIdentifier = (product.name + ' ' + product.color)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '');

      const askOffers = askDict[product.name] ? askDict[product.name] : [];
      const bidOffers = bidDict[product.name] ? bidDict[product.name] : [];

      const sizesGroup = askOffers.reduce((acc, offer) => {
        if (!acc[offer.size] || offer.price < acc[offer.size].price) {
          acc[offer.size] = { size: offer.size, price: offer.price };
        }
        return acc;
      }, {});

      const availableSizes = Object.values(sizesGroup).sort(
        (a, b) => a.size - b.size
      );

      // May be in presave
      const lowestAsk = Math.min(...availableSizes.map((offer) => offer.price));

      return {
        ...product,
        user: adminUser,
        productIdentifier,
        asks: [...askOffers],
        bids: [...bidOffers],
        availableSizes,
        lowestAsk,
      };
    });

    await Product.insertMany(sampleProducts);

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
