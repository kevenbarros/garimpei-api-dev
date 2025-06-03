import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import * as bcrypt from 'bcrypt';
import { Seller } from '../seller/seller.entity'; // importe o Seller

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>, // injete o Seller
  ) {}

  async create(
    createBuyerDto: CreateBuyerDto,
  ): Promise<Buyer | { message: string }> {
    // Verifica se já existe um seller com esse email
    const seller = await this.sellerRepository.findOne({
      where: { email: createBuyerDto.email },
    });
    if (seller) {
      return { message: 'Email já está em uso por um vendedor.' };
    }
    const existingBuyer = await this.buyerRepository.findOne({
      where: { email: createBuyerDto.email },
    });
    if (existingBuyer) {
      return { message: 'Email já está em uso por um comprador.' };
    }
    const hash = await bcrypt.hash(createBuyerDto.password, 10);
    const newBuyer = this.buyerRepository.create({
      ...createBuyerDto,
      password: hash,
    });
    return this.buyerRepository.save(newBuyer);
  }

  async findAll() {
    const buyers = await this.buyerRepository.find({ relations: ['bids'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return buyers.map(({ password, ...rest }) => rest);
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
