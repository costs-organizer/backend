import { User } from 'src/entities';
import { FindAllCostsInput } from '../dto';

export class GetCostsQuery {
  constructor(
    public readonly currentUser: User,
    public readonly input: FindAllCostsInput,
  ) {}
}
