import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Cost } from 'src/entities';
import { ValidaionException } from 'src/shared/exceptions';
import { QueueType } from 'src/shared/types';
import {
  ObjectWithDatesGenerator,
  TransactionsCalculator,
} from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { RemoveCostCommand } from './remove-cost.command';

@CommandHandler(RemoveCostCommand)
export class RemoveCostHandler implements ICommandHandler<RemoveCostCommand> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Cost>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Cost>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    @Inject(TransactionsCalculator)
    @InjectQueue(QueueType.TransactionQueue)
    private transactionsQueue: Queue,
  ) {}

  async execute({ costId, currentUser }: RemoveCostCommand): Promise<number> {
    const [cost] = await this.entityValidator.validateCosts(
      [costId],
      currentUser.id,
    );

    if (cost.createdBy.id !== currentUser.id)
      throw new ValidaionException('No rights to delete this cost');

    cost.deletedAt = new Date();

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(cost);
      },
    );

    const job = await this.transactionsQueue.add({
      groupId: cost.groupId,
    });

    return Promise.resolve(Number(job.id));
  }
}
