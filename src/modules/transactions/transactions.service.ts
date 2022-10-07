import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidaionException } from 'src/shared/exceptions';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { Transaction, User } from '../../entities';
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

    const isCurrentUserInvolvedInTransaction =
      transaction.receiver.id === currentUser.id
        ? true
        : transaction.payer.id === currentUser.id;

    if (!isCurrentUserInvolvedInTransaction)
      throw new ValidaionException('User is not involved in the transaction');

    transaction.updatedAt = new Date();
    transaction.isCompleted = true;

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(transaction);
      },
    );

    return transaction.id;
  }
}
