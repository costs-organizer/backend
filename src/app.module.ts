import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath, TransactionsCalculator } from './shared/utils';
import { PubSubModule, TypeOrmConfigService } from './shared';
import { UsersModule } from './modules/users/users.module';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CostsModule } from './modules/costs/costs.module';
import { TransactionsModule } from './modules/transactions/transacrions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BullModule } from '@nestjs/bull';
import 'dotenv/config';
import { Context } from 'graphql-ws';
import { AuthHelper } from './modules/auth';

const envFilePath: string = getEnvPath(`${__dirname}/..`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      useFactory: async (authHelper: AuthHelper) => ({
        path: '/graphql',
        playground: true,
        debug: true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        cors: {
          origin: ['http://localhost:3000', 'https://localhost:3000'],
          credentials: true,
        },
        subscriptions: {
          'graphql-ws': {
            connectionInitWaitTimeout: 5000,
            onConnect: async (context: Context<any>) => {
              const { extra } = context;

              const token = (extra as any).request.headers.cookie?.replace(
                'Authorization=',
                '',
              );
              (extra as any).user = await authHelper.decode(token);
            },
          },
          context: ({ req, res, extra }) => ({ req, res, extra }),
        },
      }),
      imports: [AuthModule],
      inject: [AuthHelper],
      driver: ApolloDriver,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    CostsModule,
    TransactionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [TransactionsCalculator, AppService, PubSubModule],
})
export class AppModule {}
