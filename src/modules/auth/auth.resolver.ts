import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '../../entities';
import { LoginInput, RegisterInput } from './dto';
import { Inject } from '@nestjs/common';
import { AuthService } from '../auth';

@Resolver(() => User)
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => String)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: LoginInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }
}
