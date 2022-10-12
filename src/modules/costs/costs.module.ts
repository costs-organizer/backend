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

@Module({
  imports: [TypeOrmModule.forFeature([Cost]), CqrsModule],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Cost>,
    CostsService,
    CostsResolver,
    AddCostCommand,
    AddCostHandler,
    TransactionsCalculator,
  ],
})
export class CostsModule {}
