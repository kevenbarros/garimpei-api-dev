import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from '../store/store.entity';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  contact: string;

  @Column({ default: '' })
  instagram: string;

  @Column({ default: '' })
  cpf: string;

  @Column({ default: '' })
  email: string;

  @OneToMany(() => Store, (store) => store.seller, { cascade: true })
  stores: Store[];
}
