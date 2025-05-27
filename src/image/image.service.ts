import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './image.entity';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private sellerRepository: Repository<Image>,
  ) {}

  create(createImageDto: CreateImageDto): Promise<Image> {
    const seller = this.sellerRepository.create(createImageDto);
    return this.sellerRepository.save(seller);
  }

  findAll(): Promise<Image[]> {
    return this.sellerRepository.find({ relations: ['clothing'] });
  }

  async findOne(id: number): Promise<Image> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['clothing'],
    });
    if (!seller) {
      throw new Error(`Image with id ${id} not found`);
    }
    return seller;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    await this.sellerRepository.update(id, updateImageDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sellerRepository.delete(id);
  }
}
