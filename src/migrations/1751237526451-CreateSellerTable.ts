import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSellerTable1751237526451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "seller" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL DEFAULT '',
        "contact" VARCHAR(255) NOT NULL DEFAULT '',
        "instagram" VARCHAR(255) NOT NULL DEFAULT '',
        "cpf" VARCHAR(255) NOT NULL DEFAULT '',
        "email" VARCHAR(255) NOT NULL DEFAULT ''
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "seller"`);
  }
}
