import { User as UserModel } from '../models/User';
import { CreateUserInput, User } from 'src/types/generated';

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

  async getUserById(id: number): Promise<User | null> {
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

  async createUser(input: CreateUserInput): Promise<User> {
    const { username, password, email, firstName, lastName } = input;

    try {
      const newUser = await UserModel.create({
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });

      const { password: omitPassword, ...createdUser } = newUser.toJSON()

      return createdUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error('Failed to create user');
    }
  }

  async deleteUser(userId: number): Promise<User> {
    const userToDelete = await UserModel.findByPk(userId);

    if (!userToDelete) {
      throw new Error(`User with id ${userId} not found`);
    }

    await userToDelete.destroy();

    return this.mapUserToGraphQL(userToDelete.toJSON());;
  }
}
