import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetTransactionConfirmationFileOutput {
  @Field()
  base64File: string;

  @Field()
  filename: string;
}
