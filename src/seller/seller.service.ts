import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  create(createSellerDto: CreateSellerDto): Promise<Seller> {
    const seller = this.sellerRepository.create(createSellerDto);
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
}
