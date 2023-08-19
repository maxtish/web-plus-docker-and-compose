import { IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  amount: number;

  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
