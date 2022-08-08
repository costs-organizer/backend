import { ObjectType, Field } from '@nestjs/graphql';
import { BaseDateEntity } from 'src/modules/base';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
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
  decription: string;

  @Field()
  @Column(() => Number)
  moneyAmount: number;

  @Field()
  @Column(() => Boolean)
  isCompleted: boolean;

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
