import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import { Request } from 'express';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const getUserFromBearer = (req: Request): string | undefined =>  {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7, authHeader.length); // Remove 'Bearer '
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
}
