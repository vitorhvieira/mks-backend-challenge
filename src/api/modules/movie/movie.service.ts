import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import {
  IFindBy,
  IMovieRepository,
  IMovieUpdate,
} from './repositories/IMovieRepository';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { RedisService } from 'src/api/cache/redis/redis.service';


@Injectable()
export class MovieService implements IMovieRepository {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly redisService: RedisService,
  ) {}
  async findTitleAndDirector(title: string, director: string): Promise<Movie> {
    return await this.movieRepository.findOne({ where: { title, director } });
  }
  async findById(id: string): Promise<Movie> {
    const cachedMovie = await this.redisService.get(id);
    if (cachedMovie) {
      return JSON.parse(cachedMovie);
    }
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (movie) {
      await this.redisService.set(id, JSON.stringify(movie));
    }
    return movie;
  }
  async findByKey({ key, value }: IFindBy): Promise<Movie> {
    return await this.movieRepository.findOneBy({ [key]: value });
  }
  async findAll(): Promise<Movie[]> {
    const cacheKey = 'all_movies';
    const cachedMovies = await this.redisService.get(cacheKey);
    if (cachedMovies) {
      return JSON.parse(cachedMovies);
    }
    const movies = await this.movieRepository.find();
    await this.redisService.set(cacheKey, JSON.stringify(movies));
    return movies;
  }
  async updateMovie({ movieUpdate, movie_id }: IMovieUpdate): Promise<Movie> {
    const findMovie = await this.movieRepository.findOne({
      where: { id: movie_id },
    });
    Object.assign(findMovie, movieUpdate);

    const updatedMovie = await this.movieRepository.save(findMovie);

    if (updatedMovie) {
      await this.redisService.set(movie_id, JSON.stringify(updatedMovie));
    }

    return updatedMovie;
  }
  async deleteMovie(id: string): Promise<DeleteResult> {
    return await this.movieRepository.delete({ id });
  }
  async createMovie(data: CreateMovieDto): Promise<Movie> {
    const releaseDate = new Date(data.releaseDate);
    const movie = this.movieRepository.create({ ...data, releaseDate });
    return await this.movieRepository.save(movie);
  }
}
