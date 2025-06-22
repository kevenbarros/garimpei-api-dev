import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { CreateClothingDto } from 'src/clothing/dto/create-clothing.dto';

export class CreateBidDto {
  @IsNumber()
  bid: number;

  @IsString()
  datetime: string; // Ex: '2025-06-22T14:00:00'
  // ...existing code...

  @ValidateNested({ each: true })
  @Type(() => CreateClothingDto)
  clothing: CreateClothingDto;

  @ValidateNested({ each: true })
  @Type(() => CreateBuyerDto)
  buyer: CreateBuyerDto;
}
