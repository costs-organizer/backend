import { Module } from '@nestjs/common';
import { JwtService, JwtModule } from '@nestjs/jwt';
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
        console.log('key:', process.env.JWT_KEY, process.env.JWT_EXPIRES);
        return {
          secretOrPrivateKey: process.env.JWT_KEY,
          signOptions: { expiresIn: process.env.JWT_EXPIRES },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthResolver, JwtStrategy, AuthHelper, AuthService],
})
export class AuthModule {}
