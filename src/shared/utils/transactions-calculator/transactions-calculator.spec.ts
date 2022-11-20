import {
  cost1,
  cost2,
  user1,
  user2,
  finalTransaction1,
  user3,
  cost3,
  cost4,
  finalTransaction2,
  finalTransaction3,
} from '../../mocks/transactions';
import { User } from '../../../entities';
import { TransactionsCalculator } from './transactions-calculator';

describe('TransactionsCalculator', () => {
  const tc = new TransactionsCalculator();
  describe('single member', () => {
    it('should return empty array', () => {
      const transactions = tc.calculateTransactions([new User()], [], []);

      expect(transactions).toStrictEqual([]);
    });
  });

  describe('two members', () => {
    const transactions = tc.calculateTransactions(
      [user1, user2],
      [cost1, cost2],
      [],
    );
    it('there should be only one cost', () => {
      expect(transactions.length).toEqual(1);
    });
    it('user2 should be payer', () => {
      const [transaction] = transactions;
      expect(transaction.payer.id).toEqual(finalTransaction1.payer.id);
    });
    it('user1 should be receiver', () => {
      const [transaction] = transactions;
      expect(transaction.receiver.id).toEqual(finalTransaction1.receiver.id);
    });
    it('moneyAmount should be correct', () => {
      const [transaction] = transactions;
      expect(transaction.moneyAmount).toEqual(finalTransaction1.moneyAmount);
    });
  });

  describe('more than two members with no previous transactions', () => {
    const transactions = tc.calculateTransactions(
      [user1, user2, user3],
      [cost1, cost2, cost3, cost4],
      [],
    );
    it('there should be only two costs', () => {
      expect(transactions.length).toEqual(2);
    });
    it('user2 should be receiver of both transactions', () => {
      const [transaction1, transaction2] = transactions;
      expect([
        transaction1.receiver.id,
        transaction2.receiver.id,
      ]).toStrictEqual([
        finalTransaction2.receiver.id,
        finalTransaction3.receiver.id,
      ]);
    });
    it('user1 should pay 20 to user2', () => {
      const transaction = transactions.find(
        (t) =>
          t.moneyAmount === finalTransaction2.moneyAmount &&
          t.payer.id === finalTransaction2.payer.id &&
          t.receiver.id === finalTransaction2.receiver.id,
      );
      expect(transaction).toBeDefined();
    });
    it('user3 should pay 25 to user2', () => {
      const transaction = transactions.find(
        (t) =>
          t.moneyAmount === finalTransaction3.moneyAmount &&
          t.payer.id === finalTransaction3.payer.id &&
          t.receiver.id === finalTransaction3.receiver.id,
      );
      expect(transaction).toBeDefined();
    });
  });
  describe('more than two members with previous transactions', () => {
    const transactions = tc.calculateTransactions(
      [user1, user2, user3],
      [cost1, cost2, cost3, cost4],
      [finalTransaction1, finalTransaction3],
    );
    console.log(transactions);
    it('there should be only two transactions', () => {
      expect(transactions.length).toEqual(2);
    });
    it('user2 should be receiver of both transactions', () => {
      const [transaction1, transaction2] = transactions;
      expect([
        transaction1.receiver.id,
        transaction2.receiver.id,
      ]).toStrictEqual([
        finalTransaction2.receiver.id,
        finalTransaction3.receiver.id,
      ]);
    });
    it('user1 should pay 20 to user2', () => {
      const transaction = transactions.find(
        (t) =>
          t.moneyAmount === finalTransaction2.moneyAmount &&
          t.payer.id === finalTransaction2.payer.id &&
          t.receiver.id === finalTransaction2.receiver.id,
      );
      expect(transaction).toBeDefined();
    });
    it('user3 should pay 25 to user2', () => {
      const transaction = transactions.find(
        (t) =>
          t.moneyAmount === finalTransaction3.moneyAmount &&
          t.payer.id === finalTransaction3.payer.id &&
          t.receiver.id === finalTransaction3.receiver.id,
      );
      expect(transaction).toBeDefined();
    });
  });
});
