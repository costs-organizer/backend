import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { FindAllUsersInput } from './find-all.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async findAll(body: FindAllUsersInput) {
    const { groupId, search } = body;
    const em = this.usersRepository.createQueryBuilder('user');
    return await em
      .leftJoinAndSelect('user.joinedGroups', 'joinedGroups')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.username LIKE  :name', { name: `%${search}%` })
      .if(!!body.groupId, (qb) =>
        qb.andWhere('joinedGroups.id = :groupId', { groupId }),
      )
      .orderBy('user.username')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
