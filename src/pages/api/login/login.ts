import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import * as bcrypt from 'bcrypt';
import { signJwtAccessToken } from '@/lib/jwt';
import { connectDb } from '@/utils/connectDb';

interface ReqBody {
  username: string;
  password: string;
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body: ReqBody = await req.body;

  const db = await connectDb();

  const user = await db.collection('users').findOne({ email: body.username });

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, _id, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = { ...userWithoutPass, accessToken };

    return res.status(200).json(result);
  }
  return res.status(404).json(null);
}
