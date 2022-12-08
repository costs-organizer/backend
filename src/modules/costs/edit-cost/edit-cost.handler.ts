import { InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { ValidaionException } from 'src/shared/exceptions';
import { QueueType } from 'src/shared/types';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { EditCostCommand } from './edit-cost.command';

@CommandHandler(EditCostCommand)
export class EditCostHandler implements ICommandHandler<EditCostCommand> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    @InjectQueue(QueueType.TransactionQueue)
    private transactionsQueue: Queue,
  ) {}

  async execute({ input, currentUser }: EditCostCommand): Promise<any> {
    const [costToEdit] = await this.entityValidator.validateCosts(
      [input.costId],
      currentUser.id,
    );

    if (costToEdit.createdBy.id !== currentUser.id)
      throw new ValidaionException('No rights to delete this cost');

    const participants = await this.entityValidator.validateUsers(
      input.participantsIds,
    );

    costToEdit.participants = participants;
    costToEdit.name = input.name;
    costToEdit.description = input.description;
    costToEdit.moneyAmount = input.moneyAmount;
    costToEdit.updatedAt = new Date();

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(costToEdit);
      },
    );

    const job = await this.transactionsQueue.add({
      groupId: costToEdit.groupId,
    });

    return Promise.resolve(Number(job.id));
  }
}
