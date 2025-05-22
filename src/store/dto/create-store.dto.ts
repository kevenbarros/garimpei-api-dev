import { IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClothingDto } from 'src/clothing/dto/create-clothing.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSellerDto)
  seller: CreateSellerDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClothingDto)
  clothings?: CreateClothingDto[];
}
