import { plainToClass } from 'class-transformer';
import { User, Cost, Transaction } from '../../../../entities';
import {
  BalancesParams,
  TransactionsHandler,
  Vec2TransactionsParams,
} from '../types';
import BalancesCalculator from '../balances-calculator';

import lalolib = require('@swietjak/maths-lib');

class MultipleMembersHandler implements TransactionsHandler {
  private balancesCalculator = new BalancesCalculator();

  private getBalancesParams(members: User[], costs: Cost[]): BalancesParams {
    const userBalances = this.balancesCalculator.getUsersBalances(
      members,
      costs,
    );
    const balancesParams = Object.entries(userBalances).reduce(
      (acc, [userId, balance], userIndex) => {
        return {
          balances: [...acc.balances, balance],
          membersIndexes: {
            ...acc.membersIndexes,
            [userIndex]: Number(userId),
          },
        };
      },
      { balances: [], membersIndexes: {} } as BalancesParams,
    );
    return balancesParams;
  }

  private getConsMat(membersAmount: number) {
    const reducedMembersAmount = membersAmount - 1;
    const block = lalolib.mat(
      [
        lalolib.ones(reducedMembersAmount),
        lalolib.mulScalarMatrix(-1, lalolib.eye(reducedMembersAmount)),
      ],
      true,
    );
    let A = lalolib.mulScalarMatrix(1, block); // so that it copies block

    for (let i = 0; i < reducedMembersAmount; i++) {
      lalolib.swaprows(block, i, i + 1);
      A = lalolib.mat([A, block]);
    }

    return A;
  }

  private vec2Transactions({
    groupId,
    members,
    membersIndexes,
    optimalTransactionsArray,
  }: Vec2TransactionsParams): Transaction[] {
    let columnIndex = 0;
    let rowIndex = 0;
    const currentDate = new Date();

    const transactions = optimalTransactionsArray.reduce(
      (acc, transactionAmount) => {
        if (columnIndex === rowIndex) {
          columnIndex++;
        }
        const convertedTransactionAmount = (transactionAmount * 100) / 100;
        const prevRowIndex = rowIndex;
        const prevColumnIndex = columnIndex;

        columnIndex++;
        if (columnIndex >= members.length) {
          columnIndex = 0;
          rowIndex++;
        }

        if (convertedTransactionAmount === 0) return acc;

        const member1 = members.find(
          ({ id }) => id === membersIndexes[prevColumnIndex],
        );
        const member2 = members.find(
          ({ id }) => id === membersIndexes[prevRowIndex],
        );

        const payer = convertedTransactionAmount > 0 ? member1 : member2;
        const receiver = convertedTransactionAmount > 0 ? member2 : member1;

        const newTransaction: Partial<Transaction> = {
          groupId,
          payer,
          receiver,
          createdAt: currentDate,
          moneyAmount: convertedTransactionAmount,
          isCompleted: false,
        };

        return [...acc, plainToClass(Transaction, newTransaction)];
      },
      [] as Transaction[],
    );

    return transactions;
  }

  private getNewTransactions(members: User[], costs: Cost[]): Transaction[] {
    const [{ groupId }] = costs;
    const constMatrix = this.getConsMat(members.length);
    const { balances, membersIndexes } = this.getBalancesParams(members, costs);
    const maximumTransactionsAmount = members.length * (members.length - 1);
    const coeficients = lalolib.ones(maximumTransactionsAmount);
    const lowerBoundries = lalolib.zeros(maximumTransactionsAmount);
    const optimalTransactionsArray = lalolib.glp(
      coeficients,
      [],
      [],
      constMatrix,
      balances,
      lowerBoundries,
      [],
    );
    return this.vec2Transactions({
      members,
      optimalTransactionsArray,
      membersIndexes,
      groupId,
    });
  }

  public handleTransactions(
    members: User[],
    costs: Cost[],
    transactions: Transaction[],
  ) {
    const newTransactions = this.getNewTransactions(members, costs);

    const { filteredNewTransactions, modifiedOldTransactions } =
      newTransactions.reduce(
        (acc, curr) => {
          const usersIds = [curr.payer.id, curr.receiver.id];
          const oldTransaction = acc.modifiedOldTransactions.find(
            ({ receiver, payer }) =>
              usersIds.includes(receiver.id) && usersIds.includes(payer.id),
          );
          if (!oldTransaction) return acc;

          const modifiedOldTransaction: Partial<Transaction> = {
            ...oldTransaction,
            payer: curr.payer,
            payerId: curr.payer.id,
            receiver: curr.receiver,
            receiverId: curr.receiver.id,
            moneyAmount: curr.moneyAmount,
            updatedAt: new Date(),
            isCompleted: false,
          };

          return {
            filteredNewTransactions: acc.filteredNewTransactions.filter(
              ({ receiver, payer }) =>
                usersIds.includes(receiver.id) && usersIds.includes(payer.id),
            ),
            modifiedOldTransactions: [
              ...acc.modifiedOldTransactions.filter(
                ({ id }) => id !== oldTransaction.id,
              ),
              plainToClass(Transaction, modifiedOldTransaction),
            ],
          };
        },
        {
          filteredNewTransactions: newTransactions,
          modifiedOldTransactions: transactions,
        },
      );
    return [...filteredNewTransactions, ...modifiedOldTransactions];
  }
}

export default MultipleMembersHandler;
