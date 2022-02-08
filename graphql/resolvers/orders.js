const Order = require('../../models/Orders');
const User = require('../../models/User');
const checkAuth = require('../../utils/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    async getOrders() {
      try {
        const orders = await Orders.find({});
        return orders;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getOrder(_, { orderId }) {
      try {
        const order = await Orders.findById(orderId);
        if (order) return order;
        else throw new Error('Order Not Found');
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addOrder(
      _,
      {
        orderInput: {
          orderName,
          orderCategory,
          orderGeneratedBy,
          orderItems,
          points,
        },
      },
      context,
      info,
    ) {
      const user = await User.findOne({ username: orderGeneratedBy });

      const authUser = checkAuth(context);

      if (!authUser) {
        throw new AuthenticationError(
          'You are not authorized to make this order',
        );
      }
      if (authUser.username !== user.username) {
        throw new AuthenticationError(
          'You are not authorized to make this order',
        );
      }
      const newOrder = new Order({
        orderName,
        orderCategory,
        orderGeneratedBy,
        orderItems,
        points,
        createdAt: new Date().toISOString(),
      });

      const res = await newOrder.save();
      const updatedUser = await User.findOneAndUpdate(
        { username: orderGeneratedBy },
        {
          $push: {
            ordersGenerated: {
              orderId: res._id,
            },
          },
        },
        { useFindAndModify: false, new: true },
      );

      return {
        ...res._doc,
        id: res._id,
      };
    },
  },
};
