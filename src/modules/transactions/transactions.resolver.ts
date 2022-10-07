import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Transaction, User } from '../../entities';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/shared/decorators';
import { TransactionsService } from './transactions.service';
import { FindAllTransactionsInput } from './dto';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(
    @Inject(TransactionsService)
    private readonly transactionsService: TransactionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Transaction], { name: 'transactions' })
  async findAll(
    @CurrentUser() currentUser: User,
    @Args('findAllInput') findAllInput: FindAllTransactionsInput,
  ): Promise<Transaction[]> {
    return await this.transactionsService.findAll(currentUser, findAllInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Transaction, { name: 'transaction' })
  async findOne(
    @CurrentUser() currentUser: User,
    @Args('transactionId', { type: () => Int }) transactionId: number,
  ): Promise<Transaction> {
    return await this.transactionsService.findOne(currentUser, transactionId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async completeTransaction(
    @CurrentUser() currentUser: User,
    @Args('transactionId', { type: () => Int }) transactionId: number,
  ): Promise<number> {
    return await this.transactionsService.completeTransaction(
      currentUser,
      transactionId,
    );
  }
}
