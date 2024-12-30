import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'SIGMABOY';
const 

export const generateToken = (payload: object, expiresIn = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload: object, expiresIn = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): string | JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};

