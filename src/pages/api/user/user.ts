import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';
import { connectDb } from '@/utils/connectDb';

interface ReqBody {
  name: string;
  email: string;
  password: string;
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body: ReqBody = req.body;

  const db = await connectDb();

  const registerUser = await db.collection('users').insertOne({
    name: body.name,
    email: body.email,
    password: await bcrypt.hash(body.password, 10),
  });

  if (registerUser.acknowledged) {
    const user = await db.collection('users').findOne({
      email: body.email,
    });
    if (user) {
      res.status(200).json({ name: user.name, email: user.email });
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  } else {
    res.status(404).json({ message: 'User not found!' });
  }
}
