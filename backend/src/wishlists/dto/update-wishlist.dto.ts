import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsUrl } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  name: string;

  @IsUrl()
  image: string;

  itemsId: Array<number>;

  id: number;
}
