import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1656296684640 implements MigrationInterface {
    name = 'migrations1656296684640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subastas-reclamos\` (\`idreclamo\` int NOT NULL AUTO_INCREMENT, \`direccion\` varchar(255) NOT NULL, \`subastaid\` int NOT NULL, UNIQUE INDEX \`REL_ad84be26558e41bca9c110141a\` (\`subastaid\`), PRIMARY KEY (\`idreclamo\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pagos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`pujas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`invitaciones\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
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
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_f68ffbab81564bf6886882f9213\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_e1f12efabb0283c5ca2dd424e04\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_96d96ce66e5fd91b1969a7b8734\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`foto_subasta\` \`foto_subasta\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`productoid\` \`productoid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`paquete_bid_id\` \`paquete_bid_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`preciosubasta\` \`preciosubasta\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`winnerUserId\` \`winnerUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`ip\` \`ip\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`dispositivo\` \`dispositivo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_browser\` \`useragent_browser\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_version\` \`useragent_version\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_os\` \`useragent_os\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_platform\` \`useragent_platform\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_source\` \`useragent_source\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subastas-reclamos\` ADD CONSTRAINT \`FK_ad84be26558e41bca9c110141a5\` FOREIGN KEY (\`subastaid\`) REFERENCES \`subastas\`(\`idsubasta\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_f68ffbab81564bf6886882f9213\` FOREIGN KEY (\`productoid\`) REFERENCES \`productos\`(\`idproducto\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_e1f12efabb0283c5ca2dd424e04\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_96d96ce66e5fd91b1969a7b8734\` FOREIGN KEY (\`winnerUserId\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_96d96ce66e5fd91b1969a7b8734\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_e1f12efabb0283c5ca2dd424e04\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_f68ffbab81564bf6886882f9213\``);
        await queryRunner.query(`ALTER TABLE \`subastas-reclamos\` DROP FOREIGN KEY \`FK_ad84be26558e41bca9c110141a5\``);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_source\` \`useragent_source\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_platform\` \`useragent_platform\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_os\` \`useragent_os\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_version\` \`useragent_version\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`useragent_browser\` \`useragent_browser\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`dispositivo\` \`dispositivo\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`contacto\` CHANGE \`ip\` \`ip\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`winnerUserId\` \`winnerUserId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`preciosubasta\` \`preciosubasta\` float(12) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`paquete_bid_id\` \`paquete_bid_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`productoid\` \`productoid\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` CHANGE \`foto_subasta\` \`foto_subasta\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_96d96ce66e5fd91b1969a7b8734\` FOREIGN KEY (\`winnerUserId\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_e1f12efabb0283c5ca2dd424e04\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_f68ffbab81564bf6886882f9213\` FOREIGN KEY (\`productoid\`) REFERENCES \`productos\`(\`idproducto\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`invitaciones\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pujas\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pagos\` CHANGE \`date_created\` \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`DROP INDEX \`REL_ad84be26558e41bca9c110141a\` ON \`subastas-reclamos\``);
        await queryRunner.query(`DROP TABLE \`subastas-reclamos\``);
    }

}
