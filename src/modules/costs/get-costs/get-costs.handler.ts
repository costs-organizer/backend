import { Inject } from '@nestjs/common';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cost } from 'src/entities';
import { ValidaionException } from 'src/shared/exceptions';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { GetCostsQuery } from './get-costs.query';

@QueryHandler(GetCostsQuery)
export class GetCostsHandler implements ICommandHandler<GetCostsQuery> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
  ) {}

  async execute({
    currentUser,
    input: { groupId, filterByName },
  }: GetCostsQuery): Promise<any> {
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
      .innerJoinAndSelect('cost.participants', 'costParticipants')
      .innerJoinAndSelect('cost.createdBy', 'createdBy')
      .andWhere('group.id = :groupId', { groupId })
      .if(filterByName, (qb) =>
        qb.andWhere(
          '(createdBy.id = :currentUserId OR costParticipants.id = :currentUserId)',
          { currentUserId: currentUser.id },
        ),
      )
      .innerJoinAndSelect('cost.participants', 'participants')
      .orderBy('cost.name')
      .getMany();
  }
}
