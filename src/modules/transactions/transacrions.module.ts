import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityValidator } from 'src/shared/validators';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Transaction>,
    TransactionsService,
    TransactionsResolver,
  ],
})
export class TransactionsModule {}
