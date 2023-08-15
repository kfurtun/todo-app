import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { isValidToken, verifyJwt } from '@/lib/jwt';
import { GraphQLError } from 'graphql';

import { readFileSync } from 'fs';
import { TaskQueries, TaskMutations } from '@/graphql/datasources';
import resolvers from '@/graphql/resolvers/index';

export interface MyContext {
  dataSources: {
    taskQueries: TaskQueries;
    taskMutations: TaskMutations;
  };
}

const typeDefs = readFileSync('src/graphql/schema.graphql', {
  encoding: 'utf-8',
});

const apolloServer = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    const token = req.headers.authorization;

    if (!isValidToken(token)) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    return {
      req,
      res,
      dataSources: {
        taskQueries: new TaskQueries(),
        taskMutations: new TaskMutations(),
      },
    };
  },
});

export default handler;
