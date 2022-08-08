import { Field, InputType } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @IsString()
  @MinLength(8)
  @Field()
  public readonly password: string;

  @IsString()
  @Trim()
  @Field()
  public readonly name: string;
}
