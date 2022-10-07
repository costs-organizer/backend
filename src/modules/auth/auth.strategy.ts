import { Injectable, Inject } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../entities';
import { AuthHelper } from './auth.helper';
import { Request } from 'express';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor() {
    console.log('jwtkey:', process.env.JWT_KEY);
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'Authorization' in req.cookies &&
      req.cookies.Authorization?.length > 0
    ) {
      return req.cookies.Authorization;
    }
    return null;
  }

  private validate(payload: string): Promise<User | never> {
    return this.helper.validateUser(payload);
  }
}
