import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Store } from 'src/store/store.entity';
import { Bid } from 'src/bid/bid.entity';

@Entity()
export class Clothing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  initial_bid: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initial_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  end_date: Date;

  @ManyToOne(() => Store, (store) => store.clothings, { onDelete: 'CASCADE' })
  store: Store;

  @OneToMany(() => Bid, (bid) => bid.clothing, { cascade: true })
  bids: Bid[];
}
