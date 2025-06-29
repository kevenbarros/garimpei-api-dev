import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import * as bcrypt from 'bcrypt';
import { Buyer } from 'src/buyer/buyer.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    private jwtService: JwtService,
  ) {}

  async create(
    createSellerDto: CreateSellerDto,
  ): Promise<
    | ({ token: string; seller: boolean } & Omit<Seller, 'password'>)
    | { message: string }
  > {
    const buyer = await this.buyerRepository.findOne({
      where: { email: createSellerDto.email },
    });
    if (buyer) {
      return { message: 'Email já está em uso por um comprador.' };
    }
    const existingSeller = await this.sellerRepository.findOne({
      where: { email: createSellerDto.email },
    });
    if (existingSeller) {
      return { message: 'Email já está em uso por um vendedor.' };
    }
    const hash = await bcrypt.hash(createSellerDto.password, 10);

    const newSeller = this.sellerRepository.create({
      ...createSellerDto,
      password: hash,
    });

    const seller = await this.sellerRepository.save(newSeller); // <-- await aqui!

    const payload = { sub: seller.id, email: seller.email, seller: true };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = seller;
    return { token, seller: true, ...result };
  }

  async findAll() {
    const sellers = await this.sellerRepository.find({ relations: ['stores'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return sellers.map(({ password, ...rest }) => rest);
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
