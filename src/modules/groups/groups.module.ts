import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { EntityValidator } from 'src/shared/validators';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { Group } from '../../entities';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Group>,
    GroupsService,
    GroupsResolver,
  ],
})
export class GroupsModule {}
