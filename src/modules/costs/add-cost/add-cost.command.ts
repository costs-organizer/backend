import { User } from 'src/entities';
import { CreateCostInput } from '../dto';

export class AddCostCommand {
  constructor(
    public readonly currentUser: User,
    public readonly body: CreateCostInput,
  ) {}
}
