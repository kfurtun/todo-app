import clientPromise from '@/lib/mongodb';

export const connectDb = async () => {
  const client = await clientPromise;

  const db = client.db('todoDb');

  return db;
};
