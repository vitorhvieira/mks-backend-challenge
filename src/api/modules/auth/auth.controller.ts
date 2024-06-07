import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthPayloadDTO } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login de um usuario.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() authLogin: AuthPayloadDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user } = request;

    const token = await this.authService.login({
      id: user['id'],
      email: user['email'],
      password: user['password'],
    });

    return response
      .status(HttpStatus.OK)
      .json({ user, token: token.access_token });
  }

  @ApiOperation({ summary: 'Exibe todos os dados do usuario.' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() request: Request) {
    return request.user;
  }
}
