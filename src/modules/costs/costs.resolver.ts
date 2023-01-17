import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Cost, User } from '../../entities';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/shared/decorators';
import { FindAllCostsInput, CreateCostInput, EditCostInput } from './dto';
import { CostsService } from './costs.service';

@Resolver(() => Cost)
export class CostsResolver {
  constructor(
    @Inject(CostsService) private readonly costsService: CostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Cost, { name: 'cost' })
  async findOne(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Cost> {
    return await this.costsService.findOne(currentUser, id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Cost], { name: 'costs' })
  async findAll(
    @CurrentUser() currentUser: User,
    @Args('findAllInput') findAllInput: FindAllCostsInput,
  ): Promise<Cost[]> {
    return await this.costsService.findAll(currentUser, findAllInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async createCost(
    @CurrentUser() currentUser: User,
    @Args('createCostInput') createCostInput: CreateCostInput,
  ): Promise<number> {
    return await this.costsService.createCost(currentUser, createCostInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async joinCost(
    @CurrentUser() currentUser: User,
    @Args('costId', { type: () => Int }) costId: number,
  ): Promise<number> {
    return await this.costsService.joinCost(currentUser, costId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async removeCost(
    @CurrentUser() currentUser: User,
    @Args('costId', { type: () => Int }) costId: number,
  ): Promise<number> {
    return await this.costsService.removeCost(currentUser, costId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async editCost(
    @CurrentUser() currentUser: User,
    @Args('editCostInput', { type: () => EditCostInput })
    costInput: EditCostInput,
  ): Promise<number> {
    return await this.costsService.editCost(currentUser, costInput);
  }
}
