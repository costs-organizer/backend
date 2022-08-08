import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { FindAllInput } from './find-all.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async findAll(body: FindAllInput) {
    const { groupId, search } = body;
    const em = this.usersRepository.createQueryBuilder('user');
    return await em
      .leftJoinAndSelect('user.joinedGroups', 'joinedGroups')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.username LIKE  :name', { name: `%${search}%` })
      .if(!!body.groupId, (qb) =>
        qb.andWhere('joinedGroups.id = :groupId', { groupId: groupId }),
      )
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
