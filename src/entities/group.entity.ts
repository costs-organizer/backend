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
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Notification } from './notification.entity';
import { Cost } from './cost.entity';
import { BaseDateEntity } from './base-date-entity';

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

  @Field(() => [Cost])
  @OneToMany(() => Cost, (r) => r.group)
  costs: Cost[];

  @Field(() => [Notification])
  @OneToMany(() => Notification, (r) => r.group)
  notifications: Notification[];

  @Field(() => Notification)
  @ManyToOne(() => Notification, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'groupResolvedNotificationId' })
  groupResolvedNotification: Notification;

  @Field(() => Notification)
  @Column('int', { nullable: true })
  groupResolvedNotificationId: number;
}
