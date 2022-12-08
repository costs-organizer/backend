import { plainToClass } from 'class-transformer';
import { Cost, Transaction, User } from '../../../../entities';
import { ValidaionException } from '../../../exceptions';
import { EntityRemover } from '../../entity-remover';
import BalancesCalculator from '../balances-calculator';
import { TransactionsHandler } from '../types';

class DoubleMemberHandler implements TransactionsHandler {
  private entityRemover = new EntityRemover();
  private balancesCalculator = new BalancesCalculator();

  private normalizeMoneyAmount(moneyAmount: number) {
    return Math.round(moneyAmount * 100) / 100;
  }

  public handleTransactions(
    members: User[],
    costs: Cost[],
    transactions: Transaction[],
  ) {
    if (transactions.length > 1)
      throw new ValidaionException(
        'Wow, how did you create so many transactions?????',
      );
    const [sampleCost] = costs;
    const [currentTransaction] = transactions;
    const balances = this.balancesCalculator.getUsersBalances(members, costs);
    const [member1, member2] = members;
    //TODO: ADD MANTISA CONVERSION
    const member1Balance = this.normalizeMoneyAmount(balances[member1.id]);
    const member2Balance = this.normalizeMoneyAmount(balances[member2.id]);

    if (member1Balance === member2Balance) {
      return currentTransaction
        ? this.entityRemover.removeEntities([currentTransaction])
        : [];
    }

    const member1HasMore = member1Balance > member2Balance;
    const payer = member1HasMore ? member2 : member1;
    const receiver = member1HasMore ? member1 : member2;
    const moneyAmount = member1HasMore ? member1Balance : member2Balance;

    if (currentTransaction)
      return [
        plainToClass(Transaction, {
          ...currentTransaction,
          payer,
          receiver,
          moneyAmount,
          updatedAt: new Date(),
          isCompleted: false,
        }),
      ];

    const newTransaction: Partial<Transaction> = {
      moneyAmount,
      payer,
      receiver,
      createdAt: new Date(),
      groupId: sampleCost.groupId,
      group: sampleCost.group,
      isCompleted: false,
      deletedAt: null,
      updatedAt: null,
      payerId: payer.id,
      receiverId: receiver.id,
    };

    return [plainToClass(Transaction, newTransaction)];
  }
}

export default DoubleMemberHandler;
