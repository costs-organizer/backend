import { Field, InputType } from '@nestjs/graphql';
import { Trim } from 'class-sanitizer';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class FindAllInput {
  @IsString()
  @Trim()
  @Field({ nullable: true })
  public readonly search?: string;

  @IsNumber({ allowNaN: true })
  @Field({ nullable: true })
  public readonly groupId?: number | null;
}
