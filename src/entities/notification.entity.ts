import { ObjectType, Field, registerEnumType, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseDateEntity } from './base-date-entity';
import { Group } from './group.entity';
import { User } from './user.entity';

export enum NotificationType {
  TRANSACTION_RECEIVED = 'TRANSACTION_RECEIVED',
  GROUP_SETTLED = 'GROUP_SETTLED',
  REMINDER = 'REMINDER',
}

registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType()
@Entity()
export class Notification extends BaseDateEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Field(() => Int)
  @Column('int', { nullable: true })
  createdById: number;

  @Field(() => [User])
  @ManyToMany(() => User, (r) => r.receivedNotifications)
  @JoinTable()
  receivers: User[];

  @Field(() => Group)
  @ManyToOne(() => Group, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Field(() => Int)
  @Column('int')
  groupId: number;

  @Field(() => NotificationType)
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Field(() => [Int])
  @Column('int', { array: true })
  readBy: number[];
}
