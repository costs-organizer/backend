import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities';
import { AuthService } from './auth';
import { AuthHelper } from './auth/auth.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, JwtService, AuthHelper, UsersService, AuthService],
})
export class UsersModule {}
