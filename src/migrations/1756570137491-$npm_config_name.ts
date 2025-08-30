import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1756570137491 implements MigrationInterface {
    name = ' $npmConfigName1756570137491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "edad" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "edad"`);
    }

}
