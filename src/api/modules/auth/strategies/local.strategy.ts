import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginDTO } from '../dto/login-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AuthLoginDTO> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos!');
    }
    const { createdAt, updatedAt, ...newU } = user;
    return { ...newU, id: user.id };
  }
}
