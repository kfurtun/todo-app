import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: 600,
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret_key!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function isValidToken(token: string | undefined) {
  try {
    if (!token) return false;
    const secret_key = process.env.SECRET_KEY;
    jwt.verify(token, secret_key!);
    return true;
  } catch {
    return false;
  }
}
