import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  create(@Body() dto: CreateBuyerDto) {
    return this.buyerService.create(dto);
  }

  @Get()
  findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBuyerDto) {
    return this.buyerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerService.remove(+id);
  }
}
