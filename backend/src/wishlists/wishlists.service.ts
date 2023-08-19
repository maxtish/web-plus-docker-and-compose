import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private wishService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    const items = await this.wishService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });
    return this.wishListRepository.save({ ...createWishlistDto, owner, items });
  }

  findAll(query: FindManyOptions<Wishlist>) {
    return this.wishListRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishListRepository.findOneOrFail(query);
  }

  findById(id: number) {
    return this.wishListRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    updateWishlistDto.id = id;
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Не найдена подборка подарков');
    }
    if (wishlist.owner.id !== user.id) {
      throw new NotAcceptableException(
        'Эта подборка принадлежит другому пользователю',
      );
    }
    return this.wishListRepository.save(updateWishlistDto);
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Не найдена подборка подарков');
    }
    if (wishlist.owner.id !== user.id) {
      throw new NotAcceptableException(
        'Эта подборка принадлежит другому пользователю',
      );
    }
    this.wishListRepository.delete(id);
  }
}
