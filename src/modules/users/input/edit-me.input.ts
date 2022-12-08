import { Field, InputType, Int } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsIBAN,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class EditMeInput {
  @IsNumber()
  @Field(() => Int)
  public readonly id: number;

  @Trim()
  @IsEmail()
  @Field()
  @IsString()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  @Field({ nullable: true })
  @IsOptional()
  public readonly oldPassword?: string | null;

  @IsString()
  @MinLength(8)
  @Field({ nullable: true })
  @IsOptional()
  public readonly newPassword?: string | null;

  @IsString()
  @Trim()
  @Field()
  @MinLength(1)
  public readonly username: string;

  @Field({ nullable: true })
  @Matches(/^\+\d{11,14}$/)
  @IsOptional()
  phone?: string | null;

  @Field({ nullable: true })
  @IsIBAN()
  @IsOptional()
  IBAN?: string | null;
}
