import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseInit1690998860947 implements MigrationInterface {
    name = 'DatabaseInit1690998860947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_progression\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tmdbId\` varchar(255) NOT NULL, \`mediaType\` enum ('movie', 'show') NOT NULL, \`miscData\` varchar(255) NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`watchlist\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_progression\` ADD CONSTRAINT \`FK_1664980d6799f67c6b28cc7676f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_progression\` DROP FOREIGN KEY \`FK_1664980d6799f67c6b28cc7676f\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`user_progression\``);
    }

}
