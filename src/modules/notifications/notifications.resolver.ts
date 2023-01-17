import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Args,
  Int,
  Query,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Notification, User } from 'src/entities';
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
  @Query(() => Int)
  async getUnreadCount(@CurrentUser() currentUser: User) {
    return this.notificationsService.getUnreadCount(currentUser);
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
    await this.pubSub.publish(NotificationTypes.AnyNotification, {
      notification: newNotification,
    });
    return transactionId;
  }

  @Subscription(() => Notification, {
    filter: (payload) => {
      return payload;
    },
  })
  async transactionCompleted() {
    return this.pubSub.asyncIterator(NotificationTypes.TransactionCompleted);
  }

  @Subscription(() => Notification, {
    filter: (payload, variables, context) => {
      return payload.notification.receivers.some(
        ({ id }) => id === context.extra.user.id,
      );
    },
    resolve: (value) => {
      return value.notification;
    },
  })
  async reminderSent() {
    return this.pubSub.asyncIterator(NotificationTypes.ReminderSent);
  }

  @Subscription(() => Notification, {
    filter: (payload, variables, context) => {
      return payload.notification.receivers.some(
        ({ id }) => id === context.extra.user.id,
      );
    },
    resolve: (value) => {
      return value.notification;
    },
  })
  async notificationSent() {
    return this.pubSub.asyncIterator(NotificationTypes.AnyNotification);
  }
}
