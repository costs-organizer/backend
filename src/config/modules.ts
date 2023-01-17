import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import 'dotenv/config';
import { join } from 'path';

export const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  playground: Boolean(process.env.IS_PRODUCTION),
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
};
