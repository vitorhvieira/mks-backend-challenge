import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/api/cache/redis/redis.module';


@Module({
  imports: [TypeOrmModule.forFeature([Movie]), RedisModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
