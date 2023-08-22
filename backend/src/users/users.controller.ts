import {
  Controller,
  Patch,
  Body,
  Post,
  Req,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/UpdateUserDto';

export interface RequestWithUser extends Request {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Post('find')
  public async findMany(@Body() user): Promise<User[]> {
    return this.usersService.findMany(user);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  @Get(':username/wishes')
  async findWishesByUserName(@Param('username') username: string) {
    return await this.usersService.getAnotherUserWishes(username);
  }

  @Get('me/wishes')
  async getWishesUser(@Req() req: RequestWithUser) {
    return await this.wishesService.getUserWishes(req.user.id);
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() updateUser: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.updateOne(id, updateUser);
  }
}
