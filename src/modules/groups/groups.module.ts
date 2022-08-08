import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { Group } from '../../entities';
import { EntityValidator } from 'src/shared/validators';
import { ObjectWithDatesGenerator } from 'src/shared/utils';

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
