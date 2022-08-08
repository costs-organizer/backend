import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber } from 'class-validator';

@InputType()
export class RemoveUserFromGroupInput {
  @IsNumber()
  @Field(() => Int)
  public readonly groupId: number;

  @Field(() => Int)
  @IsInt()
  public readonly userId: number;
}
