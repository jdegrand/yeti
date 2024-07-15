import { customScalarResolver } from './customScalarResolver';
import { taskResolvers } from './taskResolver';
import { userResolvers } from './userResolver';

export const resolvers = {
  ...customScalarResolver,
  Query: {
    ...taskResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
