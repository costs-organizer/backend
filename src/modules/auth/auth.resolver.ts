import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from '../../entities';
import { AuthService } from '../auth';
import { LoginInput, RegisterInput } from './dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => String)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context('req') req: Request,
  ) {
    const token = await this.authService.login(loginInput);
    req.res.cookie('Authorization', token);
    return token;
  }

  @Mutation(() => String)
  async logout(@Context('req') req: Request) {
    req.res.clearCookie('Authorization');
    return '';
  }
}
