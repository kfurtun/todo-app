import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      accessToken: string;
      name: string;
      email: string;
    };
  }
}
