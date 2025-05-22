import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';

export class CreateBuyerDto {
  @IsString()
  name: string;

  @IsInt()
  contact: string;

  @IsInt()
  instagram: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBidDto)
  stores: CreateBidDto[];
}
