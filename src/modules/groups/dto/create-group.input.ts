import { Field, InputType, Int } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsString, IsArray } from 'class-validator';

@InputType()
export class CreateGroupInput {
  @IsString()
  @Trim()
  @Field()
  public readonly name: string;

  @Field(() => [Int])
  @IsArray()
  public readonly userIds: number[];
}
