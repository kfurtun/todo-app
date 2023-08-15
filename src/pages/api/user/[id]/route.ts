import { verifyJwt } from '@/lib/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.headers['authorization'];

  if (!accessToken || !verifyJwt(accessToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ message: 'al sana post' });
}
