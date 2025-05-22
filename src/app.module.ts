import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyer/buyer.entity';
import { Seller } from './seller/seller.entity';
import { Clothing } from './clothing/clothing.entity';
import { Store } from './store/store.entity';
import { Bid } from './bid/bid.entity';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';
import { StoreModule } from './store/store.module';
import { BidModule } from './bid/bid.module';
import { ClothingModule } from './clothing/clothing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 6000,
      username: 'postgres',
      password: 'root',
      database: 'garimpeidb',
      entities: [Buyer, Seller, Clothing, Bid, Store],
      synchronize: true, // true só para desenvolvimento!
    }),
    BuyerModule,
    SellerModule,
    StoreModule,
    BidModule,
    ClothingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
