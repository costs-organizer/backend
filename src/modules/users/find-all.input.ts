import { Field, InputType } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class FindAllUsersInput {
  @IsString()
  @Trim()
  @Field({ nullable: true })
  public readonly search?: string;

  @IsOptional()
  @IsNumber({ allowNaN: true })
  @Field({ nullable: true, defaultValue: undefined })
  public readonly groupId?: number | null;
}
