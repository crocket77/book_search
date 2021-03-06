// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]        
  },
  type Book{
    _id: ID 
    authors:[String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
  },
  type Query {
    me:User
    books: [Book]
    users: [User]
    user(username: String!): User
  },

  input BookForSave {
    authors: [String]
    title: String!
    description: String
    bookId: String!
    image: String
  }
  type Mutation {
    login(email:String!, password: String!): Auth
    addUser(username:String!, email: String!, password:String!): Auth
    saveBook(book:BookForSave!):User
    deleteBook(bookId:String!):User

  },
  type Auth {
    token:ID!
    user:User
  }
`;

// export the typeDefs
module.exports = typeDefs;