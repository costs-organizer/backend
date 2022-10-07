import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostsService } from './costs.service';
import { CostsResolver } from './costs.resolver';
import { Cost } from '../../entities';
import { EntityValidator } from 'src/shared/validators';
import { ObjectWithDatesGenerator } from 'src/shared/utils';

@Module({
  imports: [TypeOrmModule.forFeature([Cost])],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Cost>,
    CostsService,
    CostsResolver,
  ],
})
export class CostsModule {}
