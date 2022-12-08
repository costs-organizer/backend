import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseDateEntity } from './base-date-entity';
import { Group } from './group.entity';
import { Notification } from './notification.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Transaction extends BaseDateEntity {
  @Field()
  @Column('float4', { default: 0 })
  moneyAmount: number;

  @Column('boolean', { default: false })
  @Field(() => Boolean, { nullable: true })
  isCompleted: boolean;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Field()
  @Column('int', { nullable: true })
  receiverId: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'payerId' })
  payer: User;

  @Field()
  @Column('int', { nullable: true })
  payerId: number;

  @Field(() => Group)
  @ManyToOne(() => Group, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Field()
  @Column('int', { nullable: true })
  groupId: number;

  @Field(() => Notification)
  @ManyToOne(() => Notification, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reminderNotificationId' })
  reminderNotification: Notification;

  @Field()
  @Column('int', { nullable: true })
  reminderNotificationId: number;
}
