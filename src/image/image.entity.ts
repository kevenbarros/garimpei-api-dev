import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Clothing } from '../clothing/clothing.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Clothing, (clothing) => clothing.images, {
    onDelete: 'CASCADE',
  })
  clothing: Clothing;
}
