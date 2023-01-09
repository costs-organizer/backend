import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../../entities';
import { AuthService } from '../auth';
import { AuthHelper } from '../auth/auth.helper';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './auth.strategy';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secretOrPrivateKey: process.env.JWT_KEY,
          signOptions: { expiresIn: process.env.JWT_EXPIRES },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthResolver, JwtStrategy, AuthHelper, AuthService],
  exports: [AuthHelper],
})
export class AuthModule {}
