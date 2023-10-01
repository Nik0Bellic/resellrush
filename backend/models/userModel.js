import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userCurrentAskSchema = mongoose.Schema(
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
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
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
      shippingComments: { type: String },
    },
    payoutMethod: {
      type: String,
      required: true,
    },
    askId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userPendingAskSchema = mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
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
      shippingComments: { type: String },
    },
    payoutMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Matched',
    },
    askId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userHistoryAskSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userCurrentBidSchema = mongoose.Schema(
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
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
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
      shippingComments: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    bidId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userPendingBidSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
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
      shippingComments: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Matched',
    },
    bidId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userHistoryBidSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    productIdentifier: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shippingInfo: {
      shippingService: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      country: { type: String },
      city: { type: String },
      region: { type: String },
      address: { type: String },
      postalCode: { type: String },
    },
    payMethod: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentAsks: [userCurrentAskSchema],
    currentBids: [userCurrentBidSchema],
    pendingAsks: [userPendingAskSchema],
    pendingBids: [userPendingBidSchema],
    historyAsks: [userHistoryAskSchema],
    historyBids: [userHistoryBidSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Check if the password is already hashed
  if (this.password && this.password.startsWith('$2a$')) {
    return next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  }
});

const User = mongoose.model('User', userSchema);

export default User;
