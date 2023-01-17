import { User } from 'src/entities';
import {} from '../dto';

export class JoinCostCommand {
  constructor(
    public readonly currentUser: User,
    public readonly costId: number,
  ) {}
}
