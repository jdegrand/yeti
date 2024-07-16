import { Request } from 'express';
import { getUserFromBearer } from '../middleware/auth';
import { UserService } from '../services/UserService';

const userService = new UserService();

interface UserContext {
  userId?: string;
  isAdmin?: boolean;
}

export interface GraphQLContext {
  req: Request;
  user?: UserContext;
}

export const context = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const userId = getUserFromBearer(req);
  let user: UserContext = {};
  if (userId) {
    const fetchedUser = await userService.getUserById(userId);
    user = {
      userId,
      isAdmin: fetchedUser?.isAdmin ?? false,
    }
  }
  return {
      user,
      req,
  } as GraphQLContext;
};
