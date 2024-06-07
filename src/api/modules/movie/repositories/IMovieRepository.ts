import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Movie } from '../entities/movie.entity';
import { DeleteResult } from 'typeorm';

export interface IFindBy {
  key: 'title' | 'genre' | 'director';
  value: string;
}

export interface IMovieUpdate {
  movie_id: string;
  movieUpdate: UpdateMovieDto;
}

export interface IMovieRepository {
  findById(id: string): Promise<Movie>;
  findByKey(data: IFindBy): Promise<Movie>;
  findAll(): Promise<Movie[]>;
  findTitleAndDirector(title: string, director: string): Promise<Movie | void>;
  updateMovie(data: IMovieUpdate): Promise<Movie>;
  deleteMovie(id: string): Promise<DeleteResult>;
  createMovie(data: CreateMovieDto): Promise<Movie>;
}
