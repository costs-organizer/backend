import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseDateEntity } from '../modules/base';
import { Group } from './group.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Transaction extends BaseDateEntity {
  @Field()
  @Column(() => Number)
  moneyAmount: number;

  @Column(() => Boolean)
  isCompleted: boolean;

  @Field(() => Group)
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
}
