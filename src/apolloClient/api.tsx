import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL,
});

const authenticationLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.user.accessToken;
  console.log(session, 'zoa');
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

export const client = new ApolloClient({
  link: from([authenticationLink, httpLink]),
  cache: new InMemoryCache(),
  ssrMode: true,
});
