import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Buyer } from 'src/buyer/buyer.entity';
import { Clothing } from 'src/clothing/clothing.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  bid: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Buyer, (buyer) => buyer.bids, { onDelete: 'CASCADE' })
  buyer: Buyer;

  @ManyToOne(() => Clothing, (clothing) => clothing.bids, {
    onDelete: 'CASCADE',
  })
  clothing: Clothing;
}
