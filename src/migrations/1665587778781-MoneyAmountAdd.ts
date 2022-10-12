import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoneyAmountAdd1665587778781 implements MigrationInterface {
  name = 'MoneyAmountAdd1665587778781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "moneyAmount" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "moneyAmount"`,
    );
  }
}
