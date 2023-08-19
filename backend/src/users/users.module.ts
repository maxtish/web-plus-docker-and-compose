import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordHashModule } from 'src/auth/password-hash/password-hash.module';
import { UsersService } from './users.service';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WishesModule, PasswordHashModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
