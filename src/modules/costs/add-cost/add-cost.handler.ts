import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cost, Group, Transaction, User } from 'src/entities';
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

    const groupTransactions = await this.dataSource.manager.find(Transaction, {
      relations: {
        receiver: true,
        payer: true,
      },
      where: {
        groupId,
        deletedAt: null,
      },
    });

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
    return newCost.id;
  }
}
