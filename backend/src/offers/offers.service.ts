import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/CreateOfferDto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const { id } = user;
    const moneyDifference = wishes.price - wishes.raised;
    const wish = await this.wishesService.findOne(wishes.id);
    const newRised = wish.raised + createOfferDto.amount;

    if (createOfferDto.amount > moneyDifference) {
      throw new BadRequestException(
        'Сумма взноса превышает сумму остатка стоимости подарка',
      );
    }

    await this.wishesService.updateByRised(wish.id, newRised);

    if (wishes.raised > 0 && wishes.price !== undefined) {
      throw new ConflictException(
        'Обновление запрещено, поскольку идёт сбор средств',
      );
    }

    if (id === wishes.owner.id) {
      throw new BadRequestException(
        'Вы не можете вносить деньги на свои подарки',
      );
    }

    return this.offersRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });
  }
}
