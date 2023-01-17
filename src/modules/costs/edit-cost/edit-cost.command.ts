import { User } from 'src/entities';
import { EditCostInput } from '../dto/edit-cost.input';

export class EditCostCommand {
  constructor(
    public readonly currentUser: User,
    public readonly input: EditCostInput,
  ) {}
}
