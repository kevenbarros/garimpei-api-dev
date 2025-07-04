import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoreTable1751237409902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "store" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" VARCHAR(255) NOT NULL DEFAULT '',
        "contact" VARCHAR(255) NOT NULL DEFAULT '',
        "instagram" VARCHAR(255) NOT NULL DEFAULT '',
        "address" VARCHAR(255) NOT NULL DEFAULT '',
        "sellerId" INTEGER NOT NULL,
        CONSTRAINT "FK_store_seller" FOREIGN KEY ("sellerId") REFERENCES "seller"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "store"`);
  }
}
