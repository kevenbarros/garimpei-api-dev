import { IsString } from 'class-validator';

export class LoginBuyerDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
