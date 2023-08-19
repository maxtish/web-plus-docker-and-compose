import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Like } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@AuthUser() user): Promise<User> {
    return this.usersService.findById(user.id);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  myWishes(@AuthUser() user): Promise<Wish[]> {
    return this.wishService.findMany({
      where: { owner: { id: user.id } },
    });
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  findUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne({
      select: {
        username: true,
        about: true,
        id: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { username },
    });
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  async userWishes(@Param('username') username: string): Promise<Wish[]> {
    const ownerUser: User = await this.usersService.findOne({
      where: { username },
    });
    if (!ownerUser) {
      throw new NotFoundException('Не найден пользователь');
    }
    return this.wishService.findMany({
      where: { owner: { id: ownerUser.id } },
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@AuthUser() user, @Body() updateUserDto: any) {
    return this.usersService.update(user, updateUserDto);
  }

  @Post('find')
  async findMany(@Body() body: { query: string }) {
    return await this.usersService.findMany({
      select: {
        username: true,
        about: true,
        id: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        email: true,
      },
      where: [
        { email: Like(`%${body.query}%`) },
        { username: Like(`%${body.query}%`) },
      ],
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
