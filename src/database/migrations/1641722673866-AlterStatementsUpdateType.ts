import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterStatementsUpdateType1641722673866 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE statements_type_enum ADD VALUE 'transfer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
