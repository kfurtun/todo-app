import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import * as bcrypt from 'bcrypt';
import { signJwtAccessToken } from '@/lib/jwt';
import { connectDb } from '@/utils/connectDb';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectDb();

  const user = await db.collection('tasks').find().toArray();

  return res.status(200).json(user);
}
