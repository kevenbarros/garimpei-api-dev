import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStoreDto } from '../../store/dto/create-store.dto';

export class CreateSellerDto {
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
  @Type(() => CreateStoreDto)
  stores: CreateStoreDto[];
}
