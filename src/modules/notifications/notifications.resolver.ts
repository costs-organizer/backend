import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Args,
  Int,
  Query,
  Mutation,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Notification, Transaction, User } from 'src/entities';
import { PUB_SUB } from 'src/shared';
import { CurrentUser } from 'src/shared/decorators';
import { NotificationTypes } from 'src/shared/types';
import { JwtAuthGuard } from '../auth/auth.guard';
import { NotificationsService } from './notifications.service';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Notification], { name: 'notifications' })
  async findAll(@CurrentUser() currentUser: User) {
    return await this.notificationsService.findAll(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Notification)
  async findOne(
    @CurrentUser() currentUser: User,
    @Args('notificationId', { type: () => Int }) notificationId: number,
  ) {
    return this.notificationsService.findOne(currentUser, notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Int])
  async markAsRead(
    @CurrentUser() currentUser: User,
    @Args('notificationIds', { type: () => [Int] }) notificationIds: number[],
  ) {
    return this.notificationsService.readNotifications(
      currentUser,
      notificationIds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async sendReminder(
    @CurrentUser() currentUser: User,
    @Args('transactionId', { type: () => Int }) transactionId: number,
  ) {
    const newNotification = await this.notificationsService.sendReminder(
      currentUser,
      transactionId,
    );
    await this.pubSub.publish(NotificationTypes.ReminderSent, {
      notification: newNotification,
    });
    return transactionId;
  }

  @Subscription(() => Notification, {
    filter: (payload, variables) => {
      return payload;
    },
  })
  async transactionCompleted() {
    return this.pubSub.asyncIterator(NotificationTypes.TransactionCompleted);
  }

  @Subscription(() => Notification, {
    resolve: (value) => {
      console.log(value);
      return value.notification;
    },
  })
  async reminderSent(@Context('req') req: Request) {
    console.log(req);
    return this.pubSub.asyncIterator(NotificationTypes.ReminderSent);
  }
}
