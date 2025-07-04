import { DataSource } from 'typeorm';
import { Buyer } from '../buyer/buyer.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // ajuste conforme seu ambiente
  password: 'postgres', // ajuste conforme seu ambiente
  database: 'garimpei', // ajuste conforme seu ambiente
  entities: [Buyer],
});

async function seed() {
  await dataSource.initialize();

  const buyers = [
    {
      name: 'Alice Silva',
      password: 'senha123',
      contact: '11999990001',
      instagram: '@alice.silva',
      cpf: '123.456.789-00',
      email: 'alice@email.com',
    },
    {
      name: 'Bruno Souza',
      password: 'senha123',
      contact: '11999990002',
      instagram: '@bruno.souza',
      cpf: '987.654.321-00',
      email: 'bruno@email.com',
    },
    {
      name: 'Carla Lima',
      password: 'senha123',
      contact: '11999990003',
      instagram: '@carla.lima',
      cpf: '111.222.333-44',
      email: 'carla@email.com',
    },
    {
      name: 'Daniel Rocha',
      password: 'senha123',
      contact: '11999990004',
      instagram: '@daniel.rocha',
      cpf: '555.666.777-88',
      email: 'daniel@email.com',
    },
    {
      name: 'Eduarda Martins',
      password: 'senha123',
      contact: '11999990005',
      instagram: '@eduarda.martins',
      cpf: '999.888.777-66',
      email: 'eduarda@email.com',
    },
    {
      name: 'Felipe Alves',
      password: 'senha123',
      contact: '11999990006',
      instagram: '@felipe.alves',
      cpf: '222.333.444-55',
      email: 'felipe@email.com',
    },
  ];

  for (const buyerData of buyers) {
    const buyer = dataSource.getRepository(Buyer).create(buyerData);
    await dataSource.getRepository(Buyer).save(buyer);
  }

  await dataSource.destroy();
  console.log('Seed de buyers concluído!');
}

seed();
