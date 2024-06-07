import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  Req,
  ConflictException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Criação e um novo usuario.' })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const userEmail = await this.userService.findByKey({
      key: 'email',
      value: createUserDto.email,
    });
    if (userEmail) {
      throw new ConflictException('Email ja existente');
    }
    await this.userService.createUser(createUserDto);
    return response.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: 'Edita os dados do usuario logado.' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() { email, name, password }: UpdateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user } = request;

    if (email) {
      const findOtherUser = await this.userService.findOtherUser({
        email,
        user_id: user['id'],
      });
      if (findOtherUser) {
        throw new ConflictException('Email ja existente');
      }
    }

    const userUpdate = {};
    if (email) userUpdate['email'] = email;
    if (name) userUpdate['name'] = name;
    if (password) userUpdate['password'] = password;

    const updateUser = await this.userService.updateUser({
      id: user['id'],
      userUpdate,
    });

    return response.status(HttpStatus.ACCEPTED).json(updateUser);
  }

  @ApiOperation({ summary: 'Deleta o usuario logado.' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Req() request: Request, @Res() response: Response) {
    const { user } = request;
    await this.userService.deleteUser(user['id']);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
