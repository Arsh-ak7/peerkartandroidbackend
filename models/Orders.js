const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderName: {
      type: String,
      required: true,
    },
    orderCategory: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        productName: {
          type: String,
          required: true,
        },
        productQty: {
          type: Number,
          required: true,
        },
      },
    ],
    orderGeneratedBy: {
      type: String,
      required: true,
    },
    orderAcceptedBy: {
      type: String,
    },
    points: {
      type: Number,
    },
    // suborderIds: [
    //   {
    //     orderId: {
    //       type: String,
    //     },
    //   },
    // ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', OrderSchema);
