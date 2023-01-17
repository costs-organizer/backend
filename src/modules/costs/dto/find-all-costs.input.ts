import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber } from 'class-validator';

@InputType()
export class FindAllCostsInput {
  @Field(() => Int)
  @IsNumber()
  public readonly groupId: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  public readonly filterByName?: boolean;
}
