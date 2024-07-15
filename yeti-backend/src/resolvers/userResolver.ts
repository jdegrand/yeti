import { CreateUserInput, User } from 'src/types/generated';
import { UserService } from '../services/UserService';
import { GraphQLContext } from 'src/types/GraphQLContext';
import { validateAuthentication } from '../middleware/auth';

const userService = new UserService();

export const userResolvers = {
  Query: {
    login: async (_: unknown, { username, password }: { username: string, password: string }) => {
      return await userService.login(username, password);
    },
    getUser: async (_: unknown, { id }: { id: string }) => {
      return await userService.getUserById(id);
    },
    getUsers: async (_0: unknown, _1: unknown, context: GraphQLContext) => {
      validateAuthentication(context);
      return await userService.getAllUsers();
    },
  },
  Mutation: {
    register: async (_: any, { input }: { input: CreateUserInput }) => {
      return await userService.register(input);
    },
  },
};