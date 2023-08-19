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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@AuthUser() user, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  last() {
    return this.wishesService.last();
  }

  @Get('top')
  top() {
    return this.wishesService.top();
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.wishesService.findById(id);
  }

  @Patch(':id')
  update(
    @AuthUser() user,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@AuthUser() user, @Param('id') id: number) {
    return this.wishesService.remove(id, user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copy(@AuthUser() user, @Param('id') id: number) {
    this.wishesService.copy(id);
    this.wishesService.addToUserWishes(user, id);
  }
}
