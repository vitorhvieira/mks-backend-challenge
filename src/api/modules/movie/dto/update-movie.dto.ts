import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({ example: 'Titanic Atualizado' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'James Cameron Atualizado' })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty({ example: '2024-06-07' })
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @ApiProperty({ example: 'Descrição atualizada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Drama' })
  @IsString()
  @IsOptional()
  genre?: string;
}
