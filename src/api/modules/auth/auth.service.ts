import { Injectable } from '@nestjs/common';
import { AuthPayloadDTO } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser({ email, password }: AuthPayloadDTO): Promise<any> {
    const findUser = await this.userService.findByKey({
      key: 'email',
      value: email,
    });
    if (!findUser) {
      return null;
    }
    const validatePass = await compare(password, findUser.password);

    if (!validatePass) {
      return null;
    }
    const { password: _, ...user } = findUser;

    return user;
  }

  async login(user: AuthLoginDTO): Promise<{ access_token: string }> {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
