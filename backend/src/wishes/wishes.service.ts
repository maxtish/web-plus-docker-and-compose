import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner) {
    return this.wishRepository.insert({ ...createWishDto, owner });
  }

  last() {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  top() {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  findAll() {
    return this.wishRepository.find();
  }

  findById(id: number) {
    return this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: { owner: true, offers: {user: true} },
    });
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishRepository.findOneOrFail(query);
  }

  async update(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не найден подарок');
    }
    if (wish.owner.id !== user.id) {
      throw new NotAcceptableException(
        'Этот подарок принадлежит другому пользователю',
      );
    }
    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async remove(id: number, user: User) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не найден подарок');
    }
    if (wish.owner.id !== user.id) {
      throw new NotAcceptableException(
        'Этот подарок принадлежит другому пользователю',
      );
    }
    this.wishRepository.delete(id);
  }

  save(wish: Wish) {
    return this.wishRepository.save(wish);
  }

  async copy(id: number) {
    const wish = await this.wishRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!wish) {
      throw new NotFoundException('Не найден копируемый подарок');
    }

    return this.wishRepository.save({ ...wish, copied: wish.copied + 1 });
  }

  async addToUserWishes(user: User, idWish: number) {
    const wish = await this.findById(idWish);
    this.create(wish, user);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishRepository.find(query);
  }
}
