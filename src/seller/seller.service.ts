import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async create(createSellerDto: CreateSellerDto): Promise<Seller> {
    const hash = await bcrypt.hash(createSellerDto.password, 10);
    const seller = this.sellerRepository.create({
      ...createSellerDto,
      password: hash,
    });
    return this.sellerRepository.save(seller);
  }

  findAll(): Promise<Seller[]> {
    return this.sellerRepository.find({ relations: ['stores'] });
  }

  async findOne(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!seller) {
      throw new Error(`Seller with id ${id} not found`);
    }
    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto): Promise<Seller> {
    await this.sellerRepository.update(id, updateSellerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sellerRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Seller | undefined> {
    const seller = await this.sellerRepository.findOne({ where: { email } });
    return seller === null ? undefined : seller;
  }
}
