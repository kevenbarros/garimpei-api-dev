import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { Buyer } from 'src/buyer/buyer.entity';
import { Clothing } from 'src/clothing/clothing.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Buyer, Clothing])],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
