import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { AuthHelper } from '../auth';
import { FindAllUsersInput } from './find-all.input';
import { EditMeInput } from './input';

@Injectable()
export class UsersService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

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

  private async validateNewPassword(
    oldPasswordHash: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const isOldPasswordValid: boolean = await this.helper.isPasswordValid(
      oldPassword,
      oldPasswordHash,
    );

    if (isOldPasswordValid) {
      throw new HttpException('Bad old password', HttpStatus.BAD_REQUEST);
    }
    const { hash: newPasswordHash, salt: newPasswordSalt } =
      await this.helper.encodePassword(newPassword);

    return {
      newPasswordSalt,
      newPasswordHash,
    };
  }

  async editMe(currentUser: User, editMeInput: EditMeInput) {
    const { id, email, newPassword, oldPassword, username, IBAN, phone } =
      editMeInput;

    if (currentUser.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const em = this.usersRepository.createQueryBuilder('user');
    const oldUserData: User = await em
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.id = :id', { id })
      .getOneOrFail();

    oldUserData.email = email;

    oldUserData.username = username;

    oldUserData.IBAN = IBAN;
    oldUserData.phone = phone;

    if (!!newPassword) {
      const { newPasswordHash, newPasswordSalt } =
        await this.validateNewPassword(
          oldUserData.passwordHash,
          oldPassword,
          newPassword,
        );

      oldUserData.passwordHash = newPasswordSalt;
      oldUserData.passwordSalt = newPasswordHash;
    }

    oldUserData.updatedAt = new Date();

    await this.usersRepository.manager.transaction(
      async (userEntityManager) => {
        await userEntityManager.save(oldUserData);
      },
    );
  }
}
