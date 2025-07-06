import { DataSource } from 'typeorm';
import { Clothing } from '../clothing/clothing.entity';
import { Store } from '../store/store.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // ajuste conforme seu ambiente
  password: 'postgres', // ajuste conforme seu ambiente
  database: 'garimpei', // ajuste conforme seu ambiente
  entities: [Clothing, Store],
});

async function seed() {
  await dataSource.initialize();

  // Busca os 6 primeiros stores cadastrados
  const stores = await dataSource.getRepository(Store).find({ take: 6 });

  const clothings = [
    {
      name: 'Vestido Floral',
      description: 'Vestido leve para o verão',
      initial_bid: 50.0,
      initial_date: '2025-07-01',
      initial_time: '10:00:00',
      end_date: '2025-07-10',
      end_time: '18:00:00',
      size: 'M',
      store: stores[0],
    },
    {
      name: 'Camisa Social',
      description: 'Camisa social branca, algodão',
      initial_bid: 30.0,
      initial_date: '2025-07-02',
      initial_time: '09:00:00',
      end_date: '2025-07-09',
      end_time: '17:00:00',
      size: 'G',
      store: stores[1],
    },
    {
      name: 'Jaqueta Jeans',
      description: 'Jaqueta jeans azul escuro',
      initial_bid: 80.0,
      initial_date: '2025-07-03',
      initial_time: '11:00:00',
      end_date: '2025-07-12',
      end_time: '20:00:00',
      size: 'P',
      store: stores[2],
    },
    {
      name: 'Saia Plissada',
      description: 'Saia plissada rosa claro',
      initial_bid: 40.0,
      initial_date: '2025-07-04',
      initial_time: '12:00:00',
      end_date: '2025-07-11',
      end_time: '19:00:00',
      size: 'M',
      store: stores[3],
    },
    {
      name: 'Blazer Preto',
      description: 'Blazer preto clássico',
      initial_bid: 100.0,
      initial_date: '2025-07-05',
      initial_time: '13:00:00',
      end_date: '2025-07-13',
      end_time: '21:00:00',
      size: 'G',
      store: stores[4],
    },
    {
      name: 'Calça Jeans Skinny',
      description: 'Calça jeans skinny azul',
      initial_bid: 60.0,
      initial_date: '2025-07-06',
      initial_time: '14:00:00',
      end_date: '2025-07-14',
      end_time: '22:00:00',
      size: 'M',
      store: stores[5],
    },
  ];

  for (const clothingData of clothings) {
    const clothing = dataSource.getRepository(Clothing).create(clothingData);
    await dataSource.getRepository(Clothing).save(clothing);
  }

  await dataSource.destroy();
  console.log('Seed de clothing concluído!');
}

seed();
