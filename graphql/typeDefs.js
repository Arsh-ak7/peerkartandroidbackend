const { gql } = require('apollo-server');

module.exports = gql`
  type Payments {
    paymentType: String
    paymentId: String
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    createdAt: String!
    address: [String]
    payments: [Payments]
    points: Int
  }
  type Payments {
    paymentType: String
    paymentId: String
  }
  # type UserDetails {
  #   address: [String]
  #   payments: [Payments]
  #   points: Int
  # }
  # type CompleteUserDetails {
  #   id: ID!
  #   username: String!
  #   email: String!
  #   token: String
  #   createdAt: String!
  #   address: [String]
  #   payments: [Payments]
  #   points: Int
  #   userDetails: UserDetails
  # }
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
  }
  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updateUserDetails(userDetailsInput: UserDetailsInput): User!
  }
`;
