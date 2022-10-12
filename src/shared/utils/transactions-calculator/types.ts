import { User, Cost, Transaction } from 'src/entities';

export type HandleTransactionsType = (
  members: User[],
  costs: Cost[],
  transactions: Transaction[],
) => Transaction[];

export interface TransactionsHandler {
  handleTransactions: HandleTransactionsType;
}

export interface BalancesParams {
  membersIndexes: Record<number, number>;
  balances: number[];
}

export interface Vec2TransactionsParams {
  members: User[];
  optimalTransactionsArray: number[];
  membersIndexes: Record<number, number>;
  groupId: number;
}
