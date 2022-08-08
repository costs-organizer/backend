import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../../entities';
import { Inject, UseGuards } from '@nestjs/common';
import { FindAllInput } from './find-all.input';
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
    @Args('findAllInput') findAllInput: FindAllInput,
    @Context() context: any,
  ) {
    console.log(context.req);
    return await this.usersService.findAll(findAllInput);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  updateUser(
    @CurrentUser() currentUser: User,
    @Args('updateUserInput') updateUserInput: FindAllInput,
    @Context() context: any,
  ) {
    console.log(context.req);
    console.log(Object.keys(updateUserInput), currentUser);
    return 1;
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
