import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  create(dto: CreateBuyerDto) {
    const buyer = this.buyerRepository.create(dto);
    return this.buyerRepository.save(buyer);
  }

  findAll() {
    return this.buyerRepository.find({ relations: ['bids'] });
  }

  findOne(id: number) {
    return this.buyerRepository.findOne({ where: { id }, relations: ['bids'] });
  }

  async update(id: number, dto: UpdateBuyerDto) {
    await this.buyerRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.buyerRepository.delete(id);
  }
}
