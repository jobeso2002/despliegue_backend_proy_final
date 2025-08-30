import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEdadToUsuario1756523752621 implements MigrationInterface {
    name = 'AddEdadToUsuario1756523752621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "edad" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "edad"`);
    }

}
