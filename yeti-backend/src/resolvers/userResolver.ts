import { CreateUserInput } from 'src/types/generated';
import { UserService } from '../services/UserService';
import { GraphQLContext } from 'src/types/GraphQLContext';
import { throwYetiError } from '../types/YetiError';

const userService = new UserService();

export const userResolvers = {
  Query: {
    login: async (_: unknown, { username, password }: { username: string, password: string }) => {
      try {
        return await userService.login(username, password);
      } catch (error) {
        throwYetiError(error);
      }
    },
    getUser: async (_: unknown, { id }: { id: string }) => {
      try {
        return await userService.getUserById(id);
      } catch (error) {
        throwYetiError(error);
      }
    },
    getUsers: async (_0: unknown, _1: unknown, context: GraphQLContext) => {
      try {
        return await userService.getAllUsers();
      } catch (error) {
        throwYetiError(error);
      }
    },
  },
  Mutation: {
    register: async (_: unknown, { input }: { input: CreateUserInput }) => {
      try {
        return await userService.register(input);
      } catch (error) {
        throwYetiError(error);
      }
    },
    deleteUser: async (_: unknown,  { id }: { id: string }) => {
      try {
        return await userService.deleteUser(id);
      } catch (error) {
        throwYetiError(error);
      }
    },
  },
};