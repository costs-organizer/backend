import { MigrationInterface, QueryRunner } from "typeorm";

export class NullifyDescriptionFieldMigration1667907094983 implements MigrationInterface {
    name = 'NullifyDescriptionFieldMigration1667907094983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "description" SET NOT NULL`);
    }

}
