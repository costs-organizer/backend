import { User } from 'src/entities';

export class RemoveCostCommand {
  constructor(
    public readonly currentUser: User,
    public readonly costId: number,
  ) {}
}
