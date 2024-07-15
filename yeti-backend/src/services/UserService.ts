import { AuthenticationError } from 'apollo-server-express';
import { User as UserModel } from '../models/User';
import { CreateUserInput, User } from 'src/types/generated';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';

export class UserService {
  private mapUserToGraphQL(user: UserModel): User {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(username: string, password: string): Promise<string> {
    const user = await UserModel.findOne({
      where: { username },
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
    });
    return user ? this.mapUserToGraphQL(user) : null
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.findAll({
      attributes: { exclude: ['password'] },
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
      });

      const { password: omitPassword, ...createdUser } = newUser.toJSON()

      return this.mapUserToGraphQL(createdUser);
    } catch (err) {
      console.error('Error signing up:', err);
      throw new Error('Failed to sign up');
    }
  }

  async deleteUser(userId: number): Promise<User> {
    const userToDelete = await UserModel.findByPk(userId);

    if (!userToDelete) {
      throw new Error(`User with id ${userId} not found`);
    }

    await userToDelete.destroy();

    return this.mapUserToGraphQL(userToDelete.toJSON());
  }
}
