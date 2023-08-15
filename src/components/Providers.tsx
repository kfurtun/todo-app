'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { client } from '@/apolloClient/api';
import { ApolloProvider } from '@apollo/client';

interface Props {
  children: ReactNode;
  pageProps: any;
}

const Providers = ({ children, pageProps }: Props) => {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
};

export default Providers;
