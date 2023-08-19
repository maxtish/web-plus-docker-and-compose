import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  description: string;
}
