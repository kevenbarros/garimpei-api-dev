import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { Clothing } from '../clothing/clothing.entity';
import { DashboardController } from './dasboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
