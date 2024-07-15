import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'apollo-server-express';
import { resolvers } from './resolvers';

const typeDefs = gql`
  scalar DateTime

  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type Task {
    id: ID!
    userId: Int!
    title: String
    description: String
    dueDate: String
    priority: Int
    status: TaskStatus
    createdAt: DateTime
    updatedAt: DateTime
  }

  type User {
    id: ID!
    username: String!
    email: String
    firstName: String
    lastName: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateUserInput {
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    getTask(id: ID!): Task
    getTasks: [Task]
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createTask(userId: ID!, title: String, description: String, dueDate: String, priority: Int, status: String): Task
    createUser(input: CreateUserInput!): User!
    deleteUser(userId: ID!): User!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});