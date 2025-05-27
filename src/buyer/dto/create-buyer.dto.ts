import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';

export class CreateBuyerDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  contact: string;

  @IsString()
  instagram: string;

  @IsString()
  cpf: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBidDto)
  stores: CreateBidDto[];
}
