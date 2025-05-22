import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyerController],
  providers: [BuyerService],
})
export class BuyerModule {}
