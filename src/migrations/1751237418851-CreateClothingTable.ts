import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClothingTable1751237418851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "clothing" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "initial_bid" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "initial_date" DATE,
        "initial_time" TIME,
        "end_date" DATE,
        "end_time" TIME,
        "size" VARCHAR(255) NOT NULL DEFAULT '',
        "storeId" INTEGER NOT NULL,
        CONSTRAINT "FK_clothing_store" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clothing"`);
  }
}
