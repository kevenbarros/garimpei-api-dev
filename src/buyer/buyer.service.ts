import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  async create(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    const hash = await bcrypt.hash(createBuyerDto.password, 10);
    const buyer = this.buyerRepository.create({
      ...createBuyerDto,
      password: hash,
    });
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

  async findByEmail(email: string): Promise<Buyer | undefined> {
    const buyer = await this.buyerRepository.findOne({ where: { email } });
    return buyer === null ? undefined : buyer;
  }
}
