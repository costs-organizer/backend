import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail, IsIBAN, IsString, Matches } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { UniqueWhenNotDeleted } from '../shared/decorators';
import { Group } from './group.entity';
import { Transaction } from './transaction.entity';
import { Cost } from './cost.entity';
import { Notification } from './notification.entity';
import { Exclude } from 'class-transformer';
import { BaseDateEntity } from './base-date-entity';

@ObjectType()
@Entity()
export class User extends BaseDateEntity {
  @Field()
  @Column()
  @UniqueWhenNotDeleted()
  username: string;

  @Field()
  @IsEmail()
  @Column()
  @UniqueWhenNotDeleted()
  email: string;

  @IsString()
  @Field({ nullable: true })
  @Matches(/^\+[1-9]\d{1,14}$/)
  @Column({ nullable: true })
  @UniqueWhenNotDeleted()
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsIBAN()
  IBAN: string;

  @Field()
  @Column()
  @Exclude()
  passwordHash: string;

  @Field()
  @Column()
  @Exclude()
  passwordSalt: string;

  @Field(() => [Group])
  @OneToMany(() => Group, (r) => r.createdBy)
  createdGroups: Group[];

  @Field(() => [Group])
  @ManyToMany(() => Group, (r) => r.members)
  joinedGroups: Group[];

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (r) => r.receiver)
  receivedTransactions: Transaction[];

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (r) => r.payer)
  paidTransactions: Transaction[];

  @Field(() => [Cost])
  @ManyToMany(() => Cost, (r) => r.participants)
  participatedCosts: Cost[];

  @Field(() => [Cost])
  @OneToMany(() => Cost, (r) => r.createdBy)
  createdCosts: Cost[];

  @Field(() => [Notification])
  @ManyToMany(() => Notification, (r) => r.receivers)
  receivedNotifications: Notification[];

  @Field(() => [Notification])
  @OneToMany(() => Notification, (r) => r.createdBy)
  createdNotifications: Notification[];
}
