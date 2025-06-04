import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { BidSseService } from './bid-sse.service';

@Controller('bid')
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly bidSseService: BidSseService,
  ) {}

  @Get('stream')
  stream(@Req() req: Request, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*', // ou o domínio do seu frontend
    });
    res.flushHeaders();
    this.bidSseService.addClient(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateBidDto) {
    const bid = await this.bidService.create(dto);
    this.bidSseService.sendEvent({ event: 'new-bid', bid });
    return bid;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.bidService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBidDto) {
    return this.bidService.update(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(+id);
  }
}
