import { CreateUserInput, User } from 'src/types/generated';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const userResolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: number }) => {
      return await userService.getUserById(id);
    },
    getUsers: async () => {
      return await userService.getAllUsers();
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      return await userService.createUser(input);
    },
  },
};