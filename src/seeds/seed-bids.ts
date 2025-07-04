import { DataSource } from 'typeorm';
import { Bid } from '../bid/bid.entity';
import { Buyer } from '../buyer/buyer.entity';
import { Clothing } from '../clothing/clothing.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // ajuste conforme seu ambiente
  password: 'postgres', // ajuste conforme seu ambiente
  database: 'garimpei', // ajuste conforme seu ambiente
  entities: [Bid, Buyer, Clothing],
});

async function seed() {
  await dataSource.initialize();

  // Busca os 6 primeiros buyers e clothings cadastrados
  const buyers = await dataSource.getRepository(Buyer).find({ take: 6 });
  const clothings = await dataSource.getRepository(Clothing).find({ take: 6 });

  const bids = [
    {
      bid: 55.0,
      date: '2025-07-02',
      time: '11:00:00',
      buyer: buyers[0],
      clothing: clothings[0],
    },
    {
      bid: 35.0,
      date: '2025-07-03',
      time: '10:30:00',
      buyer: buyers[1],
      clothing: clothings[1],
    },
    {
      bid: 85.0,
      date: '2025-07-04',
      time: '12:15:00',
      buyer: buyers[2],
      clothing: clothings[2],
    },
    {
      bid: 45.0,
      date: '2025-07-05',
      time: '13:45:00',
      buyer: buyers[3],
      clothing: clothings[3],
    },
    {
      bid: 110.0,
      date: '2025-07-06',
      time: '15:00:00',
      buyer: buyers[4],
      clothing: clothings[4],
    },
    {
      bid: 65.0,
      date: '2025-07-07',
      time: '16:20:00',
      buyer: buyers[5],
      clothing: clothings[5],
    },
  ];

  for (const bidData of bids) {
    const bid = dataSource.getRepository(Bid).create(bidData);
    await dataSource.getRepository(Bid).save(bid);
  }

  await dataSource.destroy();
  console.log('Seed de bids concluído!');
}

seed();
