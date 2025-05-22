import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller } from './seller.entity';
import { Store } from '../store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seller, Store])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
