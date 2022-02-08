const userResolvers = require('./users');
const orderResolvers = require('./orders');

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
};
