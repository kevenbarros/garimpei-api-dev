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
  // Sse,
  // Req,
  // Res,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { AuthGuard } from '@nestjs/passport';
import { BidsGateway } from './bid.gateway';
import { IRequestWithUser } from 'src/interfaces';
// import { Observable } from 'rxjs';

@Controller('bid')
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly bidGateway: BidsGateway,
  ) {}

  // @Get('stream')
  // stream(@Req() req: Request, @Res() res: Response) {
  //   res.set({
  //     'Content-Type': 'text/event-stream',
  //     'Cache-Control': 'no-cache',
  //     Connection: 'keep-alive',
  //     'Access-Control-Allow-Origin': '*', // ou o domínio do seu frontend
  //   });
  //   res.flushHeaders();
  //   this.bidSseService.addClient(res);
  // }
  // @Sse('stream')
  // stream(): Observable<MessageEvent<any>> {
  //   return this.bidGateway.getBidStream();
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: IRequestWithUser, @Body() dto: CreateBidDto) {
    const user = req.user;
    console.log('user is', user);
    if (user?.seller === false) {
      const bid = await this.bidService.create(dto, Number(user?.userId));
      this.bidGateway.sendEvent({ data: { type: 'new-bid', bid } });
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/clothing/:id')
  findAllPerClothing(@Param('id') id: string) {
    return this.bidService.findAllPerClothing(Number(id));
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
