import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('evolution/:storeId')
  async getBidEvolution(@Param('storeId') storeId: string) {
    return this.dashboardService.getBidEvolutionByStore(Number(storeId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('bids-clothing/:clothingId')
  async getBidsWithInitial(@Param('clothingId') clothingId: string) {
    return this.dashboardService.getBidsWithInitial(Number(clothingId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('gain/:storeId')
  async getStoreProfit(@Param('storeId') storeId: string) {
    return this.dashboardService.getStoreProfit(Number(storeId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('no-bids-stats/:storeId')
  async getNoBidsStats(@Param('storeId') storeId: string) {
    return this.dashboardService.getClothingNoBidsStats(Number(storeId));
  }
}
