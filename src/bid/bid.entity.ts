import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Buyer } from 'src/buyer/buyer.entity';
import { Clothing } from 'src/clothing/clothing.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bid: number;

  @ManyToOne(() => Buyer, (buyer) => buyer.bids, { onDelete: 'CASCADE' })
  buyer: Buyer;

  @ManyToOne(() => Clothing, (clothing) => clothing.bids, {
    onDelete: 'CASCADE',
  })
  clothing: Clothing;
}
