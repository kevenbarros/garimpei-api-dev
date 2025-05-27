import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateClothingDto } from 'src/clothing/dto/create-clothing.dto';

export class CreateImageDto {
  @IsString()
  url: string;

  @ValidateNested({ each: true })
  @Type(() => CreateClothingDto)
  clothing: CreateClothingDto;
}
