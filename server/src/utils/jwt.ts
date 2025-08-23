// import jwt, {JwtPayload} from 'jsonwebtoken';
// import { config } from '../config/config';

// export const generateToken = (userId: string): string => {
//   return jwt.sign({ userId }, config.jwt.secret, {
//     expiresIn: config.jwt.expiresIn,
//   });
// };

// export const verifyToken = (token: string): { userId: string } => {
//   return jwt.verify(token, config.jwt.secret) as { userId: string };
// };

// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { config } from '../config/config';

// export const generateToken = (userId: string): string => {
//   return jwt.sign(
//     { userId }, 
//     config.jwt.secret as string, 
//     { expiresIn: config.jwt.expiresIn as string }
//   );
// };

// export const verifyToken = (token: string): JwtPayload & { userId: string } => {
//   return jwt.verify(config.jwt.secret as string, token) as JwtPayload & { userId: string };
// };

import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
