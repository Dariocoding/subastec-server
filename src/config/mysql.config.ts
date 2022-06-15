import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Categoria } from 'src/modules/categorias/entities';
import { Favorito } from 'src/modules/favoritos/entities';
import { Pago } from 'src/modules/pagos/entities/pago.entity';
import { Imagenes, Producto } from 'src/modules/productos/entities';
import { Puja } from 'src/modules/puja/entities/puja.entity';
import { Contacto } from 'src/modules/settings/contactos/entities';
import { PaqueteBid } from 'src/modules/settings/paquete-bids/entities/paquete-bid.entity';
import { Settings } from 'src/modules/settings/settings/entities';
import { SubastaDestacada } from 'src/modules/subastas-destacadas/entities/subastas-destacada.entity';
import { Subasta } from 'src/modules/subastas/entities';
import { Invitacion, Rol, User } from 'src/modules/users/entities';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const pathEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({ path: `${pathEnv}.env` });

const exportsData: TypeOrmModuleOptions = {
	namingStrategy: new SnakeNamingStrategy(),
	type: 'mysql',
	host: process.env.DB_HOST,
	port: parseInt(<string>process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: [
		Rol,
		User,
		Favorito,
		Pago,
		Settings,
		PaqueteBid,
		Producto,
		Categoria,
		Subasta,
		Contacto,
		Puja,
		Imagenes,
		Invitacion,
		SubastaDestacada,
	],
	synchronize: false,
	migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: './src/migrations',
	},
	migrationsRun: pathEnv === 'development' ? true : false,

	logging: pathEnv === 'development' ? true : false,
	autoLoadEntities: true,
};

export default exportsData;
