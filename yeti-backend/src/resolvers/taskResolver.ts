import { Task } from '../models/Task';

export const taskResolvers = {
  Query: {
    getTask: async (_: any, { id }: { id: number }) => await Task.findByPk(id),
    getTasks: async () => await Task.findAll(),
  },
  Mutation: {
    createTask: async (_: any, args: any) => await Task.create(args),
  },
};
