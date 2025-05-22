import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const bid = this.bidRepository.create(createBidDto);

    return this.bidRepository.save(bid);
  }

  findAll() {
    return this.bidRepository.find({ relations: ['buyer', 'clothing'] });
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
