import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Bid } from './bid.entity';
import { Store } from '../store/store.entity';
import { Clothing } from '../clothing/clothing.entity';
import { BidSseService } from './bid-sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Store, Clothing])],
  controllers: [BidController],
  providers: [BidService, BidSseService],
  exports: [BidSseService],
})
export class BidModule {}
