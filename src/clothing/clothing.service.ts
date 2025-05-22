import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clothing } from './clothing.entity';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';

@Injectable()
export class ClothingService {
  constructor(
    @InjectRepository(Clothing)
    private clothingRepository: Repository<Clothing>,
  ) {}

  async create(createClotingDto: CreateClothingDto): Promise<Clothing> {
    const clothing = this.clothingRepository.create(createClotingDto);
    return this.clothingRepository.save(clothing);
  }

  findAll(): Promise<Clothing[]> {
    return this.clothingRepository.find({
      relations: ['store', 'bids', 'bids.buyer'],
    });
  }

  async findOne(id: number): Promise<Clothing> {
    const clothing = await this.clothingRepository.findOne({
      where: { id },
      relations: ['store', 'bids', 'bids.buyer'],
    });
    if (!clothing) {
      throw new Error(`Clothing with id ${id} not found`);
    }
    return clothing;
  }

  async update(id: number, dto: UpdateClothingDto): Promise<Clothing> {
    await this.clothingRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clothingRepository.delete(id);
  }
}
