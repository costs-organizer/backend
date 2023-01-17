import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileUrlMigration1671091745962 implements MigrationInterface {
    name = 'AddFileUrlMigration1671091745962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "confirmationFileURL" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "confirmationFileURL"`);
    }

}
