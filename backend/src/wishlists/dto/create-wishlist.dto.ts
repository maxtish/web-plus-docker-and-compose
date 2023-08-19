import { IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: Array<number>;
}
