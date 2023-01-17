import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadByMigration1667584572933 implements MigrationInterface {
  name = 'AddReadByMigration1667584572933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "readBy" integer array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "moneyAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "moneyAmount" real NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "moneyAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "moneyAmount" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "readBy"`);
  }
}
