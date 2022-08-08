import { Field, InputType } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsString } from 'class-validator';

@InputType()
export class FindAllGroupsInput {
  @IsString()
  @Trim()
  @Field({ nullable: true })
  public readonly search?: string;
}
