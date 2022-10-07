import { Injectable } from '@nestjs/common';
import { Cost, Group, Transaction, User } from 'src/entities';
import { DataSource } from 'typeorm';
import { ValidaionException } from '../exceptions';

@Injectable()
export class EntityValidator {
  constructor(private readonly dataSource: DataSource) {}

  public async validateUsers(userIds?: number[]) {
    const em = this.dataSource.getRepository(User).createQueryBuilder('user');

    const foundUsers = await em
      .andWhere('user.id IN (:...userIds)', { userIds })
      .getMany();

    if (foundUsers.length !== userIds.length) {
      throw new ValidaionException('One or more users not found');
    }

    return foundUsers;
  }

  public async validateGroups(groupIds: number[], currentUserId: number) {
    const em = this.dataSource.getRepository(Group).createQueryBuilder('group');

    const foundGroups = await em
      .leftJoinAndSelect('group.createdBy', 'createdBy')
      .leftJoinAndSelect('group.members', 'members')
      .andWhere('group.id IN (:...groupIds)', { groupIds: groupIds })
      .getMany();

    if (foundGroups.length !== groupIds.length) {
      throw new ValidaionException('One or more groups not found');
    }

    if (
      !foundGroups.every((group) =>
        group.members.some(({ id }) => id === currentUserId),
      )
    ) {
      throw new ValidaionException('You have no access to one or more groups');
    }

    return foundGroups;
  }

  public async validateCosts(costIds: number[], currentUserId: number) {
    const em = this.dataSource.getRepository(Cost).createQueryBuilder('cost');

    const foundCosts = await em
      .leftJoinAndSelect('cost.group', 'group')
      .leftJoinAndSelect('group.members', 'groupMembers')
      .leftJoinAndSelect('cost.participants', 'participants')
      .leftJoinAndSelect('cost.createdBy', 'createdBy')
      .andWhere('cost.id IN (:...costIds)', { costIds })
      .getMany();

    if (foundCosts.length !== costIds.length) {
      throw new ValidaionException('One or more groups not found');
    }

    if (
      !foundCosts.every((cost) =>
        cost.group.members.some(({ id }) => id === currentUserId),
      )
    ) {
      throw new ValidaionException('You have no access to one or more groups');
    }

    return foundCosts;
  }

  public async validateTransactions(transactionIds: number[]) {
    const em = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction');

    const foundTransactions = await em
      .leftJoinAndSelect('transaction.receiver', 'receiver')
      .leftJoinAndSelect('transaction.payer', 'payer')
      .andWhere('transaction.id IN (:...transactionIds)', { transactionIds })
      .getMany();

    if (foundTransactions.length !== transactionIds.length) {
      throw new ValidaionException('One or more transactions not found');
    }
    return foundTransactions;
  }
}
