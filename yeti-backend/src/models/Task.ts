import { Model, Column, Table, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { TaskStatus } from '../types/TaskStatus';
import { User } from './User';

@Table({
    tableName: 'task',
})
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dueDate?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}

export default Task;
