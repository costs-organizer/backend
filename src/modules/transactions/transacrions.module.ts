import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityValidator } from 'src/shared/validators';
import {
  ObjectWithDatesGenerator,
  TransactionsCalculator,
} from 'src/shared/utils';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction } from '../../entities';
import { PubSubModule } from 'src/shared';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), PubSubModule],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Transaction>,
    TransactionsService,
    TransactionsResolver,
    TransactionsCalculator,
  ],
})
export class TransactionsModule {}
