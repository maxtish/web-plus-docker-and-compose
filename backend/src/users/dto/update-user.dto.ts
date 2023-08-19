import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @IsNotEmpty()
  // username: string;

  // @IsEmail()
  // email: string;

  // password: string;

  id: number;
}
