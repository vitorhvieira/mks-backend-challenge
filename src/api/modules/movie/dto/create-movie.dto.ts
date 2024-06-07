import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Titanic' })
  @IsNotEmpty({ message: 'O campo title é obrigatório!' })
  title: string;

  @ApiProperty({ example: 'James Cameron' })
  @IsNotEmpty({ message: 'O campo director é obrigatório!' })
  director: string;

  @ApiProperty({ example: '2012-04-13' })
  @IsNotEmpty({ message: 'O campo releaseDate é obrigatório!' })
  releaseDate: Date;

  @ApiProperty({
    example:
      'Titanic é um filme dirigido por James Cameron com Leonardo DiCaprio',
  })
  @IsNotEmpty({ message: 'O campo description é obrigatório!' })
  description: string;

  @ApiProperty({
    example: 'Romance',
  })
  @IsNotEmpty({ message: 'O campo genre é obrigatório!' })
  genre: string;
}
