import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
  Sse,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { AuthGuard } from '@nestjs/passport';
import { IRequestWithUser } from 'src/interfaces';
import { BidSseService } from './bid-sse.service';
import { Observable } from 'rxjs';

@Controller('bid')
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly bidSseService: BidSseService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: IRequestWithUser, @Body() dto: CreateBidDto) {
    const user = req.user;
    console.log('👤 User creating bid:', user);
    console.log('📝 Bid data:', dto);

    if (user?.seller === false) {
      const bid = await this.bidService.create(dto, Number(user?.userId));
      console.log('✅ Bid created successfully:', bid);
      return bid;
    } else {
      throw new ForbiddenException('Vendedores não podem criar lances (bids).');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: IRequestWithUser) {
    const user = req.user;
    if (user?.seller === true) {
      return this.bidService.findAllSeller(Number(user.userId));
    }
    return this.bidService.findAllUser(Number(user.userId));
  }

  @Sse('stream/all')
  streamBidsForClothingAll(): Observable<MessageEvent> {
    return this.bidSseService.getBidStreamForClothingAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/clothing/:id')
  findAllPerClothing(@Param('id') id: string) {
    return this.bidService.findAllPerClothing(Number(id));
  }

  // @UseGuards(AuthGuard('jwt'))
  @Sse('stream/:clothingId')
  streamBidsForClothing(
    @Param('clothingId') clothingId: string,
  ): Observable<MessageEvent> {
    return this.bidSseService.getBidStreamForClothing(Number(clothingId));
  }

  // @Get('test-sse/:clothingId')
  // testSSE(@Param('clothingId') clothingId: string) {
  //   console.log(`🧪 Teste manual SSE para clothing ${clothingId}`);

  //   this.bidSseService.emitNewBid(Number(clothingId), {
  //     id: 999,
  //     bid: 100,
  //     clothingId: Number(clothingId),
  //     test: true,
  //   });

  //   return { message: 'SSE test event sent' };
  // }

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
