import { Field, InputType, Int } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsString, IsArray, IsNumber } from 'class-validator';

@InputType()
export class EditCostInput {
  @Field(() => Int)
  @IsNumber()
  public readonly costId: number;

  @IsString()
  @Trim()
  @Field()
  public readonly name: string;

  @IsString()
  @Trim()
  @Field()
  public readonly description: string;

  @Field(() => Int)
  @IsNumber()
  public readonly moneyAmount: number;

  @Field(() => [Int])
  @IsArray()
  public readonly participantsIds: number[];
}
