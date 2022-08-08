import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../entities';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // public handleRequest(err: unknown, user: User): any {
  //   return user;
  // }

  // public async canActivate(context: ExecutionContext): Promise<boolean> {
  //   await super.canActivate(context);

  //   const { user }: Request = context.switchToHttp().getRequest();

  //   return !!user;
  // }
  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    return request.req;
  }
}
