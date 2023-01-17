import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../entities';
import { AddCostCommand } from './add-cost';
import { CreateCostInput, EditCostInput, FindAllCostsInput } from './dto';
import { EditCostCommand } from './edit-cost';
import { GetCostQuery } from './get-cost';
import { GetCostsQuery } from './get-costs';
import { JoinCostCommand } from './join-cost';
import { RemoveCostCommand } from './remove-cost';

@Injectable()
export class CostsService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async findAll(currentUser: User, body: FindAllCostsInput) {
    return await this.queryBus.execute(new GetCostsQuery(currentUser, body));
  }

  async findOne(currentUser: User, id: number) {
    return await this.queryBus.execute(new GetCostQuery(currentUser, id));
  }

  async createCost(currentUser: User, body: CreateCostInput) {
    return this.commandBus.execute(new AddCostCommand(currentUser, body));
  }

  async joinCost(currentUser: User, costId: number) {
    return this.commandBus.execute(new JoinCostCommand(currentUser, costId));
  }

  async removeCost(currentUser: User, costId: number) {
    return this.commandBus.execute(new RemoveCostCommand(currentUser, costId));
  }

  async editCost(currentUser: User, costInput: EditCostInput) {
    return this.commandBus.execute(new EditCostCommand(currentUser, costInput));
  }
}
