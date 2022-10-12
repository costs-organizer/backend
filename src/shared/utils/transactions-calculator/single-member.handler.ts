import { Cost, Transaction, User } from 'src/entities';
import { ValidaionException } from 'src/shared/exceptions';
import { TransactionsHandler } from './types';

class SingleMemberHandler implements TransactionsHandler {
  public handleTransactions(
    members: User[],
    costs: Cost[],
    transactions: Transaction[],
  ) {
    if (!!transactions.length)
      throw new ValidaionException(
        'Wow, how did you create so many transactions?????',
      );
    return [];
  }
}

export default SingleMemberHandler;
