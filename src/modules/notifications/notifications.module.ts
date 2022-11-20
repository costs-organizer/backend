import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities';
import { PubSubModule } from 'src/shared';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    EntityValidator,
    ObjectWithDatesGenerator<Notification>,
    NotificationsService,
    NotificationsResolver,
    PubSubModule,
  ],
})
export class NotificationsModule {}
