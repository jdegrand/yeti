import { validateAuthentication } from '../middleware/auth';
import { Task } from '../models/Task';
import { GraphQLContext } from 'src/types/GraphQLContext';

export const taskResolvers = {
  Query: {
    getTask: async (_: any, { id }: { id: number }) => await Task.findByPk(id),
    getTasks: async () => await Task.findAll(),
  },
  Mutation: {
    createTask: async (_: any, args: any, context: GraphQLContext) => {
     validateAuthentication(context)
     return await Task.create(args)
    },
  },
};
