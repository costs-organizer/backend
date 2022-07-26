import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { UniqueWhenNotDeleted } from 'src/shared/decorators';
import { BaseDateEntity } from '../../base';

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

  @Field()
  @Column()
  passwordHash: string;

  @Field()
  @Column()
  passwordSalt: string;
}
