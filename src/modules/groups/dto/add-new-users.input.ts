import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';

@InputType()
export class AddNewUsersInput {
  @IsNumber()
  @Field(() => Int)
  public readonly groupId: number;

  @Field(() => [Int])
  @IsArray()
  public readonly userIds: number[];
}
