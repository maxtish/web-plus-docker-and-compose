import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishService: WishesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@AuthUser() user, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        items: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          link: true,
          image: true,
          price: true,
          raised: true,
          copied: true,
          description: true,
        },
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        items: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          link: true,
          image: true,
          price: true,
          raised: true,
          copied: true,
          description: true,
        },
      },
      relations: {
        owner: true,
        items: true,
      },
      where: { id },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@AuthUser() user, @Param('id') id: number) {
    return this.wishlistsService.remove(id, user);
  }
}
