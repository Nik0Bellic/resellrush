import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      shippingInfo: user.shippingInfo,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isSeller: updatedUser.isSeller,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update logged in user shipping info
// @route   PUT /api/users/shipping
// @access  Private
const updateShippingInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.shippingInfo = req.body;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      shippingInfo: updatedUser.shippingInfo,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update logged in user pay method
// @route   PUT /api/users/payMethod
// @access  Private
const updatePayMethod = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.payMethod = req.body.payMethod;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      payMethod: updatedUser.payMethod,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user current asks
// @route   GET /api/users/asks/current
// @access  Private
const getMyCurrentAsks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowCurrentAsks = user.currentAsks;

    const currentAsks = await Promise.all(
      rowCurrentAsks.map(async (ask) => {
        const product = await Product.findOne({
          productIdentifier: ask.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }
        const lowestPriceForSize = product.sizes.get(ask.size).asks[0].price;
        return {
          ...ask._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
          currentLowestAsk: lowestPriceForSize,
        };
      })
    );

    res.status(200).json(currentAsks);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user pending asks
// @route   GET /api/users/asks/pending
// @access  Private
const getMyPendingAsks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowPendingAsks = user.pendingAsks;

    const pendingAsks = await Promise.all(
      rowPendingAsks.map(async (ask) => {
        const product = await Product.findOne({
          productIdentifier: ask.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }

        return {
          ...ask._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
        };
      })
    );

    res.status(200).json(pendingAsks);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user history asks
// @route   GET /api/users/asks/history
// @access  Private
const getMyHistoryAsks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowHistoryAsks = user.historyAsks;

    const historyAsks = await Promise.all(
      rowHistoryAsks.map(async (ask) => {
        const product = await Product.findOne({
          productIdentifier: ask.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }

        return {
          ...ask._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
        };
      })
    );

    res.status(200).json(historyAsks);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user current bids
// @route   GET /api/users/bids/current
// @access  Private
const getMyCurrentBids = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowCurrentBids = user.currentBids;

    const currentBids = await Promise.all(
      rowCurrentBids.map(async (bid) => {
        const product = await Product.findOne({
          productIdentifier: bid.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }
        const highestBidForSize = product.sizes.get(bid.size).bids[0]?.price;

        return {
          ...bid._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
          currentHighestBid: highestBidForSize,
        };
      })
    );

    res.status(200).json(currentBids);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user pending bids
// @route   GET /api/users/bids/pending
// @access  Private
const getMyPendingBids = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowPendingBids = user.pendingBids;

    const pendingBids = await Promise.all(
      rowPendingBids.map(async (bid) => {
        const product = await Product.findOne({
          productIdentifier: bid.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }

        return {
          ...bid._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
        };
      })
    );

    res.status(200).json(pendingBids);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get logged in user history bids
// @route   GET /api/users/bids/history
// @access  Private
const getMyHistoryBids = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const rowHistoryBids = user.historyBids;

    const historyBids = await Promise.all(
      rowHistoryBids.map(async (bid) => {
        const product = await Product.findOne({
          productIdentifier: bid.productIdentifier,
        });
        if (!product) {
          throw new Error(`Product not found`);
        }

        return {
          ...bid._doc,
          productName: product.name,
          productColor: product.color,
          productImage: product.image,
        };
      })
    );

    res.status(200).json(historyBids);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isSeller = Boolean(req.body.isSeller);
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isSeller: updatedUser.isSeller,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateShippingInfo,
  updatePayMethod,
  getMyCurrentAsks,
  getMyPendingAsks,
  getMyHistoryAsks,
  getMyCurrentBids,
  getMyPendingBids,
  getMyHistoryBids,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
