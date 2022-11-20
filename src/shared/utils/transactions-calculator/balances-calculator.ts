import { User, Cost } from 'src/entities';

class BalancesCalculator {
  public getUsersBalances(
    members: User[],
    costs: Cost[],
  ): Record<number, number> {
    const balances = members.reduce((acc, currMember) => {
      const participatedCosts = costs.filter((cost) =>
        cost.participants.some(
          (participant) => participant.id === currMember.id,
        ),
      );
      const debtsAmount = participatedCosts.reduce(
        (usrDebt, currCost) =>
          usrDebt + currCost.moneyAmount / currCost.participants.length,
        0,
      );

      const createdCosts = costs.filter(
        (cost) => cost.createdBy.id === currMember.id,
      );
      const spendingsAmount = createdCosts.reduce(
        (usrSpending, currCost) => usrSpending + currCost.moneyAmount,
        0,
      );
      return { ...acc, [currMember.id]: spendingsAmount - debtsAmount };
    }, {} as Record<number, number>);

    return balances;
  }
}

export default BalancesCalculator;
