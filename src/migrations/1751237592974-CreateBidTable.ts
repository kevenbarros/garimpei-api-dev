import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBidTable1751237592974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "bid" (
        "id" SERIAL PRIMARY KEY,
        "bid" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "date" DATE,
        "time" TIME,
        "buyerId" INTEGER NOT NULL,
        "clothingId" INTEGER NOT NULL,
        CONSTRAINT "FK_bid_buyer" FOREIGN KEY ("buyerId") REFERENCES "buyer"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_bid_clothing" FOREIGN KEY ("clothingId") REFERENCES "clothing"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bid"`);
  }
}
