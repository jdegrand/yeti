import { Sequelize } from 'sequelize-typescript';
import { Task } from '../models/Task';
import { User } from '../models/User';

const sequelize = new Sequelize({
  database: 'yeti',
  username: 'postgres',
  password: '',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  models: [Task, User],
});

export { sequelize };
