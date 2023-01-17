import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoneyAmountToCost1663540621386 implements MigrationInterface {
    name = 'AddMoneyAmountToCost1663540621386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cost" ADD "moneyAmount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cost" DROP COLUMN "moneyAmount"`);
    }

}
