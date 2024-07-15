import { NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import { Request } from 'express';
import { GraphQLContext } from 'src/types/GraphQLContext';


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

export const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const userId = getUserFromBearer(req);
  if (userId) {
      (req as any).user = { userId };
  }
  next();
};

export const validateAuthentication = (context: GraphQLContext) => {
  if (!context.userId) {
    throw new Error('Unauthorized');
  }
}
