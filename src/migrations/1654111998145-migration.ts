import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1654111998145 implements MigrationInterface {
    name = 'migration1654111998145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invitaciones\` ADD \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`pagos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` DROP FOREIGN KEY \`FK_3cb6ef29c1b10bd4a61600811c3\``);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` ADD UNIQUE INDEX \`IDX_3cb6ef29c1b10bd4a61600811c\` (\`user_invited_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nombres\` \`nombres\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`apellidos\` \`apellidos\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`hashed_rt\` \`hashed_rt\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email_user\` \`email_user\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telefono\` \`telefono\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`token\` \`token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`image_profile\` \`image_profile\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`facebook_id\` \`facebook_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`google_id\` \`google_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_e1f12efabb0283c5ca2dd424e04\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`foto_subasta\` \`foto_subasta\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`paquete_bid_id\` \`paquete_bid_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`ip\` \`ip\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`dispositivo\` \`dispositivo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_browser\` \`useragent_browser\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_version\` \`useragent_version\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_os\` \`useragent_os\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_platform\` \`useragent_platform\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_source\` \`useragent_source\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_3cb6ef29c1b10bd4a61600811c\` ON \`invitaciones\` (\`user_invited_id\`)`);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` ADD CONSTRAINT \`FK_3cb6ef29c1b10bd4a61600811c3\` FOREIGN KEY (\`user_invited_id\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_e1f12efabb0283c5ca2dd424e04\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_e1f12efabb0283c5ca2dd424e04\``);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` DROP FOREIGN KEY \`FK_3cb6ef29c1b10bd4a61600811c3\``);
        await queryRunner.query(`DROP INDEX \`REL_3cb6ef29c1b10bd4a61600811c\` ON \`invitaciones\``);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_source\` \`useragent_source\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_platform\` \`useragent_platform\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_os\` \`useragent_os\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_version\` \`useragent_version\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_browser\` \`useragent_browser\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`dispositivo\` \`dispositivo\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`ip\` \`ip\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`paquete_bid_id\` \`paquete_bid_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`foto_subasta\` \`foto_subasta\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_e1f12efabb0283c5ca2dd424e04\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`google_id\` \`google_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`facebook_id\` \`facebook_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`image_profile\` \`image_profile\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`token\` \`token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telefono\` \`telefono\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email_user\` \`email_user\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`hashed_rt\` \`hashed_rt\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`apellidos\` \`apellidos\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nombres\` \`nombres\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` DROP INDEX \`IDX_3cb6ef29c1b10bd4a61600811c\``);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` ADD CONSTRAINT \`FK_3cb6ef29c1b10bd4a61600811c3\` FOREIGN KEY (\`user_invited_id\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` DROP COLUMN \`date_created\``);
    }

}
