import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Trim } from 'class-sanitizer';

@InputType()
export class RegisterInput {
  @Trim()
  @IsEmail()
  @Field()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  @Field()
  public readonly password: string;

  @IsString()
  @Trim()
  @Field()
  public readonly name: string;
}
