import { Injectable } from '@nestjs/common';
import { Cost, Transaction, User } from 'src/entities';
import DoubleMemberHandler from './handlers/double-members.handler';
import MultipleMembersHandler from './handlers/multiple-members.handler';
import SingleMemberHandler from './handlers/single-member.handler';
import { TransactionsHandler } from './types';

@Injectable()
export class TransactionsCalculator {
  private getDebtsHandler(members: User[]): TransactionsHandler {
    if (members.length === 1) return new SingleMemberHandler();
    if (members.length === 2) return new DoubleMemberHandler();
    return new MultipleMembersHandler();
  }

  public calculateTransactions(
    members: User[],
    costs: Cost[],
    transactions: Transaction[],
  ): Transaction[] {
    const debtsHandler = this.getDebtsHandler(members);
    return debtsHandler.handleTransactions(members, costs, transactions);
  }
}
