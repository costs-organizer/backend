import { plainToClass } from 'class-transformer';
import { Cost, Group, Transaction, User } from '../../entities';

export const group: Group = plainToClass(Group, {
  id: 1,
  name: 'test',
});

export const user1: User = plainToClass(User, {
  createdAt: new Date(),
  deletedAt: null,
  id: 1,
  username: 'test1',
});

export const user2: User = plainToClass(User, {
  createdAt: new Date(),
  deletedAt: null,
  id: 2,
  username: 'test2',
});

export const user3: User = plainToClass(User, {
  createdAt: new Date(),
  deletedAt: null,
  id: 3,
  username: 'test3',
});

export const cost1: Cost = plainToClass(Cost, {
  createdAt: new Date(),
  deletedAt: null,
  id: 1,
  groupId: group.id,
  moneyAmount: 20,
  createdBy: user2,
  participants: [user2, user1],
});

export const cost2: Cost = plainToClass(Cost, {
  createdAt: new Date(),
  deletedAt: null,
  id: 2,
  groupId: group.id,
  moneyAmount: 30,
  createdBy: user1,
  participants: [user2, user1],
});

export const cost3: Cost = plainToClass(Cost, {
  createdAt: new Date(),
  deletedAt: null,
  id: 1,
  groupId: group.id,
  moneyAmount: 30,
  createdBy: user2,
  participants: [user2, user1, user3],
});

export const cost4: Cost = plainToClass(Cost, {
  createdAt: new Date(),
  deletedAt: null,
  id: 2,
  groupId: group.id,
  moneyAmount: 30,
  createdBy: user2,
  participants: [user1, user3],
});

export const finalTransaction1: Transaction = plainToClass(Transaction, {
  createdAt: new Date(),
  deletedAt: null,
  id: 1,
  groupId: group.id,
  isCompleted: false,
  payer: user2,
  receiver: user1,
  moneyAmount: 5,
  payerId: user2.id,
  receiverId: user1.id,
} as Partial<Transaction>);

export const finalTransaction2: Transaction = plainToClass(Transaction, {
  createdAt: new Date(),
  deletedAt: null,
  id: 2,
  groupId: group.id,
  isCompleted: false,
  payer: user1,
  receiver: user2,
  moneyAmount: 20,
  payerId: user1.id,
  receiverId: user2.id,
} as Partial<Transaction>);

export const finalTransaction3: Transaction = plainToClass(Transaction, {
  createdAt: new Date(),
  deletedAt: null,
  id: 3,
  groupId: group.id,
  isCompleted: false,
  payer: user3,
  receiver: user2,
  moneyAmount: 25,
  payerId: user3.id,
  receiverId: user2.id,
} as Partial<Transaction>);
