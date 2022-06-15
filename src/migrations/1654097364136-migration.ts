import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1654097364136 implements MigrationInterface {
    name = 'migration1654097364136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`paquete_bids\` (\`idpaquete\` int NOT NULL AUTO_INCREMENT, \`bonus\` int NOT NULL, \`cantidad_bids\` int NOT NULL, \`price\` float NOT NULL, \`background\` varchar(255) NOT NULL, \`status\` int NOT NULL, PRIMARY KEY (\`idpaquete\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pagos\` (\`idpago\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`paquete_bid_id\` int NOT NULL, \`amount\` float NOT NULL, \`cantidad_bids_total\` int NOT NULL, \`reference\` varchar(255) NOT NULL, \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`transaction_status\` varchar(255) NOT NULL, \`transaction_id\` varchar(255) NOT NULL, PRIMARY KEY (\`idpago\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pujas\` (\`idpuja\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`subastaid\` int NOT NULL, PRIMARY KEY (\`idpuja\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`iduser\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NULL, \`nombres\` varchar(255) NULL, \`apellidos\` varchar(255) NULL, \`hashed_rt\` varchar(255) NULL, \`email_user\` varchar(255) NULL, \`telefono\` varchar(255) NULL, \`password\` varchar(255) NULL, \`token\` varchar(255) NULL, \`image_profile\` varchar(255) NULL, \`status\` int NOT NULL DEFAULT '1', \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`facebook_id\` varchar(255) NULL, \`google_id\` varchar(255) NULL, \`bids\` int NOT NULL DEFAULT '0', \`rolid\` int NOT NULL, PRIMARY KEY (\`iduser\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`idrol\` int NOT NULL AUTO_INCREMENT, \`nombrerol\` varchar(255) NOT NULL, PRIMARY KEY (\`idrol\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favoritos\` (\`idfavorito\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`subastaid\` int NOT NULL, PRIMARY KEY (\`idfavorito\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subastas\` (\`idsubasta\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(255) NOT NULL, \`foto_subasta\` varchar(255) NULL, \`productoid\` int NOT NULL, \`paquete_bid_id\` int NULL, \`fecha_inicio\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_finalizacion\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`costopuja\` int NOT NULL, \`preciominimo\` float NOT NULL, \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`idsubasta\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`imagenes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`productoid\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`productos\` (\`idproducto\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`precio\` float NOT NULL, \`marca\` varchar(255) NOT NULL, \`ruta\` varchar(255) NOT NULL, \`codigo\` varchar(255) NOT NULL, \`codigo_tarjeta\` varchar(255) NOT NULL, \`categoriaid\` int NOT NULL, \`status\` int NOT NULL DEFAULT '1', \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`idproducto\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`idcategoria\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`ruta\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`portada\` varchar(255) NOT NULL, PRIMARY KEY (\`idcategoria\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contacto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`telefono\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`mensaje\` varchar(255) NOT NULL, \`ip\` varchar(255) NULL, \`dispositivo\` varchar(255) NULL, \`useragent_browser\` varchar(255) NULL, \`useragent_version\` varchar(255) NULL, \`useragent_os\` varchar(255) NULL, \`useragent_platform\` varchar(255) NULL, \`useragent_source\` varchar(255) NULL, \`date_created\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`correo\` varchar(255) NOT NULL, \`telefono\` varchar(255) NOT NULL, \`direccion\` varchar(255) NOT NULL, \`web\` varchar(255) NOT NULL, \`cantidad_subastas_inicio\` int NOT NULL, \`orden_categoria\` varchar(255) NOT NULL, \`bids_afiliados\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pagos\` ADD CONSTRAINT \`FK_695348508d59813b7aca5a6648a\` FOREIGN KEY (\`userid\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pagos\` ADD CONSTRAINT \`FK_e3c5ee9780e2fed79f914dabe20\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pujas\` ADD CONSTRAINT \`FK_f512c5af879f079ee6366ac8f0d\` FOREIGN KEY (\`userid\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pujas\` ADD CONSTRAINT \`FK_bd8da79370ce81cfb170356770f\` FOREIGN KEY (\`subastaid\`) REFERENCES \`subastas\`(\`idsubasta\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_31134bcc7608c8cb2dab5f52523\` FOREIGN KEY (\`rolid\`) REFERENCES \`roles\`(\`idrol\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_3f58fd858579ccc9ccda470b5b4\` FOREIGN KEY (\`userid\`) REFERENCES \`users\`(\`iduser\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_4cb2ab7575bd9c595a4701bc00d\` FOREIGN KEY (\`subastaid\`) REFERENCES \`subastas\`(\`idsubasta\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_f68ffbab81564bf6886882f9213\` FOREIGN KEY (\`productoid\`) REFERENCES \`productos\`(\`idproducto\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subastas\` ADD CONSTRAINT \`FK_e1f12efabb0283c5ca2dd424e04\` FOREIGN KEY (\`paquete_bid_id\`) REFERENCES \`paquete_bids\`(\`idpaquete\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_f1a07e9b4bdbc1315554c898be0\` FOREIGN KEY (\`categoriaid\`) REFERENCES \`categorias\`(\`idcategoria\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_f1a07e9b4bdbc1315554c898be0\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_e1f12efabb0283c5ca2dd424e04\``);
        await queryRunner.query(`ALTER TABLE \`subastas\` DROP FOREIGN KEY \`FK_f68ffbab81564bf6886882f9213\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_4cb2ab7575bd9c595a4701bc00d\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_3f58fd858579ccc9ccda470b5b4\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_31134bcc7608c8cb2dab5f52523\``);
        await queryRunner.query(`ALTER TABLE \`pujas\` DROP FOREIGN KEY \`FK_bd8da79370ce81cfb170356770f\``);
        await queryRunner.query(`ALTER TABLE \`pujas\` DROP FOREIGN KEY \`FK_f512c5af879f079ee6366ac8f0d\``);
        await queryRunner.query(`ALTER TABLE \`pagos\` DROP FOREIGN KEY \`FK_e3c5ee9780e2fed79f914dabe20\``);
        await queryRunner.query(`ALTER TABLE \`pagos\` DROP FOREIGN KEY \`FK_695348508d59813b7aca5a6648a\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
        await queryRunner.query(`DROP TABLE \`contacto\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
        await queryRunner.query(`DROP TABLE \`productos\``);
        await queryRunner.query(`DROP TABLE \`imagenes\``);
        await queryRunner.query(`DROP TABLE \`subastas\``);
        await queryRunner.query(`DROP TABLE \`favoritos\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`pujas\``);
        await queryRunner.query(`DROP TABLE \`pagos\``);
        await queryRunner.query(`DROP TABLE \`paquete_bids\``);
    }

}
