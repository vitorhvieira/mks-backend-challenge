import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Vitor Hugo Atualizado' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'vitorAtualizado@emai.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email com formato inválido!' })
  email?: string;

  @ApiProperty({ example: 'senhaNova123' })
  @IsOptional()
  password?: string;
}
