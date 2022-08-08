import { Injectable } from '@nestjs/common';
import { Group, User } from 'src/entities';
import { DataSource } from 'typeorm';
import { ValidaionException } from '../exceptions';

@Injectable()
export class EntityValidator {
  constructor(private readonly dataSource: DataSource) {}

  public validateUsers = async (userIds?: number[]) => {
    const em = this.dataSource.getRepository(User).createQueryBuilder('user');

    const foundUsers = await em
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();

    if (foundUsers.length !== userIds.length) {
      throw new ValidaionException('One or more users not found');
    }

    return foundUsers;
  };

  public validateGroups = async (groupIds: number[]) => {
    const em = this.dataSource.getRepository(Group).createQueryBuilder('group');

    const foundGroups = await em
      .where('group.id IN (:...groupIds)', { groupIds })
      .leftJoinAndSelect('group.createdBy', 'createdBy')
      .leftJoinAndSelect('group.members', 'members')
      .getMany();

    if (foundGroups.length !== groupIds.length) {
      throw new ValidaionException('One or more groups not found');
    }

    return foundGroups;
  };
}
