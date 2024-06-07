import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hash, compare } from 'bcrypt';
import { Repository, Not, DeleteResult } from 'typeorm';
import {
  IFindBy,
  IFindOther,
  IUserRepository,
  IUserUpdate,
} from './repositories/IUserRepository';

@Injectable()
export class UserService implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOtherUser({ user_id, email }: IFindOther): Promise<User> {
    return await this.userRepository.findOne({
      where: { email, id: Not(user_id) },
    });
  }

  async findByKey({ key, value }: IFindBy): Promise<User> {
    return await this.userRepository.findOneBy({ [key]: value });
  }
  async createUser(user: CreateUserDto): Promise<void> {
    const passHash = await hash(user.password, 10);
    const createUser = this.userRepository.create({
      name: user.name,
      password: passHash,
      email: user.email,
    });
    await this.userRepository.save(createUser);
    return;
  }

  async updateUser({ id, userUpdate }: IUserUpdate): Promise<User> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    const isSamePass = await compare(userUpdate.password, findUser.password);
    if (!isSamePass) {
      const passHash = await hash(userUpdate.password, 10);
      userUpdate.password = passHash;
    } else {
      delete userUpdate.password;
    }
    Object.assign(findUser, userUpdate);
    return await this.userRepository.save(findUser);
  }
  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }
}
