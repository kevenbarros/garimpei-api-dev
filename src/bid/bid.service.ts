import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Store } from 'src/store/store.entity';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createBidDto: CreateBidDto, id: number): Promise<Bid> {
    const now = new Date();
    const isoString = now.toISOString(); // Ex: '2025-06-22T15:30:00.000Z'
    const [date, timeWithMs] = isoString.split('T');
    const time = timeWithMs.split('.')[0]; // '15:30:00'

    const bid = this.bidRepository.create({
      ...createBidDto,
      date,
      time,
      buyer: { id: id },
    });
    return this.bidRepository.save(bid);
  }

  findAllUser(id: number) {
    console.log('id is', id);
    return this.bidRepository.find({
      where: { buyer: { id } },
      relations: ['buyer', 'clothing'],
    });
  }

  async findAllSeller(id: number) {
    // Busca todas as stores do seller
    const stores = await this.storeRepository.find({
      where: { seller: { id } },
      relations: [
        'clothings',
        'clothings.bids',
        'clothings.bids.buyer',
        'clothings.bids.clothing',
      ],
    });

    // Extrai todos os bids das clothings dessas stores
    const bids = stores
      .flatMap((store) => store.clothings)
      .flatMap((clothing) => clothing.bids);

    return bids;
  }

  findAllPerClothing(id: number) {
    console.log("I'm clothing", id);
    return this.bidRepository.find({
      where: { clothing: { id } },
      relations: ['buyer', 'clothing'],
    });
  }

  findOne(id: number) {
    return this.bidRepository.findOne({
      where: { id },
      relations: ['buyer', 'clothing'],
    });
  }

  async update(id: number, dto: UpdateBidDto) {
    await this.bidRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.bidRepository.delete(id);
  }
}
