import { User } from 'src/entities';

export class GetCostQuery {
  constructor(
    public readonly currentUser: User,
    public readonly costId: number,
  ) {}
}
