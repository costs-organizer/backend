import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFieldsMigration1670176411223 implements MigrationInterface {
    name = 'AddUserFieldsMigration1670176411223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "IBAN" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2ebc851cf69764b6478eef7ab0" ON "user" ("phone") WHERE "deletedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2ebc851cf69764b6478eef7ab0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "IBAN"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
