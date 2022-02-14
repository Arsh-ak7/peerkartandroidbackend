const mongoose = require('mongoose');

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
    phone: {
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
    ordersGenerated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
      },
    ],
    ordersAccepted: [
      {
        type: String,
        required: true,
        ref: 'Order',
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
