import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostsService } from './costs.service';
import { CostsResolver } from './costs.resolver';
import { Cost } from '../../entities';
import { EntityValidator } from 'src/shared/validators';
import {
  ObjectWithDatesGenerator,
  TransactionsCalculator,
} from 'src/shared/utils';
import { AddCostCommand, AddCostHandler } from './add-cost';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { QueueType } from 'src/shared/types';
import { TransactionConsumer } from 'src/consumers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cost]),
    CqrsModule,
    BullModule.registerQueue({
      name: QueueType.TransactionQueue,
    }),
  ],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Cost>,
    CostsService,
    CostsResolver,
    AddCostCommand,
    AddCostHandler,
    TransactionsCalculator,
    TransactionConsumer,
  ],
})
export class CostsModule {}
