import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimecode1691000220668 implements MigrationInterface {
    name = 'AddTimecode1691000220668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_progression\` ADD \`timecode\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_progression\` DROP COLUMN \`timecode\``);
    }

}
