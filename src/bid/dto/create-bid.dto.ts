import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { CreateClothingDto } from 'src/clothing/dto/create-clothing.dto';

export class CreateBidDto {
  @IsString()
  name: string;

  @IsString()
  contact: string;

  @IsString()
  instagram: string;

  @ValidateNested({ each: true })
  @Type(() => CreateClothingDto)
  clothing: CreateClothingDto;

  @ValidateNested({ each: true })
  @Type(() => CreateBuyerDto)
  buyer: CreateBuyerDto;
}
