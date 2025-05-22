import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bid } from 'src/bid/bid.entity';

@Entity()
export class Buyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact: string;

  @Column()
  instagram: string;

  @OneToMany(() => Bid, (bid) => bid.buyer)
  bids: Bid[];
}
