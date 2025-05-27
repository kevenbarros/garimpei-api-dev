import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingService } from './clothing.service';
import { ClothingController } from './clothing.controller';
import { Clothing } from './clothing.entity';
import { Store } from 'src/store/store.entity';
import { BlobModule } from 'src/blob/blob.module';
import { Image } from 'src/image/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing, Store, Image]), BlobModule],
  controllers: [ClothingController],
  providers: [ClothingService],
})
export class ClothingModule {}
