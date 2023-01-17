import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsBoolean } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadConfirmationInput {
  @Field(() => Int)
  @IsNumber()
  public readonly transactionId: number;

  @Field(() => GraphQLUpload)
  public readonly file: Promise<FileUpload>;
}
