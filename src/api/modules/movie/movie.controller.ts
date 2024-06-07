import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  ConflictException,
  Query,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Response } from 'express';
import { isUUID } from 'class-validator';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface IQueryParams {
  title?: string;
  director?: string;
  genre?: string;
}

@ApiBearerAuth('token')
@ApiTags('movie')
@UseGuards(JwtAuthGuard)
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Criação e um novo filme.' })
  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Res() response: Response,
  ) {
    const findMovie = await this.movieService.findTitleAndDirector(
      createMovieDto.title,
      createMovieDto.director,
    );
    if (findMovie) {
      throw new ConflictException(
        'Ja existe um filme com mesmo titulo e mesmo diretor!',
      );
    }
    const movie = await this.movieService.createMovie(createMovieDto);
    return response.status(HttpStatus.CREATED).json(movie);
  }

  @ApiOperation({
    summary: 'Listagem de todos os filmes cadastrados no banco de dados.',
  })
  @Get()
  async findAll(@Res() response: Response) {
    const movies = await this.movieService.findAll();
    return response.status(HttpStatus.OK).json(movies);
  }

  @ApiOperation({
    summary:
      'Listagem de um filme atraves de um parametro title, director ou genre.',
  })
  @ApiQuery({
    name: 'title',
    description: 'Title of the movie',
    required: false,
  })
  @ApiQuery({
    name: 'director',
    description: 'Director of the movie',
    required: false,
  })
  @ApiQuery({
    name: 'genre',
    description: 'Genre of the movie',
    required: false,
  })
  @Get('/search')
  async findByQuery(
    @Query() queryParams: IQueryParams,
    @Res() response: Response,
  ) {
    const { title, director, genre } = queryParams;

    if (!title && !director && !genre) {
      throw new BadRequestException('Parâmetros de consulta inválidos!');
    }

    const result = title
      ? 'title'
      : director
        ? 'director'
        : genre
          ? 'genre'
          : null;

    if (!result) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Invalid query parameter' });
    }

    const movie = await this.movieService.findByKey({
      key: result,
      value: queryParams[result],
    });

    if (!movie) {
      throw new NotFoundException(`Filme não encontrado!`);
    }

    return response.status(HttpStatus.OK).json(movie);
  }

  @ApiOperation({ summary: 'Listar um filme atraves de um ID' })
  @Get(':id')
  async findByParams(@Param('id') id: string, @Res() response: Response) {
    if (!isUUID(id)) {
      throw new BadRequestException('Id informado esta invalido!');
    }
    const movie = await this.movieService.findById(id);
    if (!movie) {
      throw new NotFoundException(`Filme com id ${id} não encontrado!`);
    }
    return response.status(HttpStatus.OK).json(movie);
  }

  @ApiOperation({ summary: 'Editar um filme com ID informado.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    { description, director, genre, releaseDate, title }: UpdateMovieDto,
    @Res() response: Response,
  ) {
    const findOtherMovie = await this.movieService.findTitleAndDirector(
      title,
      director,
    );
    if (findOtherMovie) {
      throw new ConflictException(
        'Ja existe um filme com mesmo titulo e mesmo diretor!',
      );
    }
    const findMovie = await this.movieService.findById(id);

    if (findMovie) {
      throw new NotFoundException(`Filme com id ${id} não encontrado!`);
    }

    const movieUpdate = {};
    if (title) movieUpdate['title'] = title;
    if (director) movieUpdate['director'] = director;
    if (releaseDate) movieUpdate['releaseDate'] = releaseDate;
    if (description) movieUpdate['description'] = description;
    if (genre) movieUpdate['genre'] = genre;

    const updateMovie = await this.movieService.updateMovie({
      movieUpdate,
      movie_id: findMovie.id,
    });

    return response.status(HttpStatus.ACCEPTED).json(updateMovie);
  }

  @ApiOperation({ summary: 'Deleta um filme com ID informado.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const movie = await this.movieService.findById(id);
    if (!movie) {
      throw new NotFoundException(`Filme com id ${id} não encontrado!`);
    }
    await this.movieService.deleteMovie(id);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
