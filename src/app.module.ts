import { Global, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SettingsModule } from './modules/settings/settings/settings.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './modules/auth/common/guards';
import { MulterModule } from '@nestjs/platform-express';
import { ContactosModule } from './modules/settings/contactos/contactos.module';
import { MailModule } from './mail/mail.module';
import { SubastasModule } from './modules/subastas/subastas.module';
import { PaqueteBidsModule } from './modules/settings/paquete-bids/paquete-bids.module';
import { FavoritosModule } from './modules/favoritos/favoritos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceTypeOrm } from './config/mysql.config';
import { CustomExceptionsFilter } from './CustomExceptionFilter';
import { PujaModule } from './modules/puja/puja.module';
import { SubastasDestacadasModule } from './modules/subastas-destacadas/subastas-destacadas.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { SubastasReclamosModule } from './modules/subastas-reclamos/subastas-reclamos.module';

@Global()
@Module({
	imports: [
		ScheduleModule.forRoot(),
		TypeOrmModule.forRoot({ ...dataSourceTypeOrm, autoLoadEntities: true }),
		AuthModule,
		UsersModule,
		ProductosModule,
		CategoriasModule,
		MulterModule.register({
			dest: './public',
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `${
				process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
			}.env`,
		}),
		SettingsModule,
		ContactosModule,
		MailModule,
		SubastasModule,
		PaqueteBidsModule,
		FavoritosModule,
		PagosModule,
		DashboardModule,
		PujaModule,
		SubastasDestacadasModule,
		CronModule,
		SubastasReclamosModule,
	],

	providers: [
		{ provide: APP_GUARD, useClass: AtGuard },
		{ provide: APP_FILTER, useClass: CustomExceptionsFilter },
	],
})
export class AppModule {}
