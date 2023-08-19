import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/common/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(CreateUserDto: CreateUserDto): Promise<User> {
    const { password } = CreateUserDto;
    const user = await this.userRepository.create({
      ...CreateUserDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.insert(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

  findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  remove(id: number) {
    this.userRepository.delete(id);
  }
}
