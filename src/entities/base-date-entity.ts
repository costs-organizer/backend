import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseDateEntity {
  @PrimaryGeneratedColumn('increment')
  @Index()
  @Field(() => Int)
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt' })
  @Field({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt' })
  @Field({ nullable: true })
  deletedAt: Date;
}
