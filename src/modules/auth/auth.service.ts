import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import { LoginInput, RegisterInput } from './dto';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterInput): Promise<User | never> {
    const { name, email, password, IBAN, phone }: RegisterInput = body;
    const user: User = await this.repository.findOne({
      where: [{ email }, { username: name }],
    });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    const newUser: User = new User();
    const { hash, salt } = await this.helper.encodePassword(password);
    newUser.username = name;
    newUser.email = email;
    newUser.passwordHash = hash;
    newUser.passwordSalt = salt;
    newUser.IBAN = IBAN;
    newUser.phone = phone;

    return this.repository.save(newUser);
  }

  public async login(body: LoginInput): Promise<string | never> {
    const { name, password } = body;
    const em = this.repository.createQueryBuilder();
    const user: User = await em.where('"username" = :name', { name }).getOne();

    if (!user) {
      throw new HttpException('No user found', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid: boolean = await this.helper.isPasswordValid(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.BAD_REQUEST);
    }
    // this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }

  public async refresh(user: User): Promise<string> {
    // this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }
}
