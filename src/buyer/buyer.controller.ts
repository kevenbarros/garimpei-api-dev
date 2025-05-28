import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginBuyerDto } from './dto/login-buyer.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('buyer')
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() dto: CreateBuyerDto) {
    return this.buyerService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.buyerService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBuyerDto) {
    return this.buyerService.update(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerService.remove(+id);
  }

  @Post('login')
  async login(@Body() loginBuyerDto: LoginBuyerDto) {
    const buyer = await this.buyerService.findByEmail(loginBuyerDto.email);
    if (!buyer) {
      return { message: 'Email ou senha inválidos' };
    }
    const isPasswordValid = await bcrypt.compare(
      loginBuyerDto.password,
      buyer.password,
    );
    if (!isPasswordValid) {
      return { message: 'Email ou senha inválidos' };
    }
    // Gere o JWT
    const payload = { sub: buyer.id, email: buyer.email };
    const token = this.jwtService.sign(payload);
    const { ...result } = buyer;
    return {
      token,
      ...result,
    };
  }
}
