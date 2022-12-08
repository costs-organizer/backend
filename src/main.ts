import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Queue } from 'bull';
import * as cookieParser from 'cookie-parser';
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import './shared/extensions';
import { QueueType } from './shared/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  app.use(graphqlUploadExpress());
  const port: number = config.get<number>('PORT');
  console.log(port);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://localhost:3000'],
  });

  app.use(cookieParser());

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-board');
  const aQueue = app.get<Queue>(`BullQueue_${QueueType.TransactionQueue}`);
  createBullBoard({
    queues: [new BullAdapter(aQueue)],
    serverAdapter,
  });
  app.use('/bull-board', serverAdapter.getRouter());

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL'));
  });
}
bootstrap();
