import { DataSource } from 'typeorm';
import { Seller } from '../seller/seller.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // ajuste conforme seu ambiente
  password: 'postgres', // ajuste conforme seu ambiente
  database: 'garimpei', // ajuste conforme seu ambiente
  entities: [Seller],
});

async function seed() {
  await dataSource.initialize();

  const sellers = [
    {
      name: 'Gabriel Torres',
      password: 'senha123',
      contact: '11999991001',
      instagram: '@gabriel.torres',
      cpf: '321.654.987-00',
      email: 'gabriel@email.com',
    },
    {
      name: 'Helena Costa',
      password: 'senha123',
      contact: '11999991002',
      instagram: '@helena.costa',
      cpf: '654.321.987-00',
      email: 'helena@email.com',
    },
    {
      name: 'Igor Mendes',
      password: 'senha123',
      contact: '11999991003',
      instagram: '@igor.mendes',
      cpf: '789.123.456-00',
      email: 'igor@email.com',
    },
    {
      name: 'Juliana Prado',
      password: 'senha123',
      contact: '11999991004',
      instagram: '@juliana.prado',
      cpf: '456.789.123-00',
      email: 'juliana@email.com',
    },
    {
      name: 'Kleber Nunes',
      password: 'senha123',
      contact: '11999991005',
      instagram: '@kleber.nunes',
      cpf: '147.258.369-00',
      email: 'kleber@email.com',
    },
    {
      name: 'Larissa Dias',
      password: 'senha123',
      contact: '11999991006',
      instagram: '@larissa.dias',
      cpf: '963.852.741-00',
      email: 'larissa@email.com',
    },
  ];

  for (const sellerData of sellers) {
    const seller = dataSource.getRepository(Seller).create(sellerData);
    await dataSource.getRepository(Seller).save(seller);
  }

  await dataSource.destroy();
  console.log('Seed de sellers concluído!');
}

seed();
