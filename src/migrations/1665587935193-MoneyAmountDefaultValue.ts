import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoneyAmountDefaultValue1665587935193
  implements MigrationInterface
{
  name = 'MoneyAmountDefaultValue1665587935193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "moneyAmount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "moneyAmount"`,
    );
  }
}
