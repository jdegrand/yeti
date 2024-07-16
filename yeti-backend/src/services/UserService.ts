import { User as UserModel } from '../models/User';
import { CreateUserInput, User } from 'src/types/generated';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { AuthenticationError, UserInputError } from '../types/YetiError';

export class UserService {
  private mapUserToGraphQL(user: Omit<UserModel, 'password'>): User {
    const {
      first_name: firstName,
      last_name: lastName,
      ...restUser
    } = user;

    return {
      ...restUser,
      firstName,
      lastName,
    } as User;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await UserModel.findOne({
      where: { username },
      raw: true,
    })

    if (!user) {
      throw new AuthenticationError('Username and/or password were incorrect');
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new AuthenticationError('Username and/or password were incorrect');
    }

    return generateToken(user.id);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ['password'] },
      raw: true,
    });
    return user ? this.mapUserToGraphQL(user) : null
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.findAll({
      attributes: { exclude: ['password'] },
      raw: true,
    });
    return users.map(user => this.mapUserToGraphQL(user));
  }

  async register(input: CreateUserInput): Promise<User> {
    const { username, password, email, firstName, lastName } = input;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await UserModel.create({
        username,
        password: hashedPassword,
        email,
        first_name: firstName,
        last_name: lastName,
      }, {
        raw: true,
      });

      const { password: omitPassword, ...createdUser } = newUser;

      return this.mapUserToGraphQL(createdUser as UserModel);
    } catch (err) {
      console.error('Error signing up:', err);
      throw new Error('Failed to sign up');
    }
  }

  async deleteUser(id: string): Promise<User> {
    const userToDelete = await UserModel.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!userToDelete) {
      throw new UserInputError(`User with id '${id}' not found`);
    }

    if (userToDelete.isAdmin) {
      throw new UserInputError(`User with id '${id}' is an admin. You can not delete admins at this time`);
    }

    await userToDelete.destroy();

    return this.mapUserToGraphQL(userToDelete.toJSON());
  }
}
