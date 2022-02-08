const { gql } = require('apollo-server');

module.exports = gql`
  type Payments {
    paymentType: String
    paymentId: String
  }
  type OrderItems {
    productName: String
    productQty: Int
  }
  type UserOrders {
    ordersGenerated: [OrderItems]
    ordersAccepted: [OrderItems]
  }
  type UserOrderIds {
    orderId: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    createdAt: String!
    address: [String]
    phone: String
    payments: [Payments]
    points: Int
    ordersGenerated: [UserOrderIds]
    ordersAccepted: [UserOrderIds]
  }

  type Order {
    orderName: String
    orderCategory: String
    orderGeneratedBy: String!
    orderItems: [OrderItems]
    points: Int
    orderAcceptedBy: String
  }
  input OrderItemInput {
    productName: String
    productQty: Int
  }
  input PaymentInput {
    paymentType: String
    paymentId: String
  }
  input RegisterInput {
    username: String!
    password: String!
    email: String!
  }
  input UserDetailsInput {
    address: String
    payments: PaymentInput
    points: Int
    phone: String
  }
  input OrderInput {
    orderName: String
    orderCategory: String
    orderGeneratedBy: String!
    orderItems: [OrderItemInput]
    points: Int
  }
  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getOrders: [Order]
    getOrder(orderId: ID!): Order
    getUserOrders(userId: ID!): [UserOrders]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updateUserDetails(userDetailsInput: UserDetailsInput): User!
    addOrder(orderInput: OrderInput): Order
  }
`;
