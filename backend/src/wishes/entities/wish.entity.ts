import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import {
  Length,
  IsUrl,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/base-entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @Length(1, 250, { message: 'От 1 до 250 символов' })
  name: string;

  @Column({ scale: 2 })
  @IsNotEmpty()
  price: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 1024, { message: 'От 1 до 1024 символов' })
  description: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({ scale: 2, nullable: true })
  @IsOptional()
  raised: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsEmpty()
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  @IsNotEmpty()
  owner: User;

  @Column({ default: 0, nullable: true })
  @IsInt()
  copied: number;
}
