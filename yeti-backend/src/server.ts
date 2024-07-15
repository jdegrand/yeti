import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { sequelize } from './config/sequelize';
import { authMiddleware } from './middleware/auth';
import { GraphQLContext } from './types/GraphQLContext';

const startServer = async () => {
  const app = express() as any;

  // Apply authentication middleware to all routes
  app.use(authMiddleware);

  const server = new ApolloServer({
    schema,
    context: ({ req }): GraphQLContext => {
      return {
          userId: (req as any).user?.userId,
      };
  },
  });

  await server.start();
  server.applyMiddleware({ app });

  await sequelize.sync();

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();