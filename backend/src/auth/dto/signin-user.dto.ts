import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PickType } from '@nestjs/swagger';

export class SiqninUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}
