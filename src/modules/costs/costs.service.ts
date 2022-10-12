import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidaionException } from 'src/shared/exceptions';
import { ObjectWithDatesGenerator } from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { Cost, User } from '../../entities';
import { AddCostCommand } from './add-cost';
import { CreateCostInput, FindAllCostsInput } from './dto';

@Injectable()
export class CostsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Cost>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Cost>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
    private commandBus: CommandBus,
  ) {}

  async findAll(currentUser: User, body: FindAllCostsInput) {
    const { groupId } = body;
    const em = this.dataSource.getRepository(Cost).createQueryBuilder('cost');

    const [group] = await this.entityValidator.validateGroups(
      [groupId],
      currentUser.id,
    );

    if (!group.members.some((member) => member.id === currentUser.id))
      throw new ValidaionException(
        'Cannot view cost unless you are member of the group',
      );

    return await em
      .innerJoinAndSelect('cost.group', 'group')
      .innerJoinAndSelect('cost.participants', 'participants')
      .innerJoinAndSelect('cost.createdBy', 'createdBy')
      .andWhere('group.id = :groupId', { groupId })
      .getMany();
  }

  async findOne(currentUser: User, id: number) {
    const [cost] = await this.entityValidator.validateCosts(
      [id],
      currentUser.id,
    );

    return cost;
  }

  async createCost(currentUser: User, body: CreateCostInput) {
    return this.commandBus.execute(new AddCostCommand(currentUser, body));
  }

  async joinCost(currentUser: User, costId: number) {
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

    return cost.id;
  }

  async removeCost(currentUser: User, costId: number) {
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

    return cost.id;
  }
}
