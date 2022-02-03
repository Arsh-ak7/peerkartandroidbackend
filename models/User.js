const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
  address: [
    {
      type: String,
    },
  ],
  payments: [
    {
      paymentType: {
        type: String,
      },
      paymentId: {
        type: String,
      },
    },
  ],
  points: {
    type: Number,
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 3,
      required: true,
    },
    token: {
      type: String,
    },
    address: [
      {
        type: String,
      },
    ],
    payments: [
      {
        paymentType: {
          type: String,
        },
        paymentId: {
          type: String,
        },
      },
    ],
    points: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
