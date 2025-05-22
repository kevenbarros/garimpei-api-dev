import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Seller } from 'src/seller/seller.entity';
import { Clothing } from 'src/clothing/clothing.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => Seller, (seller) => seller.stores, { onDelete: 'CASCADE' })
  seller: Seller;

  @OneToMany(() => Clothing, (clothing) => clothing.store, { cascade: true })
  clothings: Clothing[];
}
