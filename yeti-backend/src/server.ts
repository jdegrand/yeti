import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { sequelize } from './config/sequelize';
import { context } from './types/GraphQLContext';
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from './middleware/permissions';


const startServer = async () => {
  const app = express() as any;

  const schemaWithMiddleware = applyMiddleware(schema, permissions)

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    context,
    debug: false,
    formatError: (error) => {
      const { locations, ...customError } = error
      return customError;
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