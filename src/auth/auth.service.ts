import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from 'src/buyer/buyer.entity';
import { Seller } from 'src/seller/seller.entity';
import { Repository } from 'typeorm';

type AuthUser = (Buyer | Seller) & { seller: boolean };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async findByEmail(email: string): Promise<AuthUser | undefined> {
    console.log('Searching for user with email:', email);
    const buyer = await this.buyerRepository.findOne({ where: { email } });
    if (buyer) {
      return { ...buyer, seller: false };
    }
    const seller = await this.sellerRepository.findOne({ where: { email } });
    if (seller) {
      return { ...seller, seller: true };
    }
    return undefined;
  }
}
