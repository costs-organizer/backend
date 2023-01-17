import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DoneCallback, Job } from 'bull';
import { Cost, Transaction, User } from 'src/entities';
import { QueueType } from 'src/shared/types';
import { TransactionsCalculator } from 'src/shared/utils';
import { DataSource } from 'typeorm';

@Processor(QueueType.TransactionQueue)
export class TransactionConsumer {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(TransactionsCalculator)
    private readonly transactionsCalculator: TransactionsCalculator,
  ) {}

  @Process()
  async readOperationJob(
    job: Job<{
      groupId: number;
    }>,
    done: DoneCallback,
  ) {
    const { groupId } = job.data;
    try {
      const groupCosts = await this.dataSource.manager.find(Cost, {
        relations: {
          participants: true,
          createdBy: true,
        },
        where: {
          groupId,
          deletedAt: null,
        },
      });

      const groupTransactions = await this.dataSource.manager.find(
        Transaction,
        {
          relations: {
            receiver: true,
            payer: true,
          },
          where: {
            groupId,
            deletedAt: null,
          },
        },
      );

      const groupMembers = await this.dataSource.manager.find(User, {
        relations: {
          joinedGroups: true,
        },
        where: {
          joinedGroups: {
            id: groupId,
          },
        },
      });

      const newTransactions = this.transactionsCalculator.calculateTransactions(
        groupMembers,
        groupCosts,
        groupTransactions,
      );
      await this.dataSource.manager.transaction(
        async (transctionEntityManager) => {
          await transctionEntityManager.save(newTransactions);
        },
      );
      done(null);
    } catch (error) {
      done(error);
    }
  }
}
