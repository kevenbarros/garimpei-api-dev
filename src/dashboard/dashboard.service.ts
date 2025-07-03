import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clothing } from '../clothing/clothing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Clothing)
    private clothingRepository: Repository<Clothing>,
  ) {}

  async getBidEvolutionByStore(storeId: number) {
    const clothings = await this.clothingRepository.find({
      where: { store: { id: storeId } },
      relations: ['bids'],
    });

    return clothings.map((clothing) => {
      const bidsSorted = [...(clothing.bids || [])].sort(
        (a, b) => Number(a.bid) - Number(b.bid),
      );
      return {
        clothingId: clothing.id,
        clothingName: clothing.name,
        initialBid: Number(clothing.initial_bid),
        firstBid: bidsSorted.length > 0 ? Number(bidsSorted[0].bid) : null,
        lastBid:
          bidsSorted.length > 0
            ? Number(bidsSorted[bidsSorted.length - 1].bid)
            : null,
      };
    });
  }

  async getBidsWithInitial(clothingId: number) {
    const clothing = await this.clothingRepository.findOne({
      where: { id: clothingId },
      relations: ['bids'],
    });
    if (!clothing) return [];

    const bidsSorted = [...(clothing.bids || [])].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    const result = [
      {
        bid: Number(clothing.initial_bid),
        date: clothing.initial_date,
        time: clothing.initial_time,
        isInitial: true,
      },
      ...bidsSorted.map((bid) => ({
        bid: Number(bid.bid),
        date: bid.date,
        time: bid.time,
        isInitial: false,
      })),
    ];

    return result;
  }

  async getStoreProfit(storeId: number) {
    const clothings = await this.clothingRepository.find({
      where: { store: { id: storeId } },
      relations: ['bids'],
    });

    let gainValueInitial = 0;
    let gainValueFinal = 0;

    clothings.forEach((clothing) => {
      if (clothing.bids && clothing.bids.length > 0) {
        const initial = Number(clothing.initial_bid);
        gainValueInitial += initial;

        const bidsSorted = [...clothing.bids].sort(
          (a, b) => Number(a.bid) - Number(b.bid),
        );
        const final = Number(bidsSorted[bidsSorted.length - 1].bid);
        gainValueFinal += final;
      }
    });

    return [
      {
        name: 'Ganhos Iniciais',
        value: Number(gainValueInitial.toFixed(2)),
      },
      {
        name: 'Ganhos Finais',
        value: Number(gainValueFinal.toFixed(2)),
        total: true,
      },
      {
        name: 'Lucro Sobre o valor inicial',
        value: Number((gainValueFinal - gainValueInitial).toFixed(2)),
      },
    ];
  }

  async getClothingNoBidsStats(storeId: number) {
    const clothings = await this.clothingRepository.find({
      where: { store: { id: storeId } },
      relations: ['bids'],
    });

    const total = clothings.length;
    const now = new Date();

    // Produtos sem lances
    const noBids = clothings.filter((c) => !c.bids || c.bids.length === 0);

    // Porcentagem de produtos sem lances
    const percentageNoBids = total > 0 ? (noBids.length / total) * 100 : 0;

    // Somatória dos valores iniciais dos produtos sem lances
    const sumInitialNoBids = noBids.reduce(
      (sum, c) => sum + Number(c.initial_bid),
      0,
    );

    // Quantidade de itens sem lances e já terminados
    const finishedNoBids = noBids.filter((c) => {
      if (!c.end_date || !c.end_time) return false;
      const endDateTime = new Date(`${c.end_date}T${c.end_time}`);
      return endDateTime.getTime() < now.getTime();
    });

    return {
      noBids: noBids.length,
      finishedNoBids: finishedNoBids.length,
      percentageNoBids,
      sumInitialNoBids,
    };
  }
}
