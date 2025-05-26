import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { CreateStoreDto } from 'src/store/dto/create-store.dto';

export class CreateClothingDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  initial_bid: number;

  @IsDate()
  initial_date: Date;

  @IsDate()
  end_date: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateStoreDto)
  store: CreateStoreDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBidDto)
  bids?: CreateBidDto[];
}
