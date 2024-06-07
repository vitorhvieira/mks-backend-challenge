import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByKey({
      key: 'id',
      value: payload.id,
    });
    if (!user) {
      throw new UnauthorizedException('Token Invalido!');
    }
    const { password, ...newUser } = user;
    return newUser;
  }
}
