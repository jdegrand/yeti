import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { sequelize } from './config/sequelize';

const startServer = async () => {
  const app = express() as any;

  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });

  await sequelize.sync();

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();