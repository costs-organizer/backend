import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1659908900693 implements MigrationInterface {
  name = 'InitialMigration1659908900693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cost" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdById" integer, "groupId" integer, CONSTRAINT "PK_9457483cde444b1dd32aacb24bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9457483cde444b1dd32aacb24b" ON "cost" ("id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('TRANSACTION_RECEIVED', 'GROUP_SETTLED', 'REMINDER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "description" character varying NOT NULL, "createdById" integer, "groupId" integer, "type" "public"."notification_type_enum" NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_705b6c7cdf9b2c2ff7ac7872cb" ON "notification" ("id") `,
    );
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
    await queryRunner.query(
      `CREATE TABLE "group" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "createdById" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_256aa0fda9b1de1a73ee0b7106" ON "group" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "receiverId" integer, "payerId" integer, "groupId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89eadb93a89810556e1cbcd6ab" ON "transaction" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cost_participants_user" ("costId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d159884621448e84a44de72a33b" PRIMARY KEY ("costId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e86ae963cfd485bd6c2484775" ON "cost_participants_user" ("costId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9861752bbf8f03a72dc3db207" ON "cost_participants_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_receivers_user" ("notificationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_dae974f2263439724e1b37747c5" PRIMARY KEY ("notificationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca091cd6fcfc7b55d83cf306bf" ON "notification_receivers_user" ("notificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7dfd3dd996e06fe47828d1c93d" ON "notification_receivers_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "group_members_user" ("groupId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_7170c9a27e7b823d391d9e11f2e" PRIMARY KEY ("groupId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfa303089d367a2e3c02b002b8" ON "group_members_user" ("groupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_427107c650638bcb2f1e167d2e" ON "group_members_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cost" ADD CONSTRAINT "FK_0414089fd9454020ee54b24a415" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost" ADD CONSTRAINT "FK_bd7de002d76c78a78e4be0fc0af" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_ab94760702f01d400c4e845fbe6" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_7185cb5bc0826915be077f0d882" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_e32e0d2862e47419a5bb7370787" FOREIGN KEY ("payerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_05749c68cee9f1fbc8e33040970" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost_participants_user" ADD CONSTRAINT "FK_2e86ae963cfd485bd6c24847752" FOREIGN KEY ("costId") REFERENCES "cost"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost_participants_user" ADD CONSTRAINT "FK_e9861752bbf8f03a72dc3db2074" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" ADD CONSTRAINT "FK_ca091cd6fcfc7b55d83cf306bfc" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" ADD CONSTRAINT "FK_7dfd3dd996e06fe47828d1c93db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_427107c650638bcb2f1e167d2e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_427107c650638bcb2f1e167d2e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" DROP CONSTRAINT "FK_7dfd3dd996e06fe47828d1c93db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" DROP CONSTRAINT "FK_ca091cd6fcfc7b55d83cf306bfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost_participants_user" DROP CONSTRAINT "FK_e9861752bbf8f03a72dc3db2074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost_participants_user" DROP CONSTRAINT "FK_2e86ae963cfd485bd6c24847752"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_05749c68cee9f1fbc8e33040970"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_e32e0d2862e47419a5bb7370787"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_7185cb5bc0826915be077f0d882"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_2f7dcc604f60fce7609d29d809e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_ab94760702f01d400c4e845fbe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost" DROP CONSTRAINT "FK_bd7de002d76c78a78e4be0fc0af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cost" DROP CONSTRAINT "FK_0414089fd9454020ee54b24a415"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_427107c650638bcb2f1e167d2e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bfa303089d367a2e3c02b002b8"`,
    );
    await queryRunner.query(`DROP TABLE "group_members_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7dfd3dd996e06fe47828d1c93d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca091cd6fcfc7b55d83cf306bf"`,
    );
    await queryRunner.query(`DROP TABLE "notification_receivers_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e9861752bbf8f03a72dc3db207"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e86ae963cfd485bd6c2484775"`,
    );
    await queryRunner.query(`DROP TABLE "cost_participants_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_89eadb93a89810556e1cbcd6ab"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_256aa0fda9b1de1a73ee0b7106"`,
    );
    await queryRunner.query(`DROP TABLE "group"`);
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_705b6c7cdf9b2c2ff7ac7872cb"`,
    );
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9457483cde444b1dd32aacb24b"`,
    );
    await queryRunner.query(`DROP TABLE "cost"`);
  }
}
