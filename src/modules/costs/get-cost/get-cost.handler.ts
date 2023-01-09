import { Inject } from '@nestjs/common';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityValidator } from 'src/shared/validators';
import { GetCostQuery } from './get-cost.query';

@QueryHandler(GetCostQuery)
export class GetCostHandler implements ICommandHandler<GetCostQuery> {
  constructor(
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
  ) {}

  async execute({ costId, currentUser }: GetCostQuery): Promise<any> {
    const [cost] = await this.entityValidator.validateCosts(
      [costId],
      currentUser.id,
    );

    return cost;
  }
}
