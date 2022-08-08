import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseDateEntity } from '../modules/base';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Notification } from './notification.entity';
import { Cost } from './cost.entity';

@ObjectType()
@Entity()
export class Group extends BaseDateEntity {
  @Field()
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Field(() => User)
  @Column('int', { nullable: true })
  createdById: number;

  @Field(() => [User])
  @ManyToMany(() => User, (r) => r.joinedGroups)
  @JoinTable()
  members: User[];

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (r) => r.group)
  transactions: Transaction[];

  @Field(() => [Transaction])
  @OneToMany(() => Cost, (r) => r.group)
  costs: Cost[];

  @Field(() => [Notification])
  @OneToMany(() => Notification, (r) => r.group)
  notifications: Notification[];
}
