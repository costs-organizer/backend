import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GroupsService } from './groups.service';
import { Group, User } from '../../entities';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/shared/decorators';
import {
  CreateGroupInput,
  FindAllGroupsInput,
  RemoveUserFromGroupInput,
} from './dto';
import { AddNewUsersInput } from './dto/add-new-users.input';

@Resolver(() => User)
export class GroupsResolver {
  constructor(
    @Inject(GroupsService) private readonly groupsService: GroupsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Group], { name: 'groups' })
  async findAll(
    @CurrentUser() currentUser: User,
    @Args('findAllInput') findAllInput: FindAllGroupsInput,
  ): Promise<Group[]> {
    return await this.groupsService.findAll(currentUser, findAllInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Group, { name: 'group' })
  async findOne(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Group> {
    return await this.groupsService.findOne(currentUser, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async createGroup(
    @CurrentUser() currentUser: User,
    @Args('createGroupInput') createGroupInput: CreateGroupInput,
  ): Promise<number> {
    const { name, userIds } = createGroupInput;
    return await this.groupsService.createGroup(name, currentUser, userIds);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Int])
  async addNewUsers(
    @CurrentUser() currentUser: User,
    @Args('addNewUsersInput') addNewUsersInput: AddNewUsersInput,
  ): Promise<number[]> {
    return await this.groupsService.addNewUsers(currentUser, addNewUsersInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async removeUserFromGroup(
    @CurrentUser() currentUser: User,
    @Args('removeUserFromGroupInput')
    removeUserFromGroupInput: RemoveUserFromGroupInput,
  ): Promise<number> {
    console.log(currentUser, removeUserFromGroupInput);
    return await this.groupsService.removeUserFromGroup(
      removeUserFromGroupInput,
      currentUser,
    );
  }
}
