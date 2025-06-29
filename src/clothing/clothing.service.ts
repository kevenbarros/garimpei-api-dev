import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clothing } from './clothing.entity';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { Store } from 'src/store/store.entity';

@Injectable()
export class ClothingService {
  constructor(
    @InjectRepository(Clothing)
    private clothingRepository: Repository<Clothing>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createClotingDto: CreateClothingDto): Promise<Clothing> {
    try {
      const clothing = this.clothingRepository.create(createClotingDto);
      return await this.clothingRepository.save(clothing);
    } catch (error: any) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.message || 'Failed to create clothing',
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ items: Clothing[]; lastPage: boolean }> {
    const now = new Date();
    const nowISOString = now.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:mm:ss'
    console.log('NOW:', nowISOString);

    const clothings = await this.clothingRepository
      .createQueryBuilder('clothing')
      .leftJoinAndSelect('clothing.store', 'store')
      .leftJoinAndSelect('clothing.bids', 'bids')
      .leftJoinAndSelect('bids.buyer', 'buyer')
      .leftJoinAndSelect('clothing.images', 'images')
      .select(['clothing', 'store.name', 'bids', 'buyer', 'images'])
      .getMany();

    const filtered = clothings.filter((c) => {
      if (!c.end_date || !c.end_time) return false;
      const endDateTime = new Date(`${c.end_date}T${c.end_time}`);
      return endDateTime.getTime() > now.getTime();
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);
    const lastPage = end >= filtered.length;

    return {
      items,
      lastPage,
    };
  }

  async findAllPerUser(sellerId: number): Promise<Clothing[]> {
    const clothings = await this.clothingRepository.find({
      relations: ['store', 'bids', 'bids.buyer', 'images'],
      where: {
        store: {
          seller: {
            id: sellerId,
          },
        },
      },
    });
    return clothings;
  }

  // async findAllPerUser(id: number): Promise<Clothing[]> {
  //   const stores = await this.storeRepository.find({
  //     where: { seller: { id: id } },
  //     relations: ['clothings'],
  //   });
  //   console.log('stores', stores);
  //   const clothings = stores.flatMap((store) => store.clothings);
  //   // const clothings = await this.clothingRepository.find({
  //   //   where: { id },
  //   //   relations: ['store', 'bids', 'bids.buyer', 'images'],
  //   // });
  //   return clothings;
  // }

  async findOne(id: number): Promise<Clothing> {
    const clothing = await this.clothingRepository.findOne({
      where: { id },
      relations: ['store', 'bids', 'bids.buyer', 'images'],
    });
    if (!clothing) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return clothing;
  }

  async getTimeRemaining(id: number) {
    const clothing = await this.clothingRepository.findOne({ where: { id } });
    if (!clothing) {
      throw new Error('Clothing not found');
    }

    // Combina data e hora para criar objetos Date
    const initialDateTime = new Date(
      `${clothing.initial_date}T${clothing.initial_time}`,
    );
    const endDateTime = new Date(`${clothing.end_date}T${clothing.end_time}`);
    const now = new Date();

    const timeRemaining = endDateTime.getTime() - now.getTime();
    console.log('initial Date', initialDateTime);
    console.log('final Date', endDateTime);
    return {
      isActive:
        now.getTime() >= initialDateTime.getTime() &&
        now.getTime() <= endDateTime.getTime(),
      timeRemaining: timeRemaining > 0 ? timeRemaining : 0,
      end_date: clothing.end_date,
      end_time: clothing.end_time,
    };
  }
  // ...existing code...
  // ...existing code...

  async update(id: number, dto: UpdateClothingDto): Promise<Clothing> {
    await this.clothingRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clothingRepository.delete(id);
  }
}
