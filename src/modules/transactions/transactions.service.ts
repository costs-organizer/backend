import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { ValidaionException } from 'src/shared/exceptions';
import { QueueType } from 'src/shared/types';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import {
  Notification,
  NotificationType,
  Transaction,
  User,
} from '../../entities';
import { FindAllTransactionsInput } from './dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Transaction>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Transaction>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
  ) {}

  private validateUserParticipationInTransaction(
    currentUser: User,
    transaction: Transaction,
  ) {
    const isCurrentUserInvolvedInTransaction =
      transaction.receiver.id === currentUser.id ||
      transaction.payer.id === currentUser.id;

    if (!isCurrentUserInvolvedInTransaction)
      throw new ValidaionException('User is not involved in the transaction');
  }

  async findAll(currentUser: User, body: FindAllTransactionsInput) {
    const { groupId, filterByUser } = body;
    const em = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction');

    const [group] = await this.entityValidator.validateGroups(
      [groupId],
      currentUser.id,
    );

    return em
      .leftJoinAndSelect('transaction.receiver', 'receiver')
      .leftJoinAndSelect('transaction.payer', 'payer')
      .andWhere('transaction.groupId = :groupId', { groupId: group.id })
      .if(filterByUser, (qb) =>
        qb.andWhere(
          'payer.id = :currentUserId OR receiver.id = :currentUserId',
          { currentUserId: currentUser.id },
        ),
      )
      .getMany();
  }

  async findOne(currentUser: User, transactionId: number) {
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);

    return transaction;
  }

  async completeTransaction(currentUser: User, transactionId: number) {
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);

    if (transaction.isCompleted)
      throw new ValidaionException('Transaction already completed');

    this.validateUserParticipationInTransaction(currentUser, transaction);

    transaction.updatedAt = new Date();
    transaction.isCompleted = true;

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(transaction);
      },
    );

    return transaction;
  }

  async generateCompleteTransactionNotification(transaction: Transaction) {
    const em = this.dataSource.getRepository(Notification);

    const newNotification: Partial<Notification> = {
      createdAt: new Date(),
      readBy: [],
      receivers: [transaction.receiver],
      createdBy: transaction.payer,
      group: transaction.group,
      type: NotificationType.TRANSACTION_RECEIVED,
    };

    const savedNotification = await em.save(newNotification);

    return savedNotification;
  }
}
