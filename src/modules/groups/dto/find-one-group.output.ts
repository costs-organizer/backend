import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cost } from 'src/entities';

@ObjectType()
export class UserField {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(() => Int)
  costsCount: number;
}

@ObjectType()
export class FindOneGroupOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [UserField])
  members: UserField[];

  @Field(() => [Cost])
  costs: Cost[];
}
