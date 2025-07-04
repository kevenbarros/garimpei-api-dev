import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImageTable1751237538725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "image" (
        "id" SERIAL PRIMARY KEY,
        "url" VARCHAR(255) NOT NULL,
        "clothingId" INTEGER NOT NULL,
        CONSTRAINT "FK_image_clothing" FOREIGN KEY ("clothingId") REFERENCES "clothing"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
