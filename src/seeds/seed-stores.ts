import { DataSource } from 'typeorm';
import { Store } from '../store/store.entity';
import { Seller } from '../seller/seller.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // ajuste conforme seu ambiente
  password: 'postgres', // ajuste conforme seu ambiente
  database: 'garimpei', // ajuste conforme seu ambiente
  entities: [Store, Seller],
});

async function seed() {
  await dataSource.initialize();

  // Busca os 6 primeiros sellers cadastrados
  const sellers = await dataSource.getRepository(Seller).find({ take: 6 });

  const stores = [
    {
      name: 'Loja da Alice',
      description: 'Roupas femininas e acessórios',
      contact: '11988880001',
      instagram: '@lojadalice',
      address: 'Rua das Flores, 100',
      seller: sellers[0],
    },
    {
      name: 'Bruno Fashion',
      description: 'Moda masculina casual',
      contact: '11988880002',
      instagram: '@brunofashion',
      address: 'Av. Brasil, 200',
      seller: sellers[1],
    },
    {
      name: 'Carla Boutique',
      description: 'Boutique de roupas exclusivas',
      contact: '11988880003',
      instagram: '@carlaboutique',
      address: 'Rua das Acácias, 300',
      seller: sellers[2],
    },
    {
      name: 'Daniel Store',
      description: 'Moda jovem e descolada',
      contact: '11988880004',
      instagram: '@danielstore',
      address: 'Av. Paulista, 400',
      seller: sellers[3],
    },
    {
      name: 'Eduarda Modas',
      description: 'Roupas e acessórios femininos',
      contact: '11988880005',
      instagram: '@eduardamodas',
      address: 'Rua das Palmeiras, 500',
      seller: sellers[4],
    },
    {
      name: 'Felipe Outlet',
      description: 'Descontos em grandes marcas',
      contact: '11988880006',
      instagram: '@felipeoutlet',
      address: 'Av. Central, 600',
      seller: sellers[5],
    },
  ];

  for (const storeData of stores) {
    const store = dataSource.getRepository(Store).create(storeData);
    await dataSource.getRepository(Store).save(store);
  }

  await dataSource.destroy();
  console.log('Seed de stores concluído!');
}

seed();
