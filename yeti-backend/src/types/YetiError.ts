import { ApolloError } from 'apollo-server-express';

class YetiError extends ApolloError {
  constructor(message: string, code: string, statusCode: number) {
    super(message, code);
    Object.defineProperty(this, 'name', { value: 'YetiError' });
    this.extensions.statusCode = statusCode;
  }
}

class AuthenticationError extends YetiError {
  constructor(message: string) {
    super(message, 'UNAUTHENTICATED', 401);
  }
}

class ForbiddenError extends YetiError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403);
  }
}

class UserInputError extends YetiError {
  constructor(message: string) {
    super(message, 'BAD_USER_INPUT', 400);
  }
}

class InternalServerError extends YetiError {
  constructor(message: string) {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

export const throwYetiError = (error: unknown) => {
  if (error instanceof YetiError) {
    throw error;
  } else {
    throw new InternalServerError((error as Error).message);
  }
}

export { AuthenticationError, ForbiddenError, UserInputError, InternalServerError };
