import { throwYetiError } from '../types/YetiError';
import { Task } from '../models/Task';
import { GraphQLContext } from 'src/types/GraphQLContext';

export const taskResolvers = {
  Query: {
    getTask: async (_: any, { id }: { id: number }) => {
      try {
        return await Task.findByPk(id);
      } catch (error) {
        throwYetiError(error);
      }
    },
    getTasks: async () => {
      try {
        return await Task.findAll();
      } catch (error) {
        throwYetiError(error);
      }
    },
  },
  Mutation: {
    createTask: async (_: any, args: any, context: GraphQLContext) => {
      try {
      return await Task.create(args)
      } catch (error) {
        throwYetiError(error);
      }
    },
  },
};
