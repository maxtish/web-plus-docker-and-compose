import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не найден подарок');
    }
    if (wish.owner.id == user.id) {
      throw new NotAcceptableException('Этот подарок принадлежит вам');
    }
    const wishOffers = await this.findMany({
      where: { item: wish },
      select: { amount: true },
    });
    const totalOffers = wishOffers.reduce((sum, el) => sum + el.amount, 0);
    if (wish.price < totalOffers + createOfferDto.amount) {
      throw new NotAcceptableException('Превышена сумма подарка');
    }
    wish.raised += createOfferDto.amount;
    this.wishService.save(wish);
    return this.offerRepository.insert({ ...createOfferDto, user, item: wish });
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto, user: User) {
    const wish = await this.wishService.findOne({
      where: { id: updateOfferDto.itemId },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не найден подарок');
    }
    if (wish.owner.id !== user.id) {
      throw new NotAcceptableException('Этот взнос принадлежит не вам');
    }
    return this.offerRepository.save(updateOfferDto);
  }

  async remove(id: number, user: User) {
    const wish = await this.wishService.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Не найден подарок');
    }
    if (wish.owner.id !== user.id) {
      throw new NotAcceptableException('Этот взнос принадлежит не вам');
    }
    return this.offerRepository.delete(id);
  }
}
