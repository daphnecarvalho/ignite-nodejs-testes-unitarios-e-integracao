import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatementsAddSendId1641720118414 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
                "statements",
                new TableColumn({
                    name: "sender_id",
                    type: "uuid",
                    isNullable: true,
                }),
            );

        await queryRunner.createForeignKey(
                "statements",
                new TableForeignKey({
                    name: "FK_User_Statements",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames: ["sender_id"],
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL",
                }),
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
                "statements",
                "FK_User_Statements",
            );

        await queryRunner.dropColumn("statements", "sender_id");
    }

}
