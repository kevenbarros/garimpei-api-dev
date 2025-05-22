import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingService } from './clothing.service';
import { ClothingController } from './clothing.controller';
import { Clothing } from './clothing.entity';
import { Store } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing, Store])],
  controllers: [ClothingController],
  providers: [ClothingService],
})
export class ClothingModule {}
