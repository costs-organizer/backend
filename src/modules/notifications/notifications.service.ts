import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { User, Notification, NotificationType } from 'src/entities';
import { PUB_SUB } from 'src/shared';
import { ValidaionException } from 'src/shared/exceptions';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    @Inject(ObjectWithDatesGenerator<Notification>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Notification>,
  ) {}

  async findAll(currentUser: User): Promise<Notification[]> {
    const em = this.dataSource
      .getRepository(Notification)
      .createQueryBuilder('notification');

    return em
      .leftJoinAndSelect('notification.createdBy', 'createdBy')
      .leftJoinAndSelect('notification.receivers', 'receivers')
      .leftJoinAndSelect('notification.group', 'group')
      .andWhere('receivers.id = :userId', { userId: currentUser.id })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async findOne(currentUser: User, notificationId: number) {
    const [notification] = await this.entityValidator.validateNotifications(
      [notificationId],
      currentUser.id,
    );

    return notification;
  }

  async readNotifications(currentUser: User, notificationIds: number[]) {
    const notifications = await this.entityValidator.validateNotifications(
      notificationIds,
      currentUser.id,
    );

    const currentDate = new Date();
    const readNotifications = notifications.map((notification) =>
      plainToClass(Notification, {
        ...notification,
        readBy: [...notification.readBy, currentUser.id],
        updatedAt: currentDate,
      }),
    );

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(readNotifications);
      },
    );

    return notificationIds;
  }

  async sendReminder(currentUser: User, transactionId: number) {
    const em = this.dataSource.getRepository(Notification);
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);
    if (currentUser.id !== transaction.receiverId)
      throw new ValidaionException(
        "You can't leave notification on this transaction",
      );

    const newNotification = this.objectWithDatesGenerator.createNewObject(
      new Notification(),
    );

    newNotification.type = NotificationType.REMINDER;
    newNotification.createdBy = currentUser;
    newNotification.receivers = [transaction.payer];
    newNotification.group = transaction.group;
    newNotification.readBy = [];

    const savedNotification = await em.save(newNotification);
    return savedNotification;
  }

  async getUnreadCount(currentUser: User): Promise<number> {
    const em = this.dataSource
      .getRepository(Notification)
      .createQueryBuilder('notification');

    return await em
      .leftJoinAndSelect('notification.receivers', 'receivers')
      .andWhere('receivers.id = :userId')
      .andWhere('NOT(notification."readBy"::text[] @> ARRAY[:userId])')
      .setParameters({ userId: currentUser.id })
      .getCount();
  }
}
