import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Cost } from 'src/entities';
import { QueueType } from 'src/shared/types';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { JoinCostCommand } from './join-cost.command';

@CommandHandler(JoinCostCommand)
export class JoinCostHandler implements ICommandHandler<JoinCostCommand> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Cost>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Cost>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    @InjectQueue(QueueType.TransactionQueue)
    private transactionsQueue: Queue,
  ) {}

  async execute({ costId, currentUser }: JoinCostCommand): Promise<any> {
    const [cost] = await this.entityValidator.validateCosts(
      [costId],
      currentUser.id,
    );

    cost.updatedAt = new Date();
    cost.participants = [...cost.participants, currentUser];

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
