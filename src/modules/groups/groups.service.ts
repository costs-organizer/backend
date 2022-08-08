import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidaionException } from 'src/shared/exceptions';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { Group, User } from '../../entities';
import { FindAllGroupsInput, RemoveUserFromGroupInput } from './dto';
import { AddNewUsersInput } from './dto/add-new-users.input';

@Injectable()
export class GroupsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Group>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Group>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
  ) {}

  async findAll(currentUser: User, body: FindAllGroupsInput) {
    const { search } = body;
    const em = this.dataSource.getRepository(Group).createQueryBuilder('group');

    return await em
      .leftJoinAndSelect('group.members', 'members')
      .leftJoinAndSelect('group.createdBy', 'createdBy')
      .andWhere('group.deletedAt IS NULL')
      .andWhere('group.name LIKE  :name', { name: `%${search}%` })
      .andWhere('members.id = :userId', { userId: currentUser.id })
      .getMany();
  }

  async createGroup(groupName: string, createdBy: User, membersIds?: number[]) {
    const group = this.objectWithDatesGenerator.createNewObject(new Group());

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        group.name = groupName;
        group.createdBy = createdBy;

        const members = await this.entityValidator.validateUsers(membersIds);
        group.members = members;

        await transctionEntityManager.save(group);
      },
    );

    return group.id;
  }

  async addNewUsers(currentUser: User, addNewUsersInput: AddNewUsersInput) {
    const { groupId, userIds } = addNewUsersInput;
    const [group] = await this.entityValidator.validateGroups([groupId]);

    if (group?.createdBy.id !== currentUser.id)
      throw new ValidaionException("You can't perform this action");

    if (group.members.some(({ id }) => userIds.includes(id)))
      throw new ValidaionException(
        "You can't add already added users to group",
      );

    const newMembers = await this.entityValidator.validateUsers(userIds);

    group.members = [...group.members, ...newMembers];

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(group);
      },
    );

    return userIds;
  }

  async removeUserFromGroup(
    removeUserFromGroupInput: RemoveUserFromGroupInput,
    currentUser: User,
  ) {
    const { groupId, userId } = removeUserFromGroupInput;

    const [group] = await this.entityValidator.validateGroups([groupId]);

    if (group?.createdBy.id !== currentUser.id)
      throw new ValidaionException("You can't perform this action");

    if (!group.members.some(({ id }) => id === userId))
      throw new ValidaionException("Such user doesn't belong to this group");

    await this.entityValidator.validateUsers([userId]);

    group.members = group.members.filter(({ id }) => id !== userId);

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(group);
      },
    );

    return userId;
  }

  async findOne(currentUser: User, groupId: number) {
    const em = this.dataSource.getRepository(Group).createQueryBuilder('group');
    return await em
      .leftJoinAndSelect('group.members', 'members')
      .andWhere('group.id = :groupId', { groupId })
      .andWhere('members.id = :userId', { userId: currentUser.id })
      .getOneOrFail();
  }
}
