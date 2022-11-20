import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Cost, Transaction, User } from 'src/entities';
import { QueueType } from 'src/shared/types';
import {
  ObjectWithDatesGenerator,
  TransactionsCalculator,
} from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { AddCostCommand } from './add-cost.command';

@CommandHandler(AddCostCommand)
export class AddCostHandler implements ICommandHandler<AddCostCommand> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Cost>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Cost>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    @Inject(TransactionsCalculator)
    private readonly transactionsCalculator: TransactionsCalculator,
    @InjectQueue(QueueType.TransactionQueue) private transactionsQueue: Queue,
  ) {}

  async execute({ body, currentUser }: AddCostCommand) {
    const { groupId, description, moneyAmount, name, participantsIds } = body;

    const [group] = await this.entityValidator.validateGroups(
      [groupId],
      currentUser.id,
    );

    const participants = await this.entityValidator.validateUsers(
      participantsIds,
    );

    const newCost = this.objectWithDatesGenerator.createNewObject(new Cost());
    newCost.createdBy = currentUser;

    newCost.name = name;
    newCost.description = description;
    newCost.moneyAmount = moneyAmount;
    newCost.participants = participants;
    newCost.group = group;

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(newCost);
      },
    );

    const job = await this.transactionsQueue.add({
      groupId,
    });
    return job.id;
  }
}
