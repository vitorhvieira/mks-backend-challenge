import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { DeleteResult } from 'typeorm';

export interface IFindBy {
  key: 'id' | 'email';
  value: string;
}

export interface IUserUpdate {
  userUpdate: UpdateUserDto;
  id: string;
}

export interface IFindOther {
  user_id: string;
  email: string;
}

export interface IUserRepository {
  findByKey(data: IFindBy): Promise<User>;
  findOtherUser(data: IFindOther): Promise<User>;
  createUser(user: CreateUserDto): Promise<void>;
  updateUser(data: IUserUpdate): Promise<User>;
  deleteUser(id: string): Promise<DeleteResult>;
}
