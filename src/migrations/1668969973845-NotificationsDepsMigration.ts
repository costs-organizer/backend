import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsDepsMigration1668969973845
  implements MigrationInterface
{
  name = 'NotificationsDepsMigration1668969973845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group" ADD "groupResolvedNotificationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isCompleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "reminderNotificationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "groupId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_e13f4f84ccc2049bdb21880f145" FOREIGN KEY ("groupResolvedNotificationId") REFERENCES "notification"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_74fdf6680536395a2721a13abff" FOREIGN KEY ("reminderNotificationId") REFERENCES "notification"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_74fdf6680536395a2721a13abff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_e13f4f84ccc2049bdb21880f145"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "groupId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "reminderNotificationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "isCompleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP COLUMN "groupResolvedNotificationId"`,
    );
  }
}
