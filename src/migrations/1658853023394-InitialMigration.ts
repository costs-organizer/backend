import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1658853023394 implements MigrationInterface {
  name = 'InitialMigration1658853023394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordSalt" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_070157ac5f9096d1a00bab15aa" ON "user" ("username") WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d0012b9482ca5b4f270e6fdb5e" ON "user" ("email") WHERE "deletedAt" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0012b9482ca5b4f270e6fdb5e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_070157ac5f9096d1a00bab15aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
