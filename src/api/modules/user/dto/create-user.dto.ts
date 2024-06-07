import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Vitor Hugo' })
  @IsNotEmpty({ message: 'O campo name é obrigatório!' })
  name: string;

  @ApiProperty({ example: 'vitor@email.com' })
  @IsNotEmpty({ message: 'O campo email é obrigatório!' })
  @IsEmail({}, { message: 'Email com formato inválido!' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsNotEmpty({ message: 'O campo password é obrigatória!' })
  password: string;
}
