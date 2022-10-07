import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseDateEntity } from './base-date-entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Cost extends BaseDateEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column('int')
  moneyAmount: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Field()
  @Column('int', { nullable: true })
  createdById: number;

  @Field(() => [User])
  @ManyToMany(() => User, (r) => r.participatedCosts)
  @JoinTable()
  participants: User[];

  @Field(() => [Group])
  @ManyToOne(() => Group, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Field()
  @Column('int', { nullable: true })
  groupId: number;
}
