import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../../entities';
import { Inject, UseGuards } from '@nestjs/common';
import { FindAllUsersInput } from './find-all.input';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/shared/decorators';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll(
    @CurrentUser() currentUser: User,
    @Args('findAllInput') findAllInput: FindAllUsersInput,
  ) {
    return await this.usersService.findAll(findAllInput);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  me(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
