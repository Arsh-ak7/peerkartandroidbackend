const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const Order = require('../../models/Orders');
const { SECRET_KEY } = require('../../secrets');
const { validateRegisterInput } = require('../../utils/validators');
const { validateLoginInput } = require('../../utils/validators');
const checkAuth = require('../../utils/checkAuth');
const { AuthenticationError } = require('apollo-server');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' },
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUser(_, { userId }) {
      try {
        const user = User.findById(userId);
        if (user) return user;
        else throw new Error('User Not found');
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserOrders(_, { userId }) {
      try {
        const user = await User.findOne({ username: userId })
          .populate('ordersGenerated')
          .populate('ordersAccepted');
        if (user) {
          const ordersGeneratedPopulated = user.ordersGenerated;
          const ordersAcceptedPopulated = user.ordersAccepted;

          let orders = {
            ordersGenerated: ordersGeneratedPopulated,
            ordersAccepted: ordersAcceptedPopulated,
          };
          return orders;
        } else throw new Error('User Not Found');
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'user not found';
        throw new UserInputError('user not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong Credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info,
    ) {
      //TODO validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      //TODO user doesnt already exists
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username already taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new UserInputError('Email already taken', {
          errors: {
            username: 'This email is taken',
          },
        });
      }
      //TODO has password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        address: [],
        payments: [],
        phone: null,
        points: 500,
        generatedOrders: [],
        acceptedOrders: [],
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async updateUserDetails(
      _,
      { userDetailsInput: { address, payments, points, phone } },
      context,
      info,
    ) {
      const user = checkAuth(context);
      const username = user.username;

      if (!user)
        throw new AuthenticationError(
          'You are not authorized to update details',
        );

      const update = { $set: {}, $push: {} };
      if (points !== undefined) update['$set']['points'] = points;
      if (address !== undefined) update['$push']['address'] = address;
      if (payments !== undefined) update['$push']['payments'] = payments;
      if (phone !== undefined) update['$set']['phone'] = phone;

      const updatedUser = await User.findOneAndUpdate({ username }, update, {
        useFindAndModify: false,
        new: true,
      });
      return updatedUser;
      // try {
      //   const updateUser = await updatedUser.save();
      //   return updateUser;
      // } catch (err) {
      //   throw new Error('Updation Error');
      // }
    },
    async acceptOrder(_, { orderId }, context, info) {
      const user = checkAuth(context);
      const username = user.username;
      if (!user)
        throw new AuthenticationError(
          'You are not authorized to update details',
        );
      try {
        const update = { $set: {}, $push: {} };
        const order = await Order.findOne({ _id: orderId });

        if (order.orderAcceptedBy !== null)
          throw new Error('Order already accepted by someone else');

        update['$set']['orderAcceptedBy'] = username;
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          update,
          {
            useFindAndModify: false,
            new: true,
          },
        );

        const updatedUser = await User.findOneAndUpdate(
          { username },
          {
            $push: {
              ordersAccepted: updatedOrder._id,
            },
          },
          { useFindAndModify: false, new: true },
        )
          .populate('ordersGenerated')
          .populate('ordersAccepted');
        return updatedUser;
      } catch (err) {
        throw new Error('Not able to accept order');
      }
    },
  },
};
