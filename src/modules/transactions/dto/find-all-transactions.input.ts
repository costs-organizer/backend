import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber } from 'class-validator';

@InputType()
export class FindAllTransactionsInput {
  @Field(() => Int)
  @IsNumber()
  public readonly groupId: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  public readonly filterByUser?: boolean;
}
